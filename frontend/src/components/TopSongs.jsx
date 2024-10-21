import React, {useEffect, useState} from 'react';
// import backend from '../backend.js'; // Using the pre-configured backend
// import 'css stuff placeholder';
import axios from 'axios';
import { Box, Flex, Text, Image, Button } from '@chakra-ui/react';

const TopSongs = () => {
    const [songData, setSongData] = useState([]); // storing data
    const [loading, setLoading] = useState(true); // tracking loading state
    const [error, setError] = useState(null); // store error

    // Fetch top songs data from the backend
    // useEffect(() => {
       // //axios??
        //const fetchTopSongsDiff = () => {
        // axios.get('./songs data')
        // .then(res => {
        //   // handle success
        //   console.log(response);
        // })
        // .catch(err => {
        //   // handle error
        //   console.log(error);
        // });
        //}
    //     const fetchTopSongs = async () => {
    //         try {
    //             setLoading(true); 
    //             const response = await backend.get('/top-songs placeholder'); // Replace with the actual API endpoint for top songs
    //             setSongData(response.data.slice(0, 10)); // Limit to 10 songs
    //             setLoading(false); 
    //         } catch (err) {
    //             setError('Failed to fetch top songs.'); 
    //             setLoading(false); 
    //         }
    //     };

    //     fetchTopSongs();
    // }, []); // Empty dependency array to run once on component mount

    
    const mockTopSongs = [
        { name: 'Song A', artist: 'Artist A', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 1500 },
        { name: 'Song B', artist: 'Artist B', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 2500 },
        { name: 'Song C', artist: 'Artist C', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 3500 },
        { name: 'Song D', artist: 'Artist D', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 4500 },
        { name: 'Song E', artist: 'Artist E', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 5500 },
        { name: 'Song F', artist: 'Artist F', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 6500 },
        { name: 'Song G', artist: 'Artist G', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 7500 },
        { name: 'Song H', artist: 'Artist H', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 8500 },
        { name: 'Song I', artist: 'Artist I', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 9500 },
        { name: 'Song J', artist: 'Artist J', thumbnail: 'https://pbs.twimg.com/profile_images/1752515582665068544/3UsnVSp5_400x400.jpg', plays: 10500 },
    ];
    useEffect(() => {
        const fetchTopSongs = async () => {
            try {
                setLoading(true); // Start loading
                // Simulate fetching data from backend
                setTimeout(() => {
                    setSongData(mockTopSongs);
                    setLoading(false);
                }, 1000); // Simulate a delay
            } catch (err) {
                setError('Failed to fetch top songs.'); 
                setLoading(false); 
            }
        };

        fetchTopSongs();
    }, []); // Empty dependency array to run once on component mount

    // Conditional rendering based on loading, error, and data states
    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>{error}</div>; 
    }
    const sortedSongs = songData.sort((a, b) => b.plays - a.plays);
    return (
        <div className="top-songs">
        <h2>Top Songs</h2>
        {songData.length > 0 ? (
        <ul>
            {sortedSongs.slice(0, 10).map((song, index) => (
                <li key={index} className="song-item">
                    <a href={`/song/${song.id}`} className="song-link">
                        <img src={song.thumbnail} alt={`${song.name} cover`} className="song-thumbnail" />
                    </a>
                    <div className="song-details">
                        <h3>{song.name}</h3>
                        <p>{song.artist}</p>
                        <p>{song.plays}</p>
                    </div>
                </li>
            ))}
        </ul>
        ) : (
            <p>Start Listening to see Top Songs</p>
            )
        }
    </div>
    );
};
export default TopSongs;
src/components/TopSongs.js
