// Script to add sample songs to the database
const mongoose = require('mongoose');
require('dotenv').config();

async function seedSongs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const songsCollection = db.collection('songs');
    const usersCollection = db.collection('users');

    const adminUser = await usersCollection.findOne({ role: 'admin' });

    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    const songs = [
      {
        title: 'Acoustic Breeze',
        artist: 'Benjamin Tissot',
        album: 'Acoustic Collection',
        genre: ['Acoustic', 'Instrumental'],
        duration: 138,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2c95b0ea27.mp3',
        coverImage: 'https://picsum.photos/seed/acoustic/300',
        lyrics: 'Instrumental track\nNo lyrics available\nEnjoy the acoustic melody',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Summer Vibes',
        artist: 'Benjamin Tissot',
        album: 'Upbeat Collection',
        genre: ['Pop', 'Upbeat'],
        duration: 142,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        coverImage: 'https://picsum.photos/seed/summer/300',
        lyrics: 'Instrumental track\nFeel the summer vibes\nRelax and enjoy',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Ukulele Dreams',
        artist: 'Benjamin Tissot',
        album: 'Happy Collection',
        genre: ['Folk', 'Happy'],
        duration: 146,
        audioUrl: 'https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3',
        coverImage: 'https://picsum.photos/seed/ukulele/300',
        lyrics: 'Instrumental ukulele melody\nBright and cheerful\nPerfect for sunny days',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Creative Minds',
        artist: 'Benjamin Tissot',
        album: 'Inspiring Collection',
        genre: ['Electronic', 'Inspiring'],
        duration: 148,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe5c21c.mp3',
        coverImage: 'https://picsum.photos/seed/creative/300',
        lyrics: 'Instrumental electronic track\nInspiring and creative\nLet your mind flow',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Sunny Day',
        artist: 'Benjamin Tissot',
        album: 'Upbeat Collection',
        genre: ['Pop', 'Upbeat'],
        duration: 143,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c610232532.mp3',
        coverImage: 'https://picsum.photos/seed/sunny/300',
        lyrics: 'Instrumental pop track\nBright and uplifting\nFeel the sunshine',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Midnight Drive',
        artist: 'Neon Harbor',
        album: 'City Lights',
        genre: ['Rock', 'Alternative'],
        duration: 201,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2c95b0ea27.mp3',
        coverImage: 'https://picsum.photos/seed/midnightdrive/300',
        lyrics: 'Electric guitars and open roads\nA late-night rock anthem\nFeel the city pulse',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Street Cipher',
        artist: 'Metro Verse',
        album: 'Downtown Stories',
        genre: ['Hip Hop', 'Rap'],
        duration: 189,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        coverImage: 'https://picsum.photos/seed/streetcipher/300',
        lyrics: 'Sharp beats and bold lines\nHip hop energy all night\nOwn the rhythm',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Blue Note Sunset',
        artist: 'Ella Monroe Trio',
        album: 'After Hours',
        genre: ['Jazz', 'Smooth'],
        duration: 226,
        audioUrl: 'https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3',
        coverImage: 'https://picsum.photos/seed/bluenotesunset/300',
        lyrics: 'Soft saxophone in the evening air\nLaid-back jazz for quiet nights\nElegant and warm',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Symphony Dawn',
        artist: 'Aurora Orchestra',
        album: 'Morning Movements',
        genre: ['Classical', 'Orchestral'],
        duration: 244,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe5c21c.mp3',
        coverImage: 'https://picsum.photos/seed/symphonydawn/300',
        lyrics: 'Strings rise with the sunrise\nA graceful classical journey\nPure cinematic calm',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Neon Pulse',
        artist: 'Circuit Bloom',
        album: 'Afterglow',
        genre: ['Electronic', 'Dance'],
        duration: 198,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c610232532.mp3',
        coverImage: 'https://picsum.photos/seed/neonpulse/300',
        lyrics: 'Synthetic waves and glowing nights\nMove with the beat\nElectronic energy unleashed',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Dusty Roads',
        artist: 'Willow Creek',
        album: 'Open Range',
        genre: ['Country', 'Acoustic'],
        duration: 214,
        audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
        coverImage: 'https://picsum.photos/seed/dustyroads/300',
        lyrics: 'Wide skies and old guitars\nA country tune for long drives\nSimple and heartfelt',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Velvet Nights',
        artist: 'Nova Rae',
        album: 'Moonlit Soul',
        genre: ['R&B', 'Soul'],
        duration: 207,
        audioUrl: 'https://cdn.pixabay.com/audio/2023/02/28/audio_550d815fa5.mp3',
        coverImage: 'https://picsum.photos/seed/velvetnights/300',
        lyrics: 'Smooth vocals over midnight drums\nR&B for slow moments\nRich and soulful',
        playCount: 0,
        likes: 0,
        isPremium: false,
        uploadedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const existingTitles = await songsCollection.distinct('title');
    const newSongs = songs.filter((song) => !existingTitles.includes(song.title));

    if (newSongs.length === 0) {
      console.log('All sample songs already exist. Nothing new to add.');
      await mongoose.disconnect();
      console.log('Done!');
      return;
    }

    const result = await songsCollection.insertMany(newSongs);
    console.log(`Successfully added ${result.insertedCount} songs.`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedSongs();
