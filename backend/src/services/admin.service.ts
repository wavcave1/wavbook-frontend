import type { AvailabilityBlock, Booking, Studio, StudioMedia, StudioMembership, UserProfile } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../lib/http.js';

type StudioWithMedia = Studio & { media: StudioMedia[] };
type BookingRecord = Booking;
type TeamMembership = StudioMembership & { userProfile: UserProfile };

const publicationForStudio = (studio: StudioWithMedia) => {
  const requiredFields = [
    !studio.publicDisplayName && 'public_display_name',
    !studio.about && 'about',
    !studio.email && 'email',
    !studio.phone && 'phone',
    !studio.address && 'address',
    !studio.bookingPolicy && 'booking_policy',
    !studio.media.some((item) => item.mediaType === 'hero') && 'hero_image',
  ].filter(Boolean) as string[];

  return {
    isPublic: studio.isPublic,
    publishReady: requiredFields.length === 0,
    publishedAt: studio.publishedAt?.toISOString() ?? null,
    requiredFields,
  };
};

const mapStudio = (studio: StudioWithMedia) => ({
  id: studio.id,
  name: studio.name,
  public_display_name: studio.publicDisplayName,
  slug: studio.slug,
  timezone: studio.timezone,
  email: studio.email,
  phone: studio.phone,
  address: studio.address,
  service_area: studio.serviceArea,
  is_public: studio.isPublic,
  booking_link_mode: studio.bookingLinkMode,
  external_booking_url: studio.externalBookingUrl,
  published_at: studio.publishedAt?.toISOString() ?? null,
  created_at: studio.createdAt.toISOString(),
  updated_at: studio.updatedAt.toISOString(),
  publication: publicationForStudio(studio),
});

