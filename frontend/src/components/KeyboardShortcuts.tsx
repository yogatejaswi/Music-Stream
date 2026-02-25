'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'next/navigation';

export default function KeyboardShortcuts() {
  const { togglePlay, playNext, playPrevious, setVolume, volume } = usePlayerStore();
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        
        case 'arrowright':
          if (e.shiftKey) {
            e.preventDefault();
            playNext();
          }
          break;
        
        case 'arrowleft':
          if (e.shiftKey) {
            e.preventDefault();
            playPrevious();
          }
          break;
        
        case 'arrowup':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        
        case 'arrowdown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        
        case 'm':
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 0.7);
          break;
        
        case 'h':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/dashboard');
          }
          break;
        
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/search');
          }
          break;
        
        case 'l':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            router.push('/library');
          }
          break;
        
        case '?':
          e.preventDefault();
          showShortcutsHelp();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, playNext, playPrevious, setVolume, volume, router]);

  const showShortcutsHelp = () => {
    const shortcuts = `
Keyboard Shortcuts:

Playback:
  Space - Play/Pause
  Shift + → - Next track
  Shift + ← - Previous track
  ↑ - Volume up
  ↓ - Volume down
  M - Mute/Unmute

Navigation:
  Ctrl/Cmd + H - Home
  Ctrl/Cmd + S - Search
  Ctrl/Cmd + L - Library
  ? - Show this help
    `.trim();

    alert(shortcuts);
  };

  return null;
}
