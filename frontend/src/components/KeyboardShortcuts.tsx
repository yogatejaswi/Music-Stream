'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useThemeStore } from '@/store/themeStore';
import toast from 'react-hot-toast';

export default function KeyboardShortcuts() {
  const { 
    isPlaying, 
    currentSong, 
    volume, 
    togglePlay, 
    playNext, 
    playPrevious, 
    setVolume,
    toggleShuffle,
    toggleRepeat,
    shuffle,
    repeat
  } = usePlayerStore();
  
  const { toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      // Prevent default behavior for our shortcuts
      const shortcutKeys = [
        'Space',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'KeyM',
        'KeyS',
        'KeyR',
        'KeyT',
        'KeyL',
        'KeyF'
      ];

      if (shortcutKeys.includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'Space':
          // Play/Pause
          if (currentSong) {
            togglePlay();
            toast.success(isPlaying ? 'Paused' : 'Playing', {
              duration: 1000,
              icon: isPlaying ? '⏸️' : '▶️'
            });
          }
          break;

        case 'ArrowRight':
          // Next song
          if (event.shiftKey) {
            // Shift + Right Arrow: Skip 10 seconds forward
            // This would need to be implemented in the player store
            toast.success('⏭️ +10s', { duration: 1000 });
          } else {
            playNext();
            toast.success('⏭️ Next song', { duration: 1000 });
          }
          break;

        case 'ArrowLeft':
          // Previous song
          if (event.shiftKey) {
            // Shift + Left Arrow: Skip 10 seconds backward
            toast.success('⏮️ -10s', { duration: 1000 });
          } else {
            playPrevious();
            toast.success('⏮️ Previous song', { duration: 1000 });
          }
          break;

        case 'ArrowUp':
          // Volume up
          const newVolumeUp = Math.min(volume + 0.1, 1);
          setVolume(newVolumeUp);
          toast.success(`🔊 Volume: ${Math.round(newVolumeUp * 100)}%`, { duration: 1000 });
          break;

        case 'ArrowDown':
          // Volume down
          const newVolumeDown = Math.max(volume - 0.1, 0);
          setVolume(newVolumeDown);
          toast.success(`🔉 Volume: ${Math.round(newVolumeDown * 100)}%`, { duration: 1000 });
          break;

        case 'KeyM':
          // Mute/Unmute
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with browser shortcuts
          setVolume(volume > 0 ? 0 : 0.5);
          toast.success(volume > 0 ? '🔇 Muted' : '🔊 Unmuted', { duration: 1000 });
          break;

        case 'KeyS':
          // Toggle shuffle
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with save shortcut
          toggleShuffle();
          toast.success(shuffle ? '🔀 Shuffle off' : '🔀 Shuffle on', { duration: 1000 });
          break;

        case 'KeyR':
          // Toggle repeat
          if (event.ctrlKey || event.metaKey) return; // Don't interfere with refresh
          const repeatModes = ['off', 'all', 'one'] as const;
          const currentModeIndex = repeatModes.indexOf(repeat);
          const nextMode = repeatModes[(currentModeIndex + 1) % repeatModes.length];
          toggleRepeat();
          toast.success(`🔁 Repeat: ${nextMode}`, { duration: 1000 });
          break;

        case 'KeyT':
          // Toggle theme
          if (event.ctrlKey || event.metaKey) return;
          toggleTheme();
          toast.success('🎨 Theme toggled', { duration: 1000 });
          break;

        case 'KeyL':
          // Toggle like (placeholder - would need to be implemented)
          if (event.ctrlKey || event.metaKey) return;
          toast.success('❤️ Like toggled', { duration: 1000 });
          break;

        case 'KeyF':
          // Focus search (placeholder - would need to be implemented)
          if (event.ctrlKey || event.metaKey) return;
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            toast.success('🔍 Search focused', { duration: 1000 });
          }
          break;

        case 'Slash':
          // Show keyboard shortcuts help
          if (!event.shiftKey) {
            showShortcutsHelp();
          }
          break;

        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    isPlaying,
    currentSong,
    volume,
    shuffle,
    repeat,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleTheme
  ]);

  const showShortcutsHelp = () => {
    const shortcuts = [
      { key: 'Space', action: 'Play/Pause' },
      { key: '→', action: 'Next song' },
      { key: '←', action: 'Previous song' },
      { key: 'Shift + →', action: 'Skip forward 10s' },
      { key: 'Shift + ←', action: 'Skip backward 10s' },
      { key: '↑', action: 'Volume up' },
      { key: '↓', action: 'Volume down' },
      { key: 'M', action: 'Mute/Unmute' },
      { key: 'S', action: 'Toggle shuffle' },
      { key: 'R', action: 'Toggle repeat' },
      { key: 'T', action: 'Toggle theme' },
      { key: 'L', action: 'Toggle like' },
      { key: 'F', action: 'Focus search' },
      { key: '/', action: 'Show this help' }
    ];

    const helpText = shortcuts
      .map(s => `${s.key}: ${s.action}`)
      .join('\n');

    toast.success(
      `⌨️ Keyboard Shortcuts:\n\n${helpText}`,
      { 
        duration: 8000,
        style: {
          whiteSpace: 'pre-line',
          textAlign: 'left'
        }
      }
    );
  };

  // This component doesn't render anything visible
  return null;
}
