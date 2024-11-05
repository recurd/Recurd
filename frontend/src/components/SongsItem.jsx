import { Image, Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function SongsItem({ song }) {
    // Destructuring the song object { name, artist, thumbnail, plays} = song
    const name = song.name; 
    const artist = song.artist;
    const thumbnail = song.image;
    const plays = song.plays;

    return (
        <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5em" padding="0.5em">
            {/* Thumbnail */}
            <Link to={`/song/${thumbnail}`}>
                <Image
                    src={thumbnail}
                    alt={`${name} cover`}
                    height="2.5em"
                    width="2.5em"
                    borderRadius="md"
                    marginRight="1em"
                />
            </Link>

            {/* Song and Artist Information */}
            <Flex justifyContent="space-between" alignItems="center" flexGrow="1">
                <Box fontWeight="bold">
                    <Link to={"/song/"+song.id}>{name}</Link>
                </Box>
                <Box color="#666" fontSize="0.9rem" textAlign="right" whiteSpace="nowrap" marginLeft="1em">
                    {artist}
                </Box>
            </Flex>

            {/* Play Count */}
            <Box marginLeft="1em" color="#999" fontSize="0.9rem">
                {plays.toLocaleString()} plays
            </Box>
        </Flex>
    );
}
