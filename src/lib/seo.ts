export function jsonLdOrganisation() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GoSafe',
    url: 'https://gosafe.in',
    logo: 'https://gosafe.in/icon-512.png',
    description: 'India\'s trusted bus booking platform for long-route travel across all cities.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '1800-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [],
  }
}

export function jsonLdWebsite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GoSafe',
    url: 'https://gosafe.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://gosafe.in/search?source={source}&destination={destination}&date={date}',
      },
      'query-input': 'required name=source',
    },
    description: 'Book bus tickets online for routes across India. AC Sleeper, Volvo, Seater buses available.',
  }
}

export function jsonLdBreadcrumb(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://gosafe.in${item.url}`,
    })),
  }
}

export function jsonLdBusTrip({
  source,
  destination,
  departureTime,
  arrivalTime,
  busName,
  busType,
  fare,
  operator,
  date,
}: {
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  busName: string
  busType: string
  fare: number
  operator: string
  date: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BusTrip',
    departureTime: `${date}T${departureTime}:00+05:30`,
    arrivalTime: `${date}T${arrivalTime}:00+05:30`,
    departureBusStop: {
      '@type': 'BusStop',
      name: source,
      address: { '@type': 'PostalAddress', addressLocality: source, addressCountry: 'IN' },
    },
    arrivalBusStop: {
      '@type': 'BusStop',
      name: destination,
      address: { '@type': 'PostalAddress', addressLocality: destination, addressCountry: 'IN' },
    },
    offers: {
      '@type': 'Offer',
      price: fare,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: operator,
    },
    name: busName,
    description: `${busType} bus from ${source} to ${destination}`,
  }
}

export function jsonLdFAQ(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}
