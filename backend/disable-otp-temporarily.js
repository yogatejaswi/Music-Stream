// Temporary script to disable OTP verification for testing
// This allows you to log in without OTP

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  email: String,
  emailVerified: Boolean,
  otp: String,
  otpExpiry: Date
});

const User = mongoose.model('User', userSchema);

async function disableOTP(email) {
  try {
    console.log(`\n🔍 Looking for user: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('\n💡 Make sure you registered with this email first.');
      process.exit(1);
    }
    
    console.log(`\n📧 User found!`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    
    // Verify email and clear OTP
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    console.log('\n✅ Email verified and OTP cleared!');
    console.log('\n🎉 You can now log in at http://localhost:3000/login');
    console.log(`   Email: ${email}`);
    console.log('   Password: (your password)');
    console.log('\n⚠️  Note: You will still need OTP for login (check backend console)');
    console.log('💡 To completely disable OTP, configure Gmail SMTP in backend/.env');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('\nUsage: node disable-otp-temporarily.js <email>');
  console.log('Example: node disable-otp-temporarily.js prasannapallaplati63@gmail.com');
  process.exit(1);
}

disableOTP(email);
