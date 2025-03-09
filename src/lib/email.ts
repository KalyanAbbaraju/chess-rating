import nodemailer from 'nodemailer';

export interface EmailData {
  name: string;
  email: string;
  message: string;
}

// Email validation helper
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Create email transporter
export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'akvg20@gmail.com',
      pass: process.env.EMAIL_PASSWORD, // App password required
    },
  });
}

// Send email function
export async function sendContactEmail(data: EmailData): Promise<void> {
  const { name, email, message } = data;
  
  // Validate inputs
  if (!name || !email || !message) {
    throw new Error('Please fill in all fields');
  }
  
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  const transporter = createTransporter();
  
  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'akvg20@gmail.com',
    to: 'akvg20@gmail.com',
    subject: `Chess Companion Contact: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };
  
  // Send email
  await transporter.sendMail(mailOptions);
} 