import { z } from "zod";

/* ---------------- Booking Search ---------------- */

export const bookingSearchSchema = z
  .object({
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),

    guests: z.coerce
      .number()
      .min(1, "At least 1 guest required")
      .max(20, "Maximum 20 guests"),
  })
  .refine((data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  }, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

/* ---------------- Booking Form ---------------- */

export const bookingFormSchema = z
  .object({
    checkIn: z
      .string()
      .min(1, "Check-in date is required")
      .refine((date) => !isNaN(new Date(date).getTime()), {
        message: "Invalid check-in date",
      }),

    checkOut: z
      .string()
      .min(1, "Check-out date is required")
      .refine((date) => !isNaN(new Date(date).getTime()), {
        message: "Invalid check-out date",
      }),

    // must match backend field name
    room: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid room ID format"),

    customer: z.object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100),

      email: z
        .string()
        .email("Invalid email address"),

      phone: z
        .string()
        .regex(
          /^[0-9+\-\s()]{8,20}$/,
          "Invalid phone number format"
        ),

      guests: z.coerce
        .number()
        .min(1, "At least 1 guest required")
        .max(20, "Maximum 20 guests"),
    }),
  })

  /* check-in must be future date */
  .refine((data) => {
    const now = new Date();
    const checkIn = new Date(data.checkIn);
    return checkIn > now;
  }, {
    message: "Check-in must be in the future",
    path: ["checkIn"],
  })

  /* check-out must be after check-in */
  .refine((data) => {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);
    return checkOut > checkIn;
  }, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });