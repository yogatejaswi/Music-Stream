'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaMusic } from 'react-icons/fa';

interface PlaylistCardProps {
  playlist: {
    _id: string;
    name: string;
    coverImage?: string;
    songs: any[];
  };
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${playlist._id}`} className="card group">
      <div className="relative aspect-square mb-3 bg-dark-100 flex items-center justify-center">
        {playlist.coverImage ? (
          <Image
            src={playlist.coverImage}
            alt={playlist.name}
            fill
            className="object-cover rounded"
          />
        ) : (
          <FaMusic size={48} className="text-gray-600" />
        )}
      </div>
      <h3 className="font-semibold truncate">{playlist.name}</h3>
      <p className="text-sm text-gray-400">
        {playlist.songs?.length || 0} songs
      </p>
    </Link>
  );
}