const bookingToResponse = (booking: BookingRecord) => ({
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

const blockToResponse = (item: AvailabilityBlock) => ({
  id: item.id,
  studio_id: item.studioId,
  start_time: item.startTime.toISOString(),
  end_time: item.endTime.toISOString(),
  timezone: item.timezone,
  reason: item.reason,
  created_by_admin: item.createdByAdminId,
  created_at: item.createdAt.toISOString(),
});

export const adminService = {
  async getStudio(slug: string) {
    const studio = await prisma.studio.findUnique({ where: { slug }, include: { media: true } });
    if (!studio) throw new HttpError(404, 'Studio not found');
    return mapStudio(studio);
  },

  async updateStudio(slug: string, payload: Record<string, string | boolean | null | undefined>) {
    const studio = await prisma.studio.update({
      where: { slug },
      data: {
        name: (payload.name as string | undefined) ?? undefined,
        publicDisplayName: (payload.public_display_name as string | undefined) ?? undefined,
        timezone: (payload.timezone as string | undefined) ?? undefined,
        email: (payload.email as string | undefined) ?? undefined,
        phone: (payload.phone as string | undefined) ?? undefined,
        address: (payload.address as string | undefined) ?? undefined,
        serviceArea: (payload.service_area as string | undefined) ?? undefined,
        bookingLinkMode: (payload.booking_link_mode as string | undefined) ?? undefined,
        externalBookingUrl: payload.external_booking_url as string | null | undefined,
        isPublic: typeof payload.is_public === 'boolean' ? payload.is_public : undefined,
        about: (payload.about as string | undefined) ?? undefined,
      },
      include: { media: true },
    });

    return mapStudio(studio);
  },

  async getPublication(slug: string) {
    const studio = await prisma.studio.findUnique({ where: { slug }, include: { media: true } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const publication = publicationForStudio(studio);
    return { publication, required_fields: publication.requiredFields };
  },

  async setPublication(slug: string, action: 'publish' | 'unpublish') {
    const studio = await prisma.studio.findUnique({ where: { slug }, include: { media: true } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const publication = publicationForStudio(studio);
    if (action === 'publish' && !publication.publishReady) {
      throw new HttpError(400, 'Studio is not ready to publish', publication.requiredFields);
    }

    const updated = await prisma.studio.update({
      where: { slug },
      data: {
        isPublic: action === 'publish',
        publishedAt: action === 'publish' ? new Date() : null,
      },
      include: { media: true },
    });

    const nextPublication = publicationForStudio(updated);
    return { publication: nextPublication, required_fields: nextPublication.requiredFields };
  },

  async getStudioSettings(slug: string) {
    const studio = await prisma.studio.findUnique({ where: { slug }, include: { media: true } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    return {
      studio_id: studio.id,
      booking_policy: studio.bookingPolicy,
      cancellation_policy: studio.cancellationPolicy,
      arrival_instructions: studio.arrivalInstructions,
      parking_info: studio.parkingInfo,
      brand_primary_color: studio.brandPrimaryColor,
      brand_secondary_color: studio.brandSecondaryColor,
      created_at: studio.createdAt.toISOString(),
      updated_at: studio.updatedAt.toISOString(),
      publication: publicationForStudio(studio),
    };
  },

  async updateStudioSettings(slug: string, payload: Record<string, string | undefined>) {
    const studio = await prisma.studio.update({
      where: { slug },
      data: {
        bookingPolicy: payload.booking_policy,
        cancellationPolicy: payload.cancellation_policy,
        arrivalInstructions: payload.arrival_instructions,
        parkingInfo: payload.parking_info,
        brandPrimaryColor: payload.brand_primary_color,
        brandSecondaryColor: payload.brand_secondary_color,
      },
      include: { media: true },
    });

    return {
      studio_id: studio.id,
      booking_policy: studio.bookingPolicy,
      cancellation_policy: studio.cancellationPolicy,
      arrival_instructions: studio.arrivalInstructions,
      parking_info: studio.parkingInfo,
      brand_primary_color: studio.brandPrimaryColor,
      brand_secondary_color: studio.brandSecondaryColor,
      created_at: studio.createdAt.toISOString(),
      updated_at: studio.updatedAt.toISOString(),
      publication: publicationForStudio(studio),
    };
  },

  async getStudioMedia(slug: string) {
    const studio = await prisma.studio.findUnique({ where: { slug }, include: { media: { orderBy: [{ sortOrder: 'asc' }] } } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const publication = publicationForStudio(studio as StudioWithMedia);
    return {
      items: studio.media.map((item) => ({
        id: item.id,
        studio_id: item.studioId,
        media_type: item.mediaType,
        label: item.label,
        url: item.url,
        alt_text: item.altText,
        sort_order: item.sortOrder,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      })),
      publication,
    };
  },

  async replaceStudioMedia(slug: string, items: Array<Record<string, string | number>>) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    await prisma.$transaction(async (tx) => {
      await tx.studioMedia.deleteMany({ where: { studioId: studio.id } });
      await tx.studioMedia.createMany({
        data: items.map((item, index) => ({
          studioId: studio.id,
          mediaType: String(item.media_type) as 'logo' | 'hero' | 'gallery',
          label: String(item.label ?? ''),
          url: String(item.url ?? ''),
          altText: String(item.alt_text ?? ''),
          sortOrder: Number(item.sort_order ?? index),
        })),
      });
    });

    return this.getStudioMedia(slug);
  },

  async listBookings(slug: string, filters: Record<string, string | number | undefined>) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const page = Number(filters.page ?? 1);
    const pageSize = Number(filters.pageSize ?? 20);
    const where: Record<string, unknown> = {
      studioId: studio.id,
      ...(filters.query
        ? {
            OR: [
              { customerName: { contains: String(filters.query), mode: 'insensitive' } },
              { customerEmail: { contains: String(filters.query), mode: 'insensitive' } },
              { stripePaymentIntentId: { contains: String(filters.query), mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(filters.service ? { service: String(filters.service) } : {}),
      ...(filters.booking_status ? { bookingStatus: String(filters.booking_status) } : {}),
      ...(filters.payment_status ? { paymentStatus: String(filters.payment_status) } : {}),
    };

    if (filters.start || filters.end) {
      where.startTime = {
        ...(filters.start ? { gte: new Date(String(filters.start)) } : {}),
      };
      where.endTime = {
        ...(filters.end ? { lte: new Date(String(filters.end)) } : {}),
      };
    }

    const [total, items] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        orderBy: { startTime: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      page,
      pageSize,
      total,
      items: items.map(bookingToResponse),
    };
  },

  async getBooking(slug: string, bookingId: string) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');
    const booking = await prisma.booking.findFirst({ where: { id: bookingId, studioId: studio.id } });
    if (!booking) throw new HttpError(404, 'Booking not found');
    return bookingToResponse(booking);
  },

  async updateBooking(slug: string, bookingId: string, payload: Record<string, string | undefined>) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');
    const existing = await prisma.booking.findFirst({ where: { id: bookingId, studioId: studio.id } });
    if (!existing) throw new HttpError(404, 'Booking not found');
    const booking = await prisma.booking.update({
      where: { id: existing.id },
      data: {
        bookingStatus: payload.booking_status as Booking['bookingStatus'] | undefined,
        notes: payload.notes,
      },
    });
    return bookingToResponse(booking);
  },

  async listBlocks(slug: string, range: { start?: string; end?: string }) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const items = await prisma.availabilityBlock.findMany({
      where: {
        studioId: studio.id,
        ...(range.start ? { endTime: { gt: new Date(range.start) } } : {}),
        ...(range.end ? { startTime: { lt: new Date(range.end) } } : {}),
      },
      orderBy: { startTime: 'asc' },
    });

    return {
      items: items.map(blockToResponse),
    };
  },

  async createBlock(slug: string, input: { start_time: string; end_time: string; reason: string; createdByAdminId?: string | null }) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');

    const block = await prisma.availabilityBlock.create({
      data: {
        studioId: studio.id,
        startTime: new Date(input.start_time),
        endTime: new Date(input.end_time),
        timezone: studio.timezone,
        reason: input.reason,
        createdByAdminId: input.createdByAdminId,
      },
    });

    return blockToResponse(block);
  },

  async deleteBlock(slug: string, blockId: string) {
    const studio = await prisma.studio.findUnique({ where: { slug } });
    if (!studio) throw new HttpError(404, 'Studio not found');
    const existing = await prisma.availabilityBlock.findFirst({ where: { id: blockId, studioId: studio.id } });
    if (!existing) throw new HttpError(404, 'Block not found');
    await prisma.availabilityBlock.delete({ where: { id: existing.id } });
    return { success: true as const };
  },

  async listTeam(slug: string) {
    const studio = await prisma.studio.findUnique({
      where: { slug },
      include: { memberships: { include: { userProfile: true }, orderBy: { createdAt: 'asc' } } },
    });
    if (!studio) throw new HttpError(404, 'Studio not found');

    return {
      items: (studio.memberships as TeamMembership[]).map((membership) => ({
        id: membership.id,
        role: membership.role,
        created_at: membership.createdAt.toISOString(),
        user_id: membership.userProfile.auth0UserId,
        email: membership.userProfile.email,
      })),
    };
  },
};
