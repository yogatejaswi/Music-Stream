// Script to manually verify an email in the database
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  emailVerified: Boolean,
  otp: String,
  otpExpiry: Date
});

const User = mongoose.model('User', userSchema);

async function verifyEmail(email) {
  try {
    console.log(`\n🔍 Looking for user: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('\n💡 Options:');
      console.log('1. Register a new account at http://localhost:3000/register');
      console.log('2. Check if you typed the email correctly');
      process.exit(1);
    }
    
    console.log(`\n📧 User found!`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    
    if (user.emailVerified) {
      console.log('\n✅ Email is already verified! You can log in now.');
      process.exit(0);
    }
    
    // Verify the email
    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    console.log('\n✅ Email verified successfully!');
    console.log('\n🎉 You can now log in at http://localhost:3000/login');
    console.log(`   Email: ${email}`);
    console.log('   Password: (your password)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('\nUsage: node verify-email-manually.js <email>');
  console.log('Example: node verify-email-manually.js thotayogatejaswi1@gmail.com');
  process.exit(1);
}

// Run the verification
verifyEmail(email);
