import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmation = async (booking) => {
  const { customer, checkIn, checkOut, room } = booking;

  // In real app: fetch room name via populate or pass it
  const roomName = room?.name || 'Selected Room';

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Booking System" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: 'Your Room Reservation Confirmation',
    text: `
Dear ${customer.name},

Your reservation has been confirmed!

Details:
- Room: ${roomName}
- Check-in: ${new Date(checkIn).toDateString()}
- Check-out: ${new Date(checkOut).toDateString()}
- Guests: ${customer.guests}
- Contact: ${customer.phone}

We look forward to welcoming you!

Best regards,
Your Hotel Team
    `,
    // html: `<h2>Confirmation</h2><p>...</p>` // optional HTML version
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${customer.email}`);
  } catch (error) {
    console.error('Email send failed:', error);
    // Don't throw — booking should still succeed, just log
  }
};