export const INDIAN_CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Varanasi', 'Patna',
  'Indore', 'Bhopal', 'Surat', 'Vadodara', 'Nagpur', 'Thane',
  'Agra', 'Mathura', 'Haridwar', 'Rishikesh', 'Dehradun', 'Chandigarh',
  'Amritsar', 'Jalandhar', 'Ludhiana', 'Kanpur', 'Allahabad', 'Gorakhpur',
  'Ranchi', 'Jamshedpur', 'Bhubaneswar', 'Cuttack', 'Guwahati',
  'Shillong', 'Srinagar', 'Jammu', 'Udaipur', 'Jodhpur', 'Kota',
  'Nasik', 'Aurangabad', 'Kolhapur', 'Mangalore', 'Mysore', 'Hubli',
  'Goa', 'Panaji', 'Gwalior', 'Jabalpur', 'Raipur', 'Bilaspur',
  'Tirupati', 'Vijayawada', 'Visakhapatnam', 'Guntur', 'Kochi',
  'Trivandrum', 'Kozhikode', 'Madurai', 'Coimbatore', 'Salem',
]

export const BUS_TYPES = [
  { value: 'AC_SLEEPER', label: 'AC Sleeper', icon: 'Bed' },
  { value: 'AC_SEATER', label: 'AC Seater', icon: 'Armchair' },
  { value: 'NON_AC_SLEEPER', label: 'Non-AC Sleeper', icon: 'Bed' },
  { value: 'NON_AC_SEATER', label: 'Non-AC Seater', icon: 'Armchair' },
  { value: 'AC_SEMI_SLEEPER', label: 'AC Semi-Sleeper', icon: 'Armchair' },
  { value: 'VOLVO', label: 'Volvo AC', icon: 'Bus' },
  { value: 'VOLVO_SLEEPER', label: 'Volvo AC Sleeper', icon: 'Bed' },
]

export const AMENITIES_LIST = [
  { name: 'Charging Port', icon: 'BatteryCharging' },
  { name: 'WiFi', icon: 'Wifi' },
  { name: 'Blanket', icon: 'Bed' },
  { name: 'Water Bottle', icon: 'Droplets' },
  { name: 'Reading Light', icon: 'Lightbulb' },
  { name: 'Emergency Exit', icon: 'DoorOpen' },
  { name: 'First Aid', icon: 'Medkit' },
  { name: 'CCTV', icon: 'Camera' },
  { name: 'Track My Bus', icon: 'MapPin' },
  { name: 'Snacks', icon: 'Cookie' },
  { name: 'Pillow', icon: 'Bed' },
  { name: 'Hand Towel', icon: 'Hand' },
]

export const SEAT_TYPES = {
  LOWER: 'lower',
  UPPER: 'upper',
  SEATER: 'seater',
  WINDOW: 'window',
  AISLE: 'aisle',
} as const

export const BUS_TYPE_LABELS: Record<string, string> = {
  AC_SLEEPER: 'AC Sleeper',
  AC_SEATER: 'AC Seater',
  NON_AC_SLEEPER: 'Non-AC Sleeper',
  NON_AC_SEATER: 'Non-AC Seater',
  AC_SEMI_SLEEPER: 'AC Semi-Sleeper',
  VOLVO: 'Volvo AC',
  VOLVO_SLEEPER: 'Volvo AC Sleeper',
}
