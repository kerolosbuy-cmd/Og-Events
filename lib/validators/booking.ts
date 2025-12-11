import { z } from 'zod';

export const bookingSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
