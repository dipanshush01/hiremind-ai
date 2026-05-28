const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to, subject, html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error('Email send error:', error);
    throw new Error('Email could not be sent');
  }
};

exports.sendVerificationEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify Your HireMind AI Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0c10;color:#e8ebf2;padding:40px;border-radius:12px;">
        <h1 style="color:#4f8ef7;margin-bottom:8px;">HireMind AI</h1>
        <p style="color:#8892a4;margin-bottom:32px;">AI-Powered Interview Platform</p>
        <h2>Welcome, ${name}! 🎉</h2>
        <p>Please verify your email address to get started.</p>
        <a href="${url}" style="display:inline-block;background:#4f8ef7;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;margin:20px 0;font-weight:bold;">Verify Email</a>
        <p style="color:#8892a4;font-size:14px;">Link expires in 24 hours. If you didn't create this account, ignore this email.</p>
      </div>`,
  });
};

exports.sendPasswordResetEmail = async (email, name, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset Your HireMind AI Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0c10;color:#e8ebf2;padding:40px;border-radius:12px;">
        <h1 style="color:#4f8ef7;">HireMind AI</h1>
        <h2>Password Reset Request</h2>
        <p>Hi ${name}, click below to reset your password. This link expires in 10 minutes.</p>
        <a href="${url}" style="display:inline-block;background:#ef4444;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;margin:20px 0;font-weight:bold;">Reset Password</a>
        <p style="color:#8892a4;font-size:14px;">If you didn't request this, your account is safe — ignore this email.</p>
      </div>`,
  });
};

exports.sendInterviewReportEmail = async (email, name, report) => {
  await sendEmail({
    to: email,
    subject: `Your HireMind Interview Report — ${report.score}% Score`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0c10;color:#e8ebf2;padding:40px;border-radius:12px;">
        <h1 style="color:#4f8ef7;">HireMind AI</h1>
        <h2>Interview Complete, ${name}!</h2>
        <div style="background:#111318;padding:24px;border-radius:8px;margin:20px 0;">
          <p style="font-size:36px;font-weight:bold;color:#4f8ef7;margin:0;">${report.score}%</p>
          <p style="color:#8892a4;">Overall Score — ${report.domain}</p>
        </div>
        <h3 style="color:#22c55e;">Strengths</h3>
        <ul>${report.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3 style="color:#f59e0b;">Areas to Improve</h3>
        <ul>${report.improvements.map(i => `<li>${i}</li>`).join('')}</ul>
        <p style="color:#8892a4;font-size:14px;">Keep practicing on HireMind AI!</p>
      </div>`,
  });
};
