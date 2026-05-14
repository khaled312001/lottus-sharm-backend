import { z } from 'zod';
import { LocaleEnum } from './trip.validator';

export const BookingStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']);
export const CustomerTypeEnum = z.enum(['LOCAL', 'FOREIGN']);

export const bookingCreateSchema = z.object({
  tripId: z.number().int().positive(),
  bookingDate: z.coerce.date(),
  adultsCount: z.number().int().min(1).max(50),
  childrenCount: z.number().int().min(0).max(50).default(0),
  customerType: CustomerTypeEnum.default('LOCAL'),
  customer: z.object({
    fullName: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().min(6).max(40),
    country: z.string().optional(),
    language: LocaleEnum.default('AR'),
  }),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const bookingListQuery = z.object({
  status: BookingStatusEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const bookingStatusUpdate = z.object({
  status: BookingStatusEnum,
  adminNotes: z.string().optional(),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
