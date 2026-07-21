import { z } from 'zod'

export const searchSchema = z.object({
  source: z.string().min(2, 'Enter source city'),
  destination: z.string().min(2, 'Enter destination city'),
  date: z.string().min(1, 'Select travel date'),
})

export const passengerSchema = z.object({
  name: z.string().min(2, 'Enter passenger name').max(100),
  age: z.coerce.number().min(1).max(120),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
})

export const bookingFormSchema = z.object({
  contactName: z.string().min(2, 'Enter your name').max(100),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone number'),
  contactEmail: z.string().email('Enter valid email').optional().or(z.literal('')),
  insuranceOpted: z.boolean().default(false),
  passengers: z.array(passengerSchema).min(1, 'Add at least one passenger'),
})

export type SearchFormData = z.infer<typeof searchSchema>
export type PassengerData = z.infer<typeof passengerSchema>
export type BookingFormData = z.infer<typeof bookingFormSchema>
