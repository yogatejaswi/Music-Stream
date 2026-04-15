import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import User from '../models/User';

const createAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const name = process.env.ADMIN_NAME?.trim() || 'Music Stream Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env');
  }

  await connectDatabase();

  const existingAdmin = await User.findOne({ email }).select('+password');

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.role = 'admin';
    existingAdmin.emailVerified = true;
    existingAdmin.password = password;
    await existingAdmin.save();

    console.log(`Admin user updated: ${email}`);
  } else {
    await User.create({
      email,
      password,
      name,
      role: 'admin',
      emailVerified: true,
      subscription: {
        plan: 'premium'
      }
    });

    console.log(`Admin user created: ${email}`);
  }
};

createAdmin()
  .catch((error) => {
    console.error('Failed to create admin user:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
