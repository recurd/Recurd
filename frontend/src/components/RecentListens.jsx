import { useEffect, useState } from 'react';
import backend from '../backend.js'; // Using the pre-configured backend

import css from "../assets/css/components/listen_item.module.css"
import ListenItem from './ListenItem.jsx';

export default function RecentListens({ user_id }) {
  const [recentTracks, setRecentTracks] = useState([]); // Use mock data instead of fetching from API

  // Fetch recent listens from Spotify API via backend
  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const response = await backend.get('/user/'+user_id+'/listens?'+new URLSearchParams({n:10}))
        const listens = response.data.listens
        listens.forEach(l => l.time_stamp = new Date(l.time_stamp)) // convert to Date
        listens.sort((a,b) => b.time_stamp.valueOf() - a.time_stamp.valueOf()) // sort by recent to past
        setRecentTracks(listens)
      } catch (error) {
        console.error('Error fetching recent tracks:', error);
      }
    }

    fetchRecentTracks()
  }, []);

  return (
    <div className={css['recent-listens']}>
      <h2>Recent Listens</h2>
      <div className={css['track-list']}>
        {recentTracks.map(listen =>
            <ListenItem key={listen.id} listen={listen}/>
        )}
      </div>
    </div>
  )
}

// Mock data for testing
// const mockData = [
//   {
//     track: {
//       name: "Halo",
//       artists: [{ name: "Beyonce" }],
//       album: {
//         images: [
//           { url: "https://via.placeholder.com/50" }
//         ]
//       }
//     }
//   },
//   {
//     track: {
//       name: "Livin' the Dream",
//       artists: [{ name: "Morgan Wallen" }],
//       album: {
//         images: [
//           { url: "https://via.placeholder.com/50" }
//         ]
//       }
//     }
//   },
//   {
//     track: {
//       name: "God's Plan",
//       artists: [{ name: "Drake" }],
//       album: {
//         images: [
//           { url: "https://via.placeholder.com/50" }
//         ]
//       }
//     }
//   },
//   // Add more mock tracks as needed
// ];

{/* 
  const track = trackItem.track;
          const artistNames = track.artists.map(artist => artist.name).join(', ');
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
            </div> */}