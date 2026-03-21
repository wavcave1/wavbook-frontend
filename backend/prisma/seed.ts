import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const studio = await prisma.studio.upsert({
    where: { slug: 'wav-cave-atl' },
    update: {},
    create: {
      slug: 'wav-cave-atl',
      name: 'WAV CAVE Atlanta',
      publicDisplayName: 'WAV CAVE Atlanta',
      timezone: 'America/New_York',
      email: 'bookings@example.com',
      phone: '+1 (404) 555-0199',
      address: '123 Peachtree St NE, Atlanta, GA',
      serviceArea: 'Atlanta, Georgia',
      about: 'Premium recording and content studio with flexible lockouts and engineer-ready rooms.',
      bookingPolicy: 'Bookings are confirmed after Stripe payment clears and availability remains valid.',
      cancellationPolicy: 'Cancellations within 48 hours are non-refundable.',
      arrivalInstructions: 'Check in at the front desk 10 minutes before your session.',
      parkingInfo: 'Validated deck parking is available next to the building.',
      isPublic: true,
      publishedAt: new Date(),
      media: {
        create: [
          {
            mediaType: 'hero',
            label: 'Main room',
            url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
            altText: 'Recording studio hero',
            sortOrder: 0,
          },
          {
            mediaType: 'logo',
            label: 'Brand logo',
            url: 'https://dummyimage.com/320x320/191b2a/ffffff&text=WC',
            altText: 'WAV CAVE logo',
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.availabilityBlock.createMany({
    data: [
      {
        studioId: studio.id,
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 28),
        endTime: new Date(Date.now() + 1000 * 60 * 60 * 30),
        timezone: studio.timezone,
        reason: 'Maintenance block',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded studio ${studio.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
