
export interface Genre {
  id: string;
  name: string;
  icon: string;
  color: string;
  vibe: string;
}

export const GENRES: Genre[] = [
  { id: 'afrobeats', name: 'Afrobeats', icon: '🌍', color: '#22c55e', vibe: 'Rhythmic & Vibrant' },
  { id: 'hiphop', name: 'Hip-Hop', icon: '🎤', color: '#a855f7', vibe: 'Poetic & Punchy' },
  { id: 'pop', name: 'Pop', icon: '⭐', color: '#3b82f6', vibe: 'Catchy & Bright' },
  { id: 'rnb', name: 'R&B', icon: '💜', color: '#d946ef', vibe: 'Smooth & Soulful' },
  { id: 'amapiano', name: 'Amapiano', icon: '🪘', color: '#f97316', vibe: 'Groovy & Deep' },
  { id: 'drill', name: 'Drill', icon: '🔪', color: '#64748b', vibe: 'Gritty & High-Energy' },
  { id: 'reggae', name: 'Reggae', icon: '🌿', color: '#facc15', vibe: 'Chill & Conscious' },
  { id: 'custom', name: 'Custom', icon: '🎵', color: '#FF3399', vibe: 'Your Choice' },
];

export const MOCK_LYRICS = [
  {
    genre: 'afrobeats',
    artist: 'Wizkid',
    title: 'Essence',
    snippet: 'Time is of the essence, I tried to teach you a',
    answer: 'lesson',
  },
  {
    genre: 'hiphop',
    artist: 'Kendrick Lamar',
    title: 'Not Like Us',
    snippet: 'Say, Drake, I hear you like \'em',
    answer: 'young',
  },
  {
    genre: 'pop',
    artist: 'Taylor Swift',
    title: 'Blank Space',
    snippet: 'But I\'ve got a blank space, baby, and I\'ll write your',
    answer: 'name',
  }
];
