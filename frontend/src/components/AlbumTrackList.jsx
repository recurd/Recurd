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
                response.data.sort((a,b) => Number(b.average_rating) - Number(a.average_rating));
                setTopTracks(response.data)
            } catch (err) {
                console.error("Error fetching top tracks: ", err)
            }
        } 
        fetchTopTracks()
    }, []);

    return (
        <Box display="flex" flexDirection="column" alignItems="left" gap={[1, 2]}>
          {topTracks.map((entry, index) => (
            <Box
              key={index}
              position="relative"
              bg="transparent"
              width={{ base: "20rem", md: "24rem", lg: "28rem" }}
              height="2.5rem"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              p={[2, 1]}
              borderRadius="md"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                height="100%"
                width={`${(entry.average_rating / 5.0) * 100}%`}
                bg="gray.300"
                borderRadius="inherit"
                zIndex="0"
              />
              <Flex
                alignItems="center"
                flex="1"
                zIndex="1"
                position="relative"
              >
                <Text fontWeight="bold" mx={2} fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                  #{index + 1}
                </Text>
                <Image
                  src={entry.image || altImage}
                  alt={`Artist ${index + 1}`}
                  borderRadius="full"
                  boxSize={{ base: "1.5rem", md: "2rem" }}
                  objectFit="cover"
                />
                <Text fontWeight="bold" mx={3} fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                  {entry.name}
                </Text>
              </Flex>
              <Flex alignItems="center" zIndex="1" position="relative" mr={2}>
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mr={1}>
                  {Number(entry.average_rating)}
                </Text>
                <Icon as={FaStar} color="gray.500" />
              </Flex>
            </Box>
          ))}
        </Box>
      );

}

export default AlbumTrackList;