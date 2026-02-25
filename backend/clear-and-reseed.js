// Script to clear old songs and add new ones with working URLs
const mongoose = require('mongoose');
require('dotenv').config();

async function clearAndReseed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');
    const usersCollection = db.collection('users');

    // Delete all existing songs
    await songsCollection.deleteMany({});
    console.log('✅ Cleared all existing songs');

    // Get the first admin user
    const adminUser = await usersCollection.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const songs = [
      {
        title: "Acoustic Breeze",
        artist: "Benjamin Tissot",
        album: "Acoustic Collection",
        genre: ["Acoustic", "Instrumental"],
        duration: 138,
        audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_2c95b0ea27.mp3",
        coverImage: "https://picsum.photos/seed/acoustic/300",
        lyrics: "Instrumental track\nNo lyrics available\nEnjoy the acoustic melody",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Summer Vibes",
        artist: "Benjamin Tissot",
        album: "Upbeat Collection",
        genre: ["Pop", "Upbeat"],
        duration: 142,
        audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
        coverImage: "https://picsum.photos/seed/summer/300",
        lyrics: "Instrumental track\nFeel the summer vibes\nRelax and enjoy",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Ukulele Dreams",
        artist: "Benjamin Tissot",
        album: "Happy Collection",
        genre: ["Folk", "Happy"],
        duration: 146,
        audioUrl: "https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3",
        coverImage: "https://picsum.photos/seed/ukulele/300",
        lyrics: "Instrumental ukulele melody\nBright and cheerful\nPerfect for sunny days",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Creative Minds",
        artist: "Benjamin Tissot",
        album: "Inspiring Collection",
        genre: ["Electronic", "Inspiring"],
        duration: 148,
        audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe5c21c.mp3",
        coverImage: "https://picsum.photos/seed/creative/300",
        lyrics: "Instrumental electronic track\nInspiring and creative\nLet your mind flow",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Sunny Day",
        artist: "Benjamin Tissot",
        album: "Upbeat Collection",
        genre: ["Pop", "Upbeat"],
        duration: 143,
        audioUrl: "https://cdn.pixabay.com/audio/2022/03/15/audio_c610232532.mp3",
        coverImage: "https://picsum.photos/seed/sunny/300",
        lyrics: "Instrumental pop track\nBright and uplifting\nFeel the sunshine",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert new songs
    const result = await songsCollection.insertMany(songs);
    console.log(`✅ Successfully added ${result.insertedCount} songs with working audio URLs!`);
    
    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearAndReseed();
