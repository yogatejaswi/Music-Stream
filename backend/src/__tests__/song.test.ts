import request from 'supertest';
import app from '../app';
import Song from '../models/Song';
import User from '../models/User';
import { connectDatabase } from '../config/database';
import mongoose from 'mongoose';

describe('Song API', () => {
  let authToken: string;
  let userId: string;
  let songId: string;

  beforeAll(async () => {
    await connectDatabase();

    // Create test user and login
    const user = await User.create({
      name: 'Test User',
      email: 'songtest@example.com',
      password: 'password123'
    });
    userId = user._id.toString();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'songtest@example.com',
        password: 'password123'
      });

    const cookies = loginResponse.headers['set-cookie'];
    authToken = cookies[0].split(';')[0].split('=')[1];

    // Create test song
    const song = await Song.create({
      title: 'Test Song',
      artist: 'Test Artist',
      duration: 180,
      audioUrl: 'https://example.com/song.mp3',
      genre: ['pop'],
      uploadedBy: userId
    });
    songId = song._id.toString();
  });

  afterAll(async () => {
    await Song.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/songs', () => {
    it('should get all songs', async () => {
      const response = await request(app).get('/api/songs');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter songs by genre', async () => {
      const response = await request(app).get('/api/songs?genre=pop');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should search songs', async () => {
      const response = await request(app).get('/api/songs?search=Test');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/songs/:id', () => {
    it('should get song by ID', async () => {
      const response = await request(app).get(`/api/songs/${songId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', 'Test Song');
    });

    it('should return 404 for invalid ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/songs/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/songs/:id/play', () => {
    it('should increment play count', async () => {
      const response = await request(app)
        .post(`/api/songs/${songId}/play`)
        .set('Cookie', [`accessToken=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app).post(`/api/songs/${songId}/play`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/songs/:id/like', () => {
    it('should like a song', async () => {
      const response = await request(app)
        .post(`/api/songs/${songId}/like`)
        .set('Cookie', [`accessToken=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.isLiked).toBe(true);
    });

    it('should unlike a song', async () => {
      const response = await request(app)
        .post(`/api/songs/${songId}/like`)
        .set('Cookie', [`accessToken=${authToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.isLiked).toBe(false);
    });
  });
});
