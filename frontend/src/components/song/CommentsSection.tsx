'use client';

import { useState, useEffect } from 'react';
import { commentsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { FaHeart, FaRegHeart, FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: string[];
  createdAt: string;
}

interface CommentsSectionProps {
  songId: string;
}

export default function CommentsSection({ songId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [songId]);

  const fetchComments = async () => {
    try {
      const response = await commentsAPI.getSongComments(songId);
      setComments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const response = await commentsAPI.create({
        songId,
        text: newComment.trim()
      });
      
      setComments([response.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await commentsAPI.like(commentId);
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          const isLiked = comment.likes.includes(user?._id || '');
          return {
            ...comment,
            likes: isLiked 
              ? comment.likes.filter(id => id !== user?._id)
              : [...comment.likes, user?._id || '']
          };
        }
        return comment;
      }));
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      await commentsAPI.update(commentId, editText.trim());
      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, text: editText.trim() }
          : comment
      ));
      setEditingId(null);
      setEditText('');
      toast.success('Comment updated!');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await commentsAPI.delete(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-dark-300 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-dark-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-dark-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-300 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-dark-200 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-primary-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 transition"
                >
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-dark-200 rounded-lg text-center">
          <p className="text-gray-400">Please log in to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {comment.user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="bg-dark-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  {editingId === comment._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-dark-400 border border-gray-600 rounded p-2 text-sm resize-none focus:outline-none focus:border-primary-500"
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEdit(comment._id)}
                          className="px-3 py-1 bg-primary-500 text-white rounded text-xs hover:bg-primary-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{comment.text}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <button
                    onClick={() => handleLike(comment._id)}
                    className="flex items-center gap-1 hover:text-primary-500 transition"
                  >
                    {comment.likes.includes(user?._id || '') ? (
                      <FaHeart className="text-primary-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{comment.likes.length}</span>
                  </button>
                  
                  {user?._id === comment.user._id && (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditText(comment.text);
                        }}
                        className="flex items-center gap-1 hover:text-blue-400 transition"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="flex items-center gap-1 hover:text-red-400 transition"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}