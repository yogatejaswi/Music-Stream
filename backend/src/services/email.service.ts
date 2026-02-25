import nodemailer from 'nodemailer';

// Create a transporter
const createTransport = () => {
  // Check if SMTP credentials are configured
  const hasSmtpConfig = process.env.SMTP_USER && 
                        process.env.SMTP_PASS && 
                        process.env.SMTP_USER !== 'your-email@gmail.com';

  if (hasSmtpConfig) {
    // Use real Gmail SMTP
    console.log('📧 Using Gmail SMTP for sending emails');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development mode - emails won't actually send
    console.log('⚠️  Gmail SMTP not configured - OTPs will only show in console');
    console.log('💡 To send real emails, configure SMTP settings in backend/.env');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'testpassword'
      }
    });
  }
};

export const sendOTPEmail = async (email: string, otp: string, name: string) => {
  try {
    const transporter = createTransport();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Music Stream" <noreply@musicstream.com>`,
      to: email,
      subject: 'Verify Your Email - Music Stream',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              padding: 20px;
              background: #f7f7f7;
              border-radius: 8px;
              margin: 20px 0;
            }
            .logo {
              color: white;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #666;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffc107;
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎵 Music Stream</div>
            <div class="subtitle">Your Ultimate Music Experience</div>
            
            <div class="content">
              <h2>Welcome, ${name}!</h2>
              <p>Thank you for registering with Music Stream. To complete your registration, please verify your email address using the OTP code below:</p>
              
              <div class="otp-code">${otp}</div>
              
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              
              <div class="warning">
                ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. Music Stream will never ask for your OTP via phone or email.
              </div>
              
              <div class="footer">
                <p>If you didn't request this code, please ignore this email.</p>
                <p>&copy; 2024 Music Stream. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Always log OTP to console for development/debugging
    console.log('\n' + '='.repeat(60));
    console.log('📧 REGISTRATION OTP - COPY THE CODE BELOW');
    console.log('='.repeat(60));
    console.log(`📨 To: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔐 OTP CODE: ${otp}`);
    console.log(`⏰ Expires: 10 minutes`);
    console.log('='.repeat(60) + '\n');

    // Attempt to send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Registration OTP email sent successfully to:', email);
      console.log('📬 Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (emailError: any) {
      console.error('❌ Failed to send email:', emailError.message);
      console.log('💡 OTP is shown above - user can still use it from console');
      // Don't throw error - OTP is still valid and shown in console
      return { success: false, error: emailError.message };
    }
  } catch (error) {
    console.error('❌ Error in sendOTPEmail:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const transporter = createTransport();

    const mailOptions = {
      from: `"Music Stream" <${process.env.EMAIL_FROM || 'noreply@musicstream.com'}>`,
      to: email,
      subject: 'Welcome to Music Stream! 🎵',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
              padding: 40px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .logo {
              color: white;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .features {
              text-align: left;
              margin: 20px 0;
            }
            .feature-item {
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎵 Music Stream</div>
            
            <div class="content">
              <h2>Welcome to Music Stream, ${name}! 🎉</h2>
              <p>Your email has been verified successfully. You're all set to start your musical journey!</p>
              
              <div class="features">
                <div class="feature-item">✅ Stream millions of songs</div>
                <div class="feature-item">✅ Create unlimited playlists</div>
                <div class="feature-item">✅ Follow your favorite artists</div>
                <div class="feature-item">✅ Discover new music daily</div>
                <div class="feature-item">✅ High-quality audio streaming</div>
              </div>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                Start Listening Now
              </a>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Need help? Contact us at support@musicstream.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('\n📧 ===== WELCOME EMAIL =====');
      console.log(`To: ${email}`);
      console.log(`Name: ${name}`);
      console.log('===========================\n');
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    if (process.env.NODE_ENV === 'development') {
      return { success: true, messageId: 'dev-mode' };
    }
    throw error;
  }
};

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Login OTP Email
export const sendLoginOTPEmail = async (email: string, otp: string, name: string) => {
  try {
    const transporter = createTransport();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Music Stream" <noreply@musicstream.com>`,
      to: email,
      subject: 'Your Login Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 10px;
              text-align: center;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              padding: 20px;
              background: #f7f7f7;
              border-radius: 8px;
              margin: 20px 0;
            }
            .logo {
              color: white;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🎵 Music Stream</div>
            
            <div class="content">
              <h2>Login Verification</h2>
              <p>Hello ${name},</p>
              <p>Your verification code for login is:</p>
              
              <div class="otp-code">${otp}</div>
              
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Always log OTP to console for development/debugging
    console.log('\n' + '🔐'.repeat(30));
    console.log('🔑 LOGIN OTP - ENTER THIS CODE ON THE VERIFICATION PAGE');
    console.log('🔐'.repeat(30));
    console.log(`📨 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`\n🔢 YOUR OTP CODE: ${otp}\n`);
    console.log(`⏰ Valid for: 10 minutes`);
    console.log('🔐'.repeat(30) + '\n');

    // Attempt to send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Login OTP email sent successfully to:', email);
      console.log('📬 Message ID:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (emailError: any) {
      console.error('❌ Failed to send email:', emailError.message);
      console.log('💡 OTP is shown above - user can still use it from console');
      // Don't throw error - OTP is still valid and shown in console
      return { success: false, error: emailError.message };
    }
  } catch (error) {
    console.error('❌ Error in sendLoginOTPEmail:', error);
    throw error;
  }
};

