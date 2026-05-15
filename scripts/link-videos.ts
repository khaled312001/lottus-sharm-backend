// Distribute existing VIDEO media rows across trip galleries so videos appear in the public gallery.
// Idempotent: skips videos already linked to any trip.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.media.findMany({ where: { type: 'VIDEO' }, orderBy: { id: 'asc' } });
  const trips = await prisma.trip.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } });

  console.log(`Found ${videos.length} videos, ${trips.length} trips`);

  if (videos.length === 0 || trips.length === 0) {
    console.log('Nothing to link.');
    return;
  }

  const existing = await prisma.tripMedia.findMany({
    where: { mediaId: { in: videos.map((v) => v.id) } },
    select: { mediaId: true },
  });
  const alreadyLinked = new Set(existing.map((e) => e.mediaId));

  let linked = 0;
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    if (alreadyLinked.has(video.id)) {
      console.log(`  skip video #${video.id} (already linked)`);
      continue;
    }
    const trip = trips[i % trips.length];
    const maxOrder = await prisma.tripMedia.aggregate({
      _max: { order: true },
      where: { tripId: trip.id },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;
    await prisma.tripMedia.create({
      data: { tripId: trip.id, mediaId: video.id, order: nextOrder },
    });
    console.log(`  ✓ video #${video.id} (${video.filename}) → trip ${trip.slug} (order ${nextOrder})`);
    linked++;
  }

  console.log(`\nLinked ${linked} new videos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
