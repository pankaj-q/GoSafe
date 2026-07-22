import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

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
    { name: 'Goa', state: 'Goa', slug: 'goa' },
    { name: 'Amritsar', state: 'Punjab', slug: 'amritsar' },
    { name: 'Indore', state: 'Madhya Pradesh', slug: 'indore' },
    { name: 'Bhopal', state: 'Madhya Pradesh', slug: 'bhopal' },
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
  const patna = (await prisma.city.findUnique({ where: { slug: 'patna' } }))!
  const chandigarh = (await prisma.city.findUnique({ where: { slug: 'chandigarh' } }))!
  const pune = (await prisma.city.findUnique({ where: { slug: 'pune' } }))!
  const goa = (await prisma.city.findUnique({ where: { slug: 'goa' } }))!

  const routeData = [
    { sourceId: delhi.id, destId: varanasi.id, distanceKm: 820 },
    { sourceId: delhi.id, destId: mumbai.id, distanceKm: 1400 },
    { sourceId: delhi.id, destId: jaipur.id, distanceKm: 280 },
    { sourceId: delhi.id, destId: lucknow.id, distanceKm: 550 },
    { sourceId: delhi.id, destId: hyderabad.id, distanceKm: 1550 },
    { sourceId: delhi.id, destId: patna.id, distanceKm: 1000 },
    { sourceId: delhi.id, destId: chandigarh.id, distanceKm: 260 },
    { sourceId: mumbai.id, destId: pune.id, distanceKm: 150 },
    { sourceId: mumbai.id, destId: goa.id, distanceKm: 580 },
  ]

  for (const rd of routeData) {
    await prisma.route.upsert({
      where: { sourceId_destId: { sourceId: rd.sourceId, destId: rd.destId } },
      update: {},
      create: rd,
    })
  }

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

  const operator1 = await prisma.operator.upsert({
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

  const operator3 = await prisma.operator.upsert({
    where: { email: 'hans@travels.com' },
    update: {},
    create: {
      name: 'Hans Travels',
      companyName: 'Hans Bus Services',
      email: 'hans@travels.com',
      phone: '9876543212',
      passwordHash: 'dummy',
      logo: null,
      isApproved: true,
      commissionPct: 10,
    },
  })

  const bus1 = await prisma.bus.create({
    data: {
      operatorId: operator1.id,
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

  const bus3 = await prisma.bus.create({
    data: {
      operatorId: operator3.id,
      busNumber: 'HT-001',
      registrationNo: 'DL-03-EF-9012',
      busType: 'AC_SLEEPER',
      totalSeats: 36,
      seatLayout: '2X1',
      model: 'Ashok Leyland',
      year: 2024,
      rating: 4.0,
      totalRatings: 189,
    },
  })

  const route = await prisma.route.findFirstOrThrow({
    where: { sourceId: delhi.id, destId: varanasi.id },
  })

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

  const schedule3 = await prisma.schedule.create({
    data: {
      busId: bus3.id,
      routeId: route.id,
      departureTime: '23:00',
      arrivalTime: '09:00',
      durationMin: 600,
      baseFare: 749,
      operatingDays: JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
      status: 'ACTIVE',
    },
  })

  // Sleeper 2X1 layout: cols = [lower/left(col0), aisle(col1), upper/right(col2)]
  // Lower deck (floor=1): seats at col 0 (left), col 2 (right)
  // Upper deck (floor=2): berths at col 0 (left), col 2 (right)
  const seatLayouts = [
    { scheduleId: schedule1.id, busId: bus1.id, rows: 16, floors: [1, 2] },
    { scheduleId: schedule2.id, busId: bus2.id, rows: 14, floors: [1, 2] },
    { scheduleId: schedule3.id, busId: bus3.id, rows: 18, floors: [1, 2] },
  ]

  for (const layout of seatLayouts) {
    for (const floor of layout.floors) {
      for (let row = 0; row < layout.rows; row++) {
        const prefix = floor === 1 ? 'L' : 'U'
        const seatType = floor === 1 ? 'SEATER' : 'SLEEPER'
        await prisma.seat.createMany({
          data: [
            {
              busId: layout.busId,
              scheduleId: layout.scheduleId,
              seatNumber: `${prefix}${row + 1}A`,
              seatType,
              floor,
              rowPos: row,
              colPos: 0,
            },
            {
              busId: layout.busId,
              scheduleId: layout.scheduleId,
              seatNumber: `${prefix}${row + 1}B`,
              seatType,
              floor,
              rowPos: row,
              colPos: 2,
            },
          ],
        })
      }
    }
  }

  const bpData = [
    { scheduleId: schedule1.id, items: [
      { name: 'ISBT Kashmere Gate', address: 'Kashmere Gate, Delhi', time: '22:00', type: 'BOARDING', sortOrder: 1 },
      { name: 'Anand Vihar', address: 'Anand Vihar ISBT, Delhi', time: '22:20', type: 'BOARDING', sortOrder: 2 },
      { name: 'DND Flyway', address: 'DND Flyway, Noida', time: '22:35', type: 'BOARDING', sortOrder: 3 },
      { name: 'Varanasi Junction', address: 'Varanasi Cantt', time: '07:00', type: 'DROPPING', sortOrder: 4 },
      { name: 'Lanka (BHU)', address: 'Lanka, Varanasi', time: '07:30', type: 'DROPPING', sortOrder: 5 },
    ]},
    { scheduleId: schedule2.id, items: [
      { name: 'ISBT Kashmere Gate', address: 'Kashmere Gate, Delhi', time: '21:30', type: 'BOARDING', sortOrder: 1 },
      { name: 'Karol Bagh', address: 'Karol Bagh, Delhi', time: '21:50', type: 'BOARDING', sortOrder: 2 },
      { name: 'Varanasi Junction', address: 'Varanasi Cantt', time: '06:15', type: 'DROPPING', sortOrder: 3 },
      { name: 'Lanka (BHU)', address: 'Lanka, Varanasi', time: '06:45', type: 'DROPPING', sortOrder: 4 },
    ]},
    { scheduleId: schedule3.id, items: [
      { name: 'Anand Vihar', address: 'Anand Vihar ISBT, Delhi', time: '23:00', type: 'BOARDING', sortOrder: 1 },
      { name: 'Varanasi Junction', address: 'Varanasi Cantt', time: '08:30', type: 'DROPPING', sortOrder: 2 },
    ]},
  ]

  for (const { scheduleId: sid, items } of bpData) {
    await prisma.boardingPoint.createMany({ data: items.map(d => ({ ...d, scheduleId: sid })) })
  }

  await prisma.busImage.createMany({
    data: [
      { busId: bus1.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Royal Travels Bus Exterior', sortOrder: 1 },
      { busId: bus1.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Bus Interior Sleeper', sortOrder: 2 },
      { busId: bus2.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Volvo Bus', sortOrder: 1 },
      { busId: bus3.id, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop', altText: 'Hans Travels Bus', sortOrder: 1 },
    ],
  })

  const amenities = await prisma.amenity.findMany()
  const amenityMap = new Map(amenities.map(a => [a.name, a.id]))

  const amenityLinks = [
    { busId: bus1.id, names: ['Charging Port', 'WiFi', 'Blanket', 'Water Bottle', 'Reading Light', 'CCTV'] },
    { busId: bus2.id, names: ['Charging Port', 'WiFi', 'Blanket', 'Pillow', 'Water Bottle', 'Snacks', 'First Aid'] },
    { busId: bus3.id, names: ['Charging Port', 'Water Bottle', 'Reading Light'] },
  ]

  for (const { busId, names } of amenityLinks) {
    for (const name of names) {
      const amenityId = amenityMap.get(name)
      if (amenityId) {
        await prisma.busAmenity.upsert({
          where: { busId_amenityId: { busId, amenityId } },
          update: {},
          create: { busId, amenityId },
        })
      }
    }
  }

  console.log('Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
