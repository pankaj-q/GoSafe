import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create cities
  const cities = [
    { name: 'Delhi', state: 'Delhi', slug: 'delhi' },
    { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai' },
    { name: 'Bangalore', state: 'Karnataka', slug: 'bangalore' },
    { name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad' },
    { name: 'Varanasi', state: 'Uttar Pradesh', slug: 'varanasi' },
    { name: 'Jaipur', state: 'Rajasthan', slug: 'jaipur' },
    { name: 'Lucknow', state: 'Uttar Pradesh', slug: 'lucknow' },
    { name: 'Patna', state: 'Bihar', slug: 'patna' },
    { name: 'Ahmedabad', state: 'Gujarat', slug: 'ahmedabad' },
    { name: 'Pune', state: 'Maharashtra', slug: 'pune' },
    { name: 'Chennai', state: 'Tamil Nadu', slug: 'chennai' },
    { name: 'Kolkata', state: 'West Bengal', slug: 'kolkata' },
    { name: 'Chandigarh', state: 'Chandigarh', slug: 'chandigarh' },
    { name: 'Agra', state: 'Uttar Pradesh', slug: 'agra' },
    { name: 'Haridwar', state: 'Uttarakhand', slug: 'haridwar' },
    { name: 'Dehradun', state: 'Uttarakhand', slug: 'dehradun' },
  ]

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    })
  }

  const delhi = (await prisma.city.findUnique({ where: { slug: 'delhi' } }))!
  const varanasi = (await prisma.city.findUnique({ where: { slug: 'varanasi' } }))!
  const mumbai = (await prisma.city.findUnique({ where: { slug: 'mumbai' } }))!
  const jaipur = (await prisma.city.findUnique({ where: { slug: 'jaipur' } }))!
  const lucknow = (await prisma.city.findUnique({ where: { slug: 'lucknow' } }))!
  const hyderabad = (await prisma.city.findUnique({ where: { slug: 'hyderabad' } }))!

  // Create route
  const route = await prisma.route.upsert({
    where: { sourceId_destId: { sourceId: delhi.id, destId: varanasi.id } },
    update: {},
    create: { sourceId: delhi.id, destId: varanasi.id, distanceKm: 820 },
  })

  await prisma.route.upsert({
    where: { sourceId_destId: { sourceId: delhi.id, destId: mumbai.id } },
    update: {},
    create: { sourceId: delhi.id, destId: mumbai.id, distanceKm: 1400 },
  })

  await prisma.route.upsert({
    where: { sourceId_destId: { sourceId: delhi.id, destId: jaipur.id } },
    update: {},
    create: { sourceId: delhi.id, destId: jaipur.id, distanceKm: 280 },
  })

  await prisma.route.upsert({
    where: { sourceId_destId: { sourceId: delhi.id, destId: lucknow.id } },
    update: {},
    create: { sourceId: delhi.id, destId: lucknow.id, distanceKm: 550 },
  })

  await prisma.route.upsert({
    where: { sourceId_destId: { sourceId: delhi.id, destId: hyderabad.id } },
    update: {},
    create: { sourceId: delhi.id, destId: hyderabad.id, distanceKm: 1550 },
  })

  // Create amenities
  const amenityNames = [
    'Charging Port', 'WiFi', 'Blanket', 'Water Bottle', 'Reading Light',
    'Emergency Exit', 'First Aid', 'CCTV', 'Snacks', 'Pillow',
  ]
  for (const name of amenityNames) {
    await prisma.amenity.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // Create operator
  const operator = await prisma.operator.upsert({
    where: { email: 'royal@travels.com' },
    update: {},
    create: {
      name: 'Royal Travels',
      companyName: 'Royal Bus Services Pvt Ltd',
      email: 'royal@travels.com',
      phone: '9876543210',
      passwordHash: 'dummy',
      logo: null,
      isApproved: true,
      commissionPct: 15,
    },
  })

  const operator2 = await prisma.operator.upsert({
    where: { email: 'balaji@travels.com' },
    update: {},
    create: {
      name: 'Shree Balaji Travels',
      companyName: 'Balaji Bus Services',
      email: 'balaji@travels.com',
      phone: '9876543211',
      passwordHash: 'dummy',
      logo: null,
      isApproved: true,
      commissionPct: 12,
    },
  })

  // Create buses
  const bus1 = await prisma.bus.create({
    data: {
      operatorId: operator.id,
      busNumber: 'RT-001',
      registrationNo: 'DL-01-AB-1234',
      busType: 'AC_SLEEPER',
      totalSeats: 32,
      seatLayout: '2X1',
      model: 'Volvo 9400',
      year: 2024,
      rating: 4.3,
      totalRatings: 234,
    },
  })

  const bus2 = await prisma.bus.create({
    data: {
      operatorId: operator2.id,
      busNumber: 'SB-001',
      registrationNo: 'DL-02-CD-5678',
      busType: 'VOLVO_SLEEPER',
      totalSeats: 28,
      seatLayout: '2X1',
      model: 'Volvo 9600',
      year: 2023,
      rating: 4.5,
      totalRatings: 567,
    },
  })

  // Create schedules
  const schedule1 = await prisma.schedule.create({
    data: {
      busId: bus1.id,
      routeId: route.id,
      departureTime: '22:00',
      arrivalTime: '07:30',
      durationMin: 570,
      baseFare: 899,
      operatingDays: JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
      status: 'ACTIVE',
    },
  })

  const schedule2 = await prisma.schedule.create({
    data: {
      busId: bus2.id,
      routeId: route.id,
      departureTime: '21:30',
      arrivalTime: '06:45',
      durationMin: 555,
      baseFare: 1299,
      operatingDays: JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
      status: 'ACTIVE',
    },
  })

  // Create seats for schedule1 (AC Sleeper 2X1, 32 seats = 16 lower + 16 upper)
  for (let row = 1; row <= 16; row++) {
    await prisma.seat.createMany({
      data: [
        {
          busId: bus1.id,
          scheduleId: schedule1.id,
          seatNumber: `L${row}`,
          seatType: 'LOWER',
          floor: 1,
          rowPos: row - 1,
          colPos: 0,
        },
        {
          busId: bus1.id,
          scheduleId: schedule1.id,
          seatNumber: `U${row}`,
          seatType: 'UPPER',
          floor: 2,
          rowPos: row - 1,
          colPos: 0,
        },
      ],
    })
  }

  // Create seats for schedule2 (Volvo Sleeper 2X1, 28 seats = 14 lower + 14 upper)
  for (let row = 1; row <= 14; row++) {
    await prisma.seat.createMany({
      data: [
        {
          busId: bus2.id,
          scheduleId: schedule2.id,
          seatNumber: `L${row}`,
          seatType: 'LOWER',
          floor: 1,
          rowPos: row - 1,
          colPos: 0,
        },
        {
          busId: bus2.id,
          scheduleId: schedule2.id,
          seatNumber: `U${row}`,
          seatType: 'UPPER',
          floor: 2,
          rowPos: row - 1,
          colPos: 0,
        },
      ],
    })
  }

  // Create boarding points for schedule1
  await prisma.boardingPoint.createMany({
    data: [
      { scheduleId: schedule1.id, name: 'ISBT Kashmere Gate', address: 'Kashmere Gate, Delhi', time: '22:00', type: 'BOARDING', sortOrder: 1 },
      { scheduleId: schedule1.id, name: 'Anand Vihar', address: 'Anand Vihar ISBT, Delhi', time: '22:20', type: 'BOARDING', sortOrder: 2 },
      { scheduleId: schedule1.id, name: 'DND Flyway', address: 'DND Flyway, Noida', time: '22:35', type: 'BOARDING', sortOrder: 3 },
      { scheduleId: schedule1.id, name: 'Varanasi Junction', address: 'Varanasi Cantt', time: '07:00', type: 'DROPPING', sortOrder: 4 },
      { scheduleId: schedule1.id, name: 'Lanka (BHU)', address: 'Lanka, Varanasi', time: '07:30', type: 'DROPPING', sortOrder: 5 },
    ],
  })

  // Create bus images for bus1
  await prisma.busImage.createMany({
    data: [
      { busId: bus1.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Royal Travels Bus Exterior', sortOrder: 1 },
      { busId: bus1.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Bus Interior Sleeper', sortOrder: 2 },
    ],
  })

  // Create bus images for bus2
  await prisma.busImage.createMany({
    data: [
      { busId: bus2.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Volvo Bus', sortOrder: 1 },
    ],
  })

  // Link amenities to bus1
  const amenities = await prisma.amenity.findMany()
  const amenityMap = new Map(amenities.map(a => [a.name, a.id]))
  for (const name of ['Charging Port', 'WiFi', 'Blanket', 'Water Bottle', 'Reading Light', 'CCTV']) {
    const amenityId = amenityMap.get(name)
    if (amenityId) {
      await prisma.busAmenity.upsert({
        where: { busId_amenityId: { busId: bus1.id, amenityId } },
        update: {},
        create: { busId: bus1.id, amenityId },
      })
    }
  }

  // Link amenities to bus2
  for (const name of ['Charging Port', 'WiFi', 'Blanket', 'Pillow', 'Water Bottle', 'Snacks', 'First Aid']) {
    const amenityId = amenityMap.get(name)
    if (amenityId) {
      await prisma.busAmenity.upsert({
        where: { busId_amenityId: { busId: bus2.id, amenityId } },
        update: {},
        create: { busId: bus2.id, amenityId },
      })
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
