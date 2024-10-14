import React, { useEffect, useState } from 'react';
import backend from '../backend.js'; // Using the pre-configured backend

const RecentListens = () => {
  const [recentTracks, setRecentTracks] = useState([]);

  // Fetch recent listens from Spotify API via backend
  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const response = await backend.get('/spotify/recently-played');
        setRecentTracks(response.data.items);
      } catch (error) {
        console.error('Error fetching recent tracks:', error);
      }
    };

    fetchRecentTracks();
  }, []);

  return (
    <div className="recent-listens">
      <h2>Recent Listens</h2>
      <ul>
        {recentTracks.map((trackItem, index) => {
          const track = trackItem.track;
          const artistNames = track.artists.map(artist => artist.name).join(', ');
          return (
            <li key={index} className="track-item">
              <img
                src={track.album.images[2]?.url || 'placeholder-image-url'} 
                alt={track.name}
                className="album-cover"
              />
              <span className="track-name">{track.name}</span>
              <span className="track-artist">{artistNames}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentListens;
