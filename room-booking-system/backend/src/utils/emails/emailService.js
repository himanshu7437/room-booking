import dotenv from "dotenv";
dotenv.config();

import { sendEmail as nodemailerSend } from "./providers/nodemailerProvider.js";
import { sendEmail as resendSend } from "./providers/resendProvider.js";

const emailProvider =
  process.env.EMAIL_PROVIDER === "resend"
    ? resendSend
    : nodemailerSend;

/**
 * Helper to send email using selected provider
 */
const sendEmail = async (mailOptions) => {
  try {
    await emailProvider(mailOptions);
  } catch (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

/**
 * 1. Email to customer (pending request)
 */
export const sendBookingRequestToCustomer = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;
  const roomName = room?.name || "Selected Room";

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: "Booking Request Received – Awaiting Confirmation",
    text: `
Dear ${customer.name},

Thank you for your booking request!

Details:
- Room: ${roomName}
- Check-in: ${new Date(checkIn).toDateString()}
- Check-out: ${new Date(checkOut).toDateString()}
- Guests: ${customer.guests}

Our team is reviewing your request and will confirm shortly (usually within 24 hours).
You will receive a separate confirmation email once approved.

If you have any questions, feel free to contact us.

Best regards,
LuxStay Team
`,
  };

  await sendEmail(mailOptions);
};

/**
 * 2. Email to admin (new booking request)
 */
export const sendNewBookingRequestToAdmin = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;
  const roomName = room?.name || "Unknown Room";

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Booking Request – Action Required",
    text: `
New booking request received!

Customer:
Name: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
Guests: ${customer.guests}

Room: ${roomName}
Check-in: ${new Date(checkIn).toDateString()}
Check-out: ${new Date(checkOut).toDateString()}

Booking ID: ${booking._id}

Please review and confirm/reject in the admin dashboard as soon as possible.

LuxStay System
`,
  };

  await sendEmail(mailOptions);
};

/**
 * 3. Final confirmation email to customer
 */
export const sendBookingConfirmedToCustomer = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;
  const roomName = room?.name || "Selected Room";

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: "Your Booking is Confirmed!",
    text: `
Dear ${customer.name},

Great news — your booking has been confirmed!

Details:
- Room: ${roomName}
- Check-in: ${new Date(checkIn).toDateString()}
- Check-out: ${new Date(checkOut).toDateString()}
- Guests: ${customer.guests}

We look forward to welcoming you!

Best regards,
LuxStay Team
`,
  };

  await sendEmail(mailOptions);
};

/**
 * 4. Booking rejection email
 */
export const sendBookingRejectedToCustomer = async (booking) => {
  const { customer } = booking;

  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: "Booking Request Update",
    text: `
Dear ${customer.name},

Unfortunately, your booking request could not be confirmed at this time.

Please contact us directly if you'd like to discuss alternatives or check other availability.

We apologize for any inconvenience.

Best regards,
LuxStay Team
`,
  };

  await sendEmail(mailOptions);
};