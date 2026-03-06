import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Booking schemas
export const bookingSearchSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.coerce
    .number()
    .min(1, "At least 1 guest required")
    .max(10, "Maximum 10 guests"),
});

export const bookingFormSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  roomId: z.string().min(1, "Room is required"),
  customer: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        "Invalid phone number",
      ),
    guests: z.coerce
      .number()
      .min(1, "At least 1 guest")
      .max(10, "Maximum 10 guests"),
  }),
});

// Room schemas
export const roomFormSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000),
  price: z.coerce.number().min(0, "Price must be positive"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").max(10),
  amenities: z.string().min(1, "Add at least one amenity"),
  roomImages: z.instanceof(FileList).optional(),
});

// Event schemas
export const eventFormSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").max(100),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000),
    eventDate: z.string().min(1, "Event date is required"),
    vlogType: z.enum(["youtube", "upload"], {
      errorMap: () => ({ message: "Select YouTube URL or Upload video" }),
    }),
    vlogUrl: z.string().optional(),
    eventImages: z.instanceof(FileList).optional(),
    eventVideo: z.instanceof(FileList).optional(),
  })
  .refine(
    (data) => {
      if (data.vlogType === "youtube") return !!data.vlogUrl;
      if (data.vlogType === "upload") return data.eventVideo?.length > 0;
      return true;
    },
    { message: "Video source is required", path: ["vlogUrl"] },
  );
