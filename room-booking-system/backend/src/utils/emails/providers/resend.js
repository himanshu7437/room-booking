import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ from, to, subject, text }) => {
  await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
  });
};