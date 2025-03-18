import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // o usa "hotmail", "outlook", o configuración SMTP personalizada
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions = {
      from: `"Orbit Task Manager" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
  
    await transporter.sendMail(mailOptions);
  };
  
