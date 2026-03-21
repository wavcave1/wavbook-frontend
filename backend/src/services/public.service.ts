import type { Prisma, Studio, StudioMedia } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../lib/http.js';
import { durationMinutes, getChargeAmounts, getPriceMap } from '../lib/pricing.js';
import { stripe } from '../lib/stripe.js';

type PublicStudioRecord = Studio & { media: StudioMedia[] };

const publicStudioArgs = {
  where: { isPublic: true },
  include: {
    media: {
      orderBy: [{ sortOrder: 'asc' as const }],
    },
  },
} satisfies Prisma.StudioFindManyArgs;

const mapPublicStudio = (studio: PublicStudioRecord) => ({
  id: studio.id,
  slug: studio.slug,
  displayName: studio.publicDisplayName,
  studioName: studio.name,
  publishedAt: studio.publishedAt?.toISOString() ?? null,
  about: studio.about,
  timezone: studio.timezone,
  email: studio.email,
  phone: studio.phone,
  address: studio.address,
  serviceArea: studio.serviceArea,
  bookingPolicy: studio.bookingPolicy,
  bookingLinkMode: studio.bookingLinkMode as 'internal' | 'external',
  externalBookingUrl: studio.externalBookingUrl,
  logo: studio.media.find((item) => item.mediaType === 'logo')
    ? {
        mediaType: 'logo' as const,
        url: studio.media.find((item) => item.mediaType === 'logo')!.url,
        altText: studio.media.find((item) => item.mediaType === 'logo')!.altText,
        label: studio.media.find((item) => item.mediaType === 'logo')!.label,
      }
    : null,
  heroImage: studio.media.find((item) => item.mediaType === 'hero')
    ? {
        mediaType: 'hero' as const,
        url: studio.media.find((item) => item.mediaType === 'hero')!.url,
        altText: studio.media.find((item) => item.mediaType === 'hero')!.altText,
        label: studio.media.find((item) => item.mediaType === 'hero')!.label,
      }
    : null,
  gallery: studio.media
    .filter((item) => item.mediaType === 'gallery')
    .map((item) => ({ mediaType: 'gallery' as const, url: item.url, altText: item.altText, label: item.label })),
});

const mapBooking = (booking: Awaited<ReturnType<typeof prisma.booking.findFirstOrThrow>>) => ({
  id: booking.id,
  studio_id: booking.studioId,
  stripe_payment_intent_id: booking.stripePaymentIntentId,
  service: booking.service,
  payment_type: booking.paymentType,
  customer_name: booking.customerName,
  customer_email: booking.customerEmail,
  customer_phone: booking.customerPhone,
  start_time: booking.startTime.toISOString(),
  end_time: booking.endTime.toISOString(),
  timezone: booking.timezone,
  booking_status: booking.bookingStatus,
  payment_status: booking.paymentStatus,
  created_at: booking.createdAt.toISOString(),
  notes: booking.notes,
});

export const publicService = {
  async getMarketplaceHome() {
    const studios = await prisma.studio.findMany({
      ...publicStudioArgs,
      orderBy: { publishedAt: 'desc' },
      take: 12,
    });

    const mapped = studios.map(mapPublicStudio);
    return {
      count: mapped.length,
      featured: mapped.slice(0, 6),
      newest: mapped.slice(0, 6),
      locations: Array.from(new Set(mapped.map((studio) => studio.serviceArea || studio.address).filter(Boolean))),
    };
  },

  async searchStudios(query: { q?: string; location?: string }) {
    const studios = await prisma.studio.findMany({
      include: publicStudioArgs.include,
      where: {
        isPublic: true,
        AND: [
          query.q
            ? {
                OR: [
                  { publicDisplayName: { contains: query.q, mode: 'insensitive' } },
                  { name: { contains: query.q, mode: 'insensitive' } },
                  { slug: { contains: query.q, mode: 'insensitive' } },
                  { about: { contains: query.q, mode: 'insensitive' } },
                ],
              }
            : {},
          query.location
            ? {
                OR: [
                  { address: { contains: query.location, mode: 'insensitive' } },
                  { serviceArea: { contains: query.location, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      orderBy: { publishedAt: 'desc' },
    });

    return {
      filters: { query: query.q ?? '', location: query.location ?? '' },
      count: studios.length,
      studios: studios.map(mapPublicStudio),
    };
  },

  async getStudio(slug: string) {
    const studio = await prisma.studio.findFirst({
      where: { slug, isPublic: true },
      include: publicStudioArgs.include,
    });

    if (!studio) throw new HttpError(404, 'Studio not found');
    return mapPublicStudio(studio);
  },

  async getAvailability(slug: string, start: Date, end: Date) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const [bookings, blocks] = await Promise.all([
      prisma.booking.findMany({
        where: {
          studioId: studio.id,
          bookingStatus: { in: ['confirmed', 'completed'] },
          startTime: { lt: end },
          endTime: { gt: start },
        },
      }),
      prisma.availabilityBlock.findMany({
        where: {
          studioId: studio.id,
          startTime: { lt: end },
          endTime: { gt: start },
        },
      }),
    ]);

    return {
      studio: { id: studio.id, slug: studio.slug, name: studio.name },
      busy: [
        ...bookings.map((booking) => ({
          id: booking.id,
          start_time: booking.startTime.toISOString(),
          end_time: booking.endTime.toISOString(),
          type: 'booking' as const,
        })),
        ...blocks.map((block) => ({
          id: block.id,
          start_time: block.startTime.toISOString(),
          end_time: block.endTime.toISOString(),
          type: 'block' as const,
        })),
      ],
    };
  },

  async getPrices(date?: Date) {
    return getPriceMap(date);
  },

  async createPaymentIntent(input: {
    studioSlug: string;
    service: keyof typeof durationMinutes;
    paymentType: 'full' | 'deposit';
    name: string;
    email: string;
    phone: string;
    date: Date;
  }) {
    const studio = await prisma.studio.findUnique({ where: { slug: input.studioSlug } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const endTime = new Date(input.date.getTime() + durationMinutes[input.service] * 60000);

    const [overlappingBookings, overlappingBlocks] = await Promise.all([
      prisma.booking.count({
        where: {
          studioId: studio.id,
          bookingStatus: { in: ['confirmed', 'completed'] },
          startTime: { lt: endTime },
          endTime: { gt: input.date },
        },
      }),
      prisma.availabilityBlock.count({
        where: {
          studioId: studio.id,
          startTime: { lt: endTime },
          endTime: { gt: input.date },
        },
      }),
    ]);

    if (overlappingBookings || overlappingBlocks) {
      throw new HttpError(409, 'Selected time is no longer available');
    }

    const { fullAmountCents, amountDueNowCents } = getChargeAmounts(input.service, input.paymentType, input.date);

    const intent = await stripe.paymentIntents.create({
      amount: amountDueNowCents,
      currency: 'usd',
      receipt_email: input.email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        studioSlug: studio.slug,
        service: input.service,
        paymentType: input.paymentType,
        bookingStart: input.date.toISOString(),
        bookingEnd: endTime.toISOString(),
        customerName: input.name,
        customerEmail: input.email,
        customerPhone: input.phone,
      },
    });

    await prisma.booking.upsert({
      where: { stripePaymentIntentId: intent.id },
      update: {
        paymentStatus: 'pending',
        amountTotal: fullAmountCents,
        amountDueNow: amountDueNowCents,
      },
      create: {
        studioId: studio.id,
        stripePaymentIntentId: intent.id,
        service: input.service,
        paymentType: input.paymentType,
        customerName: input.name,
        customerEmail: input.email,
        customerPhone: input.phone,
        startTime: input.date,
        endTime,
        timezone: studio.timezone,
        bookingStatus: 'confirmed',
        paymentStatus: 'pending',
        amountTotal: fullAmountCents,
        amountDueNow: amountDueNowCents,
      },
    });

    return { clientSecret: intent.client_secret };
  },

  async getPaymentIntentStatus(paymentIntentId: string) {
    const booking = await prisma.booking.findUnique({ where: { stripePaymentIntentId: paymentIntentId } });

    if (!booking) {
      return { status: 'not_found' as const };
    }

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const status = intent.status;

    if (status === 'succeeded') {
      return {
        status: 'confirmed' as const,
        booking: mapBooking(booking as never),
      };
    }

    if (status === 'requires_payment_method' || status === 'canceled') {
      return { status: 'failed' as const, error: 'Payment was not completed.' };
    }

    return { status: 'pending' as const };
  },
};
