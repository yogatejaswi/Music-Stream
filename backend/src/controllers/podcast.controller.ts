import { Request, Response } from 'express';
import Podcast from '../models/Podcast';
import Episode from '../models/Episode';

// Get all podcasts with pagination and filters
export const getPodcasts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      language,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};

    // Apply filters
    if (category) query.category = category;
    if (language) query.language = language;
    if (search) {
      query.$text = { $search: search as string };
    }

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 }
    };

    const podcasts = await Podcast.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Podcast.countDocuments(query);

    res.json({
      success: true,
      data: podcasts,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Get podcasts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch podcasts'
    });
  }
};

// Get podcast by ID with episodes
export const getPodcastById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { includeEpisodes = 'true', episodeLimit = 10 } = req.query;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast not found'
      });
    }

    let episodes = [];
    if (includeEpisodes === 'true') {
      episodes = await Episode.find({ podcastId: id })
        .sort({ episodeNumber: -1 })
        .limit(parseInt(episodeLimit as string));
    }

    res.json({
      success: true,
      data: {
        podcast,
        episodes
      }
    });
  } catch (error) {
    console.error('Get podcast by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch podcast'
    });
  }
};

// Get episodes for a podcast
export const getPodcastEpisodes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      season,
      sortBy = 'episodeNumber',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { podcastId: id };
    if (season) query.season = parseInt(season as string);

    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      sort: { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 }
    };

    const episodes = await Episode.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .populate('podcastId', 'title host coverImage');

    const total = await Episode.countDocuments(query);

    res.json({
      success: true,
      data: episodes,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });
  } catch (error) {
    console.error('Get podcast episodes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch episodes'
    });
  }
};

// Get episode by ID
export const getEpisodeById = async (req: Request, res: Response) => {
  try {
    const { episodeId } = req.params;

    const episode = await Episode.findById(episodeId)
      .populate('podcastId', 'title host coverImage category');

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found'
      });
    }

    // Increment play count
    await Episode.findByIdAndUpdate(episodeId, { $inc: { playCount: 1 } });

    res.json({
      success: true,
      data: episode
    });
  } catch (error) {
    console.error('Get episode by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch episode'
    });
  }
};

// Subscribe to podcast
export const subscribeToPodcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // In a real app, you'd have a UserPodcastSubscription model
    // For now, just increment the subscriber count
    await Podcast.findByIdAndUpdate(id, { $inc: { subscribers: 1 } });

    res.json({
      success: true,
      message: 'Subscribed to podcast successfully'
    });
  } catch (error) {
    console.error('Subscribe to podcast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to podcast'
    });
  }
};

// Unsubscribe from podcast
export const unsubscribeFromPodcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Decrement subscriber count
    await Podcast.findByIdAndUpdate(id, { $inc: { subscribers: -1 } });

    res.json({
      success: true,
      message: 'Unsubscribed from podcast successfully'
    });
  } catch (error) {
    console.error('Unsubscribe from podcast error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from podcast'
    });
  }
};

// Like episode
export const likeEpisode = async (req: Request, res: Response) => {
  try {
    const { episodeId } = req.params;
    const userId = req.user?.id;

    // In a real app, you'd track individual user likes
    // For now, just increment the like count
    await Episode.findByIdAndUpdate(episodeId, { $inc: { likes: 1 } });

    res.json({
      success: true,
      message: 'Episode liked successfully'
    });
  } catch (error) {
    console.error('Like episode error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like episode'
    });
  }
};

// Get trending podcasts
export const getTrendingPodcasts = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const podcasts = await Podcast.find()
      .sort({ subscribers: -1, rating: -1 })
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      data: podcasts
    });
  } catch (error) {
    console.error('Get trending podcasts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending podcasts'
    });
  }
};

// Get podcast categories
export const getPodcastCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Podcast.distinct('category');
    
    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Podcast.countDocuments({ category });
        return { name: category, count };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount.sort((a, b) => b.count - a.count)
    });
  } catch (error) {
    console.error('Get podcast categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch podcast categories'
    });
  }
};