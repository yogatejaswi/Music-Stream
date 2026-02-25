// Test Gmail SMTP configuration
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('\n🔍 Testing Gmail SMTP Configuration...\n');
  
  // Show current configuration
  console.log('Current Configuration:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? `${process.env.SMTP_PASS.substring(0, 4)}...` : 'NOT SET');
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('');

  // Check if credentials are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ SMTP credentials not configured!');
    console.log('Please update backend/.env with your Gmail credentials.');
    process.exit(1);
  }

  if (process.env.SMTP_USER === 'your-email@gmail.com') {
    console.log('❌ SMTP_USER is still set to placeholder value!');
    console.log('Please update backend/.env with your actual Gmail address.');
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  console.log('📧 Attempting to send test email...\n');

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    console.log('');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Music Stream" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Test Email - Music Stream',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Configuration Successful!</h2>
          <p>Your Gmail SMTP is configured correctly.</p>
          <p>OTP emails will now be sent to users' inboxes.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is a test email from Music Stream backend.
          </p>
        </div>
      `
    });

    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('');
    console.log('🎉 Gmail SMTP is working correctly!');
    console.log('📧 Check your inbox:', process.env.SMTP_USER);
    console.log('');
    console.log('✅ You can now send OTP emails to users!');
    
  } catch (error) {
    console.log('❌ Failed to send email!');
    console.log('');
    console.log('Error:', error.message);
    console.log('');
    
    if (error.message.includes('Invalid login')) {
      console.log('🔧 Troubleshooting:');
      console.log('1. Make sure 2-Step Verification is enabled on your Gmail');
      console.log('2. Use App Password, not your regular Gmail password');
      console.log('3. App Password should be 16 characters with NO spaces');
      console.log('4. Generate new App Password at: https://myaccount.google.com/apppasswords');
      console.log('');
      console.log('Current password length:', process.env.SMTP_PASS.length, 'characters');
      console.log('Expected: 16 characters');
    } else if (error.message.includes('EAUTH')) {
      console.log('🔧 Authentication failed!');
      console.log('1. Check that SMTP_USER matches the Gmail that generated the App Password');
      console.log('2. Regenerate App Password and update backend/.env');
      console.log('3. Make sure there are NO spaces in the App Password');
    } else {
      console.log('🔧 Check your internet connection and Gmail settings');
    }
  }

  process.exit(0);
}

testEmail();
