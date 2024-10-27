import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import  {Link} from 'react-router-dom';
import axios from 'axios';

const TopSongs = () => {
    const [songData, setSongData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchTopSongs = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await axios.get('/api/top-songs'); // Replace with backend point
    //             setSongData(response.data);
    //             setLoading(false);
    //         } catch (err) {
    //             setError('Failed to fetch top songs.');
    //             setLoading(false);
    //         }
    //     };

    //     fetchTopSongs();
    // }, []);
    // if (loading) {
    //     return <Text>Loading...</Text>;
    // }

    // if (error) {
    //     return <Text>{error}</Text>;
    // }

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
                setLoading(true); 
                setTimeout(() => {
                    setSongData(mockTopSongs);
                    setLoading(false);
                }, 1000); 
            } catch (err) {
                setError('Failed to fetch top songs.'); 
                setLoading(false); 
            }
        };

        fetchTopSongs();
    }, []); // Empty dependency array to run once on component mount

    // Conditional rendering based on loading, error, and data states
    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const sortedSongs = songData.sort((a, b) => b.plays - a.plays);

    return (
        <Box maxW="800px" mx="auto" p={5} bg="#f5f5f5" borderRadius="md">
            <Text fontSize="2xl" textAlign="center" mb={4}>
                Top Songs
            </Text>
            <Flex direction="column" gap={4}>
                {sortedSongs.map((song, index) => (
                    <Box
                        key={index}
                        borderWidth="1px"
                        borderRadius="md"
                        p={4}
                        display="flex"
                        alignItems="center"
                        bg="white"
                        boxShadow="sm"
                        _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
                    >
                            {/* <Link to {'./song/' + song.name}> */}
                            <Image
                                src={song.thumbnail}
                                alt={song.name + 'cover'}
                                boxSize="50px"
                                borderRadius="md"
                                />
                            {/* </Link> */}
                        <Flex direction="column" flex="1">
                            <Text fontWeight="bold" fontSize="lg">{song.name}</Text>
                            <Text fontSize="md" color="gray.600">{song.artist}</Text>
                        </Flex>
                        <Text fontSize="md" textAlign="right" color="gray.800">
                            {song.plays.toLocaleString()} plays
                        </Text>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
};

export default TopSongs;