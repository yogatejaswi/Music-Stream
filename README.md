# 🎵 Music Streaming Platform

A full-stack music streaming web application built with Next.js, Node.js, Express, and MongoDB. Features include authentication, music playback, playlists, recommendations, and subscription management.

## ✨ Features

### Core Features
- 🔐 JWT-based authentication with refresh tokens
- 🎵 Music streaming with HTML5 audio player
- 📝 Playlist creation and management
- ❤️ Like songs and create favorites
- 🔍 Search functionality (songs, artists, albums)
- 📊 Recently played tracking
- 🎯 AI-based recommendation system

### Advanced Features
- 👑 Premium subscription system (Stripe-ready)
- 🎨 Admin dashboard for content management
- 📈 Analytics and insights
- 🌙 Modern dark-themed UI
- 📱 Fully responsive design
- 🔄 Real-time player state management

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (File Storage)

## 📁 Project Structure

```
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js pages
│   │   ├── components/    # React components
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── PROJECT_BLUEPRINT.md    # Detailed architecture guide
├── SETUP_GUIDE.md         # Setup instructions
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd music-streaming-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📚 Documentation

- [PROJECT_BLUEPRINT.md](PROJECT_BLUEPRINT.md) - Complete architecture and design
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup and deployment guide

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs/:id/play` - Increment play count
- `POST /api/songs/:id/like` - Like/unlike song

### Playlists
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/:id` - Get playlist by ID
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Admin
- `POST /api/admin/songs` - Upload song
- `PUT /api/admin/songs/:id` - Update song
- `DELETE /api/admin/songs/:id` - Delete song
- `GET /api/admin/analytics` - Get analytics

## 🎨 UI Components

- **Player** - Global music player with controls
- **Sidebar** - Navigation menu
- **SongCard** - Display song information
- **PlaylistCard** - Display playlist
- **SearchBar** - Search functionality
- **Modal** - Reusable modal component

## 🔒 Security Features

- HTTP-only cookies for JWT tokens
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- XSS protection
- Helmet.js security headers

## 📈 Scalability

The architecture supports:
- Horizontal scaling (stateless API)
- Database sharding
- CDN integration
- Caching layer (Redis-ready)
- Microservices migration path

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run dev

# Frontend tests
cd frontend
npm run dev
```

## 🚀 Deployment

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

MIT License - feel free to use this project for your portfolio!

## 🎯 Portfolio Highlights

This project demonstrates:
- ✅ Full-stack development skills
- ✅ Clean architecture and design patterns
- ✅ RESTful API design
- ✅ Authentication and authorization
- ✅ Database design and optimization
- ✅ Modern frontend development
- ✅ State management
- ✅ Security best practices
- ✅ Scalable architecture
- ✅ Production-ready code

## 📧 Contact

Your Name - thotayogatejaswi1@gmail.com


Project Link: [https://github.com/yourusername/music-streaming-platform](https://github.com/yourusername/music-streaming-platform)

---


# Music-Stream
