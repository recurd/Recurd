import { Image, Flex, Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function SongsItem({ song }) {
    const artist = song.artist
    const name = song.name
    const thumbnail = song.thumbnail
    const plays = song.plays;
        return (
            <Box
            borderWidth="1px"
            borderRadius="md"
            p={4}
            display="flex"
            alignItems="center"
            bg="white"
            boxShadow="sm"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            transition="0.2s"
        >
            <Link to={`./song/${name}`}>
                <Image
                    src={thumbnail}
                    alt={`${name} cover`}
                    boxSize="50px"
                    borderRadius="md"
                    mr={4}
                />
            </Link>
            <Flex direction="column" flex="1">
                <Text fontWeight="bold" fontSize="lg">
                    {name}
                </Text>
                <Text fontSize="md" color="gray.600">
                    {artist}
                </Text>
            </Flex>
            <Text fontSize="md" textAlign="right" color="gray.800">
                {plays.toLocaleString()} plays
            </Text>
        </Box>
        )
}