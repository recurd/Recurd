import { useState } from "react";
import { useEffect } from "react";
import { Box, Text, Image, Flex, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import backend from "../backend.js";

function AlbumTrackList({ album_id }) {
    const [topTracks, setTopTracks] = useState([]);
    const altImage = "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1254695432-crop-6711597f37fae.jpg?crop=1xw:1xh;center,top&resize=640:*"
  
    useEffect(() => {
        async function fetchTopTracks() {
            try {
                const response = await backend.get('/album/'+album_id+'/tracks?'+
                    new URLSearchParams({
                        n: 5
                    }))
                setTopTracks(response.data)
            } catch (err) {
                console.error("Error fetching top tracks: ", err)
            }
        } 
        fetchTopTracks()
    }, []);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="left"
            gap={[1, 2]}
        >
            {topTracks.map((entry, index) => (
            <Box
                key={index}
                bg="gray.200"
                width={{ base: "20rem", md: "24rem", lg: "28rem" }}
                height="2.5rem"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                p={[2, 1]}
                borderRadius="0"
                boxShadow="md"
            >
                <Flex alignItems="center" flex="1">
                <Text fontWeight="bold" mx={2} fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                    #{index+1}
                </Text>
                <Image
                    src={entry.image || altImage}
                    alt={`Artist ${index + 4}`}
                    borderRadius="full"
                    boxSize={{ base: "1.5rem", md: "2rem" }}
                    objectFit="cover"
                />
                <Text fontWeight="bold" mx={3} fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                    {entry.name}
                </Text>
                </Flex>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mx={3}>
                    {entry.listens}
                </Text>
                <Flex alignItems="center" mr={2}>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mr={1}>
                        0.0
                    </Text>
                    <Icon as={FaStar} color="gray.500" />
                </Flex>
            </Box>
            ))}
        </Box>
    );

}

export default AlbumTrackList;