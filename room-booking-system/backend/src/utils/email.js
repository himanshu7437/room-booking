import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Email to customer (pending request)
export const sendBookingRequestToCustomer = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;
  const roomName = room?.name || 'Selected Room';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customer.email,
    subject: 'Booking Request Received – Awaiting Confirmation',
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

  await transporter.sendMail(mailOptions);
};

// 2. Email to admin (new request)
export const sendNewBookingRequestToAdmin = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;
  const roomName = room?.name || 'Unknown Room';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL || 'min@luxadstay.com',
    subject: 'New Booking Request – Action Required',
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

  await transporter.sendMail(mailOptions);
};

// 3. Final confirmation (called on admin approve)
export const sendBookingConfirmedToCustomer = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;
  const roomName = room?.name || 'Selected Room';

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customer.email,
    subject: 'Your Booking is Confirmed!',
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

  await transporter.sendMail(mailOptions);
};

// 4. Rejection email (called on admin reject)
export const sendBookingRejectedToCustomer = async (booking) => {
  const { customer } = booking;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customer.email,
    subject: 'Booking Request Update',
    text: `
Dear ${customer.name},

Unfortunately, your booking request could not be confirmed at this time.

Please contact us directly if you'd like to discuss alternatives or check other availability.

We apologize for any inconvenience.

Best regards,
LuxStay Team
    `,
  };

  await transporter.sendMail(mailOptions);
};