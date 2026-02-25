'use client';

import Link from 'next/link';
import { useThemeStore } from '@/store/themeStore';
import { FaMusic, FaPlay, FaHeart, FaUsers, FaMoon, FaSun, FaArrowRight, FaStar } from 'react-icons/fa';

export default function LandingPage() {
  const { theme, toggleTheme } = useThemeStore();

  const features = [
    {
      icon: FaMusic,
      title: 'Unlimited Music',
      description: 'Stream millions of songs from your favorite artists'
    },
    {
      icon: FaHeart,
      title: 'Personal Playlists',
      description: 'Create and share playlists with friends and family'
    },
    {
      icon: FaUsers,
      title: 'Social Features',
      description: 'Follow friends and discover what they\'re listening to'
    },
    {
      icon: FaStar,
      title: 'High Quality',
      description: 'Crystal clear audio streaming up to 320kbps'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Music Lover',
      content: 'The best music streaming platform I\'ve ever used. The sound quality is amazing!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Playlist Creator',
      content: 'Love how easy it is to create and share playlists. The social features are fantastic.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Artist',
      content: 'Great platform for discovering new music and connecting with fans.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300">
      {/* Header */}
      <header className="bg-white dark:bg-dark-200 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaMusic className="text-primary-500 mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Music Stream</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-dark-100 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
              >
                {theme === 'dark' ? (
                  <FaSun className="text-yellow-500" size={20} />
                ) : (
                  <FaMoon className="text-gray-600" size={20} />
                )}
              </button>
              
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
              >
                Sign In
              </Link>
              
              <Link
                href="/register"
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary-500 via-purple-600 to-pink-500 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Your Music,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  Everywhere
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Stream millions of songs, create playlists, and discover new music with friends. 
                Your perfect soundtrack awaits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/register"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                >
                  Start Listening Free
                  <FaArrowRight className="ml-2" />
                </Link>
                
                <Link
                  href="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-200 flex items-center"
                >
                  <FaPlay className="mr-2" />
                  Demo Account
                </Link>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 text-white opacity-20 animate-bounce text-6xl">♪</div>
          <div className="absolute top-40 right-20 text-white opacity-20 animate-bounce delay-1000 text-4xl">♫</div>
          <div className="absolute bottom-20 left-20 text-white opacity-20 animate-bounce delay-500 text-5xl">♪</div>
          <div className="absolute bottom-40 right-10 text-white opacity-20 animate-bounce delay-1500 text-4xl">♫</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Music Stream?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience music like never before with our cutting-edge features and seamless interface.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-gray-50 dark:bg-dark-100 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">10M+</div>
              <div className="text-gray-600 dark:text-gray-400">Songs Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-400">Active Artists</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">50M+</div>
              <div className="text-gray-600 dark:text-gray-400">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Streaming</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-dark-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join millions of music lovers and discover your next favorite song today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Sign Up Free
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-dark-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <FaMusic className="text-primary-500 mr-2" size={24} />
                <span className="text-xl font-bold">Music Stream</span>
              </div>
              <p className="text-gray-400">
                Your ultimate destination for music streaming and discovery.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Mobile App</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Music Stream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
