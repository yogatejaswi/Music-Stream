// Script to add Telugu songs to the database
const mongoose = require('mongoose');
require('dotenv').config();

async function seedTeluguSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');
    const usersCollection = db.collection('users');

    // Get the first admin user to use as uploadedBy
    const adminUser = await usersCollection.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const teluguSongs = [
      {
        title: "Butta Bomma",
        artist: "Armaan Malik",
        album: "Ala Vaikunthapurramuloo",
        genre: ["Telugu", "Romantic", "Pop"],
        duration: 245,
        audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_2c95b0ea27.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/buttabomma/300",
        lyrics: "Butta Bomma Butta Bomma\nNaa Chinni Butta Bomma\nTelugu romantic song",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Samajavaragamana",
        artist: "Sid Sriram",
        album: "Ala Vaikunthapurramuloo",
        genre: ["Telugu", "Romantic", "Melody"],
        duration: 268,
        audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/samajavaragamana/300",
        lyrics: "Samajavaragamana\nSa Ri Ga Ma Pa Da Ni\nBeautiful Telugu melody",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Ramuloo Ramulaa",
        artist: "Anurag Kulkarni, Mangli",
        album: "Ala Vaikunthapurramuloo",
        genre: ["Telugu", "Folk", "Dance"],
        duration: 234,
        audioUrl: "https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/ramuloo/300",
        lyrics: "Ramuloo Ramulaa\nFolk dance song\nEnergetic Telugu beats",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Inkem Inkem",
        artist: "Sid Sriram",
        album: "Geetha Govindam",
        genre: ["Telugu", "Romantic", "Melody"],
        duration: 256,
        audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe5c21c.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/inkem/300",
        lyrics: "Inkem Inkem Inkem Kaavaale\nRomantic Telugu melody\nSoulful and beautiful",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Vachinde",
        artist: "Madhu Priya",
        album: "Fidaa",
        genre: ["Telugu", "Folk", "Romantic"],
        duration: 243,
        audioUrl: "https://cdn.pixabay.com/audio/2022/03/15/audio_c610232532.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/vachinde/300",
        lyrics: "Vachinde Vachinde\nTelugu folk romantic song\nMelodious and catchy",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Oo Antava",
        artist: "Indravathi Chauhan",
        album: "Pushpa",
        genre: ["Telugu", "Item Song", "Dance"],
        duration: 238,
        audioUrl: "https://cdn.pixabay.com/audio/2022/03/10/audio_2c95b0ea27.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/ooantava/300",
        lyrics: "Oo Antava Mava\nOo Oo Antava\nEnergetic dance number",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Srivalli",
        artist: "Javed Ali",
        album: "Pushpa",
        genre: ["Telugu", "Romantic", "Melody"],
        duration: 252,
        audioUrl: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/srivalli/300",
        lyrics: "Srivalli Srivalli\nRomantic Telugu song\nMelodious and soulful",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Kalaavathi",
        artist: "Sid Sriram",
        album: "Sarkaru Vaari Paata",
        genre: ["Telugu", "Romantic", "Melody"],
        duration: 247,
        audioUrl: "https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/kalaavathi/300",
        lyrics: "Kalaavathi Kalaavathi\nBeautiful Telugu melody\nRomantic and soothing",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Rang De",
        artist: "Anurag Kulkarni",
        album: "Arjun Reddy",
        genre: ["Telugu", "Romantic", "Pop"],
        duration: 241,
        audioUrl: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe5c21c.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/rangde/300",
        lyrics: "Rang De Rang De\nColorful Telugu song\nUpbeat and romantic",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Maate Vinadhuga",
        artist: "Sid Sriram",
        album: "Taxiwaala",
        genre: ["Telugu", "Romantic", "Melody"],
        duration: 258,
        audioUrl: "https://cdn.pixabay.com/audio/2022/03/15/audio_c610232532.mp3", // Replace with actual Telugu song URL
        coverImage: "https://picsum.photos/seed/maatevinadhuga/300",
        lyrics: "Maate Vinadhuga\nSoulful Telugu melody\nRomantic and emotional",
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert Telugu songs
    const result = await songsCollection.insertMany(teluguSongs);
    console.log(`✅ Successfully added ${result.insertedCount} Telugu songs!`);
    
    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedTeluguSongs();
