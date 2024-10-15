import React, { useEffect, useState } from 'react';
import backend from '../backend.js'; // Using the pre-configured backend

import css from "../assets/css/components/listen_item.module.css"

//const RecentListens = () => {
//  const [recentTracks, setRecentTracks] = useState([]);
//
//  // Fetch recent listens from Spotify API via backend
//  useEffect(() => {
//    const fetchRecentTracks = async () => {
//      try {
//        const response = await backend.get('/spotify/recently-played');
//        setRecentTracks(response.data.items.slice(0, 10));
//
//      } catch (error) {
//        console.error('Error fetching recent tracks:', error);
//      }
//    };
//
//    fetchRecentTracks();
//  }, [recentTracks]);

const RecentListens = () => {
  // Mock data for testing
  const mockData = [
    {
      track: {
        name: "Halo",
        artists: [{ name: "Beyonce" }],
        album: {
          images: [
            { url: "https://via.placeholder.com/50" }
          ]
        }
      }
    },
    {
      track: {
        name: "Livin' the Dream",
        artists: [{ name: "Morgan Wallen" }],
        album: {
          images: [
            { url: "https://via.placeholder.com/50" }
          ]
        }
      }
    },
    {
      track: {
        name: "God's Plan",
        artists: [{ name: "Drake" }],
        album: {
          images: [
            { url: "https://via.placeholder.com/50" }
          ]
        }
      }
    },
    // Add more mock tracks as needed
  ];

  const [recentTracks] = useState(mockData); // Use mock data instead of fetching from API

  return (
    <div className={css['recent-listens']}>
      <h2>Recent Listens</h2>
      <div className={css['track-list']}>

        {recentTracks.map((trackItem, index) => {
          const track = trackItem.track;
          const artistNames = track.artists.map(artist => artist.name).join(', ');
          return (
            <div key={index} className={css['track-item']}>
              <img
                src={track.album.images[0]?.url || 'placeholder-image-url'} 
                alt={track.name}
                className={css['album-cover']}
              />
              <div className={css['track-info']}>
                <span className={css['track-name']}>{track.name}</span>
                <span className={css['track-artist']}>{artistNames}</span>
              </div>
            </div>
          );
        })}
        
      </div>
    </div>
  );
};

export default RecentListens;
