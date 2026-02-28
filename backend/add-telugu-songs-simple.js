// Simple script to add Telugu songs with free audio samples
const mongoose = require('mongoose');
require('dotenv').config();

async function addTeluguSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');
    const usersCollection = db.collection('users');

    // Get any user to use as uploadedBy
    const user = await usersCollection.findOne();
    
    if (!user) {
      console.error('❌ No user found. Please create a user first by logging in.');
      process.exit(1);
    }

    // Check if Telugu songs already exist
    const existingCount = await songsCollection.countDocuments({ genre: "Telugu" });
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} Telugu songs already exist. Skipping...`);
      await mongoose.disconnect();
      return;
    }

    const teluguSongs = [
      {
        title: "Butta Bomma",
        artist: "Armaan Malik",
        album: "Ala Vaikunthapurramuloo",
        genre: ["Telugu", "Romantic"],
        duration: 245,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
        lyrics: "Butta Bomma Butta Bomma\nNaa Chinni Butta Bomma",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Samajavaragamana",
        artist: "Sid Sriram",
        album: "Ala Vaikunthapurramuloo",
        genre: ["Telugu", "Melody"],
        duration: 268,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        lyrics: "Samajavaragamana\nSa Ri Ga Ma Pa Da Ni",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Ramuloo Ramulaa",
        artist: "Anurag Kulkarni",
        album: "Ala Vaikunthapurramuloo",
        genre: ["Telugu", "Folk"],
        duration: 234,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverImage: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
        lyrics: "Ramuloo Ramulaa\nFolk dance song",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Inkem Inkem",
        artist: "Sid Sriram",
        album: "Geetha Govindam",
        genre: ["Telugu", "Romantic"],
        duration: 256,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
        lyrics: "Inkem Inkem Inkem Kaavaale",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Vachinde",
        artist: "Madhu Priya",
        album: "Fidaa",
        genre: ["Telugu", "Folk"],
        duration: 243,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverImage: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
        lyrics: "Vachinde Vachinde",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await songsCollection.insertMany(teluguSongs);
    console.log(`🎵 Successfully added ${result.insertedCount} Telugu songs!`);
    console.log('✅ Done! Refresh your dashboard to see the songs.');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTeluguSongs();
