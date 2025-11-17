import crypto from 'crypto';

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24); // 24 hours
  return expiry;
}

export async function sendVerificationEmail(email: string, token: string, name: string): Promise<void> {
  // For development, just log the verification link
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  console.log('\n===== EMAIL VERIFICATION =====');
  console.log(`To: ${email}`);
  console.log(`Name: ${name}`);
  console.log(`Verification Link: ${verificationUrl}`);
  console.log('==============================\n');
  
  // TODO: In production, integrate with email service like SendGrid, AWS SES, or Nodemailer
  // Example with Nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email - Campus Exchange',
    html: `
      <h1>Welcome to Campus Exchange, ${name}!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  });
  */
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  console.log('\n===== PASSWORD RESET =====');
  console.log(`To: ${email}`);
  console.log(`Reset Link: ${resetUrl}`);
  console.log('==========================\n');
  
  // TODO: Integrate with email service in production
}
