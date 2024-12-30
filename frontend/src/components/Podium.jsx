import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Image, Flex } from "@chakra-ui/react";

export default function Podium({ topArtists }) {
  if (!topArtists || topArtists.length < 5) {
    return <Text>Not enough top artists available at the moment.</Text>;
  }

  const podiumOrder = [
    { place: "2nd", height: "8", artist: topArtists[1].name, listens: topArtists[1].listen_count, image: topArtists[1].image },
    { place: "1st", height: "10", artist: topArtists[0].name, listens: topArtists[0].listen_count, image: topArtists[0].image },
    { place: "3rd", height: "6", artist: topArtists[2].name, listens: topArtists[2].listen_count, image: topArtists[2].image },
  ];

  const longList = [
    { place: "4th", artist: topArtists[3].name, listens: topArtists[3].listen_count, image: topArtists[3].image },
    { place: "5th", artist: topArtists[4].name, listens: topArtists[4].listen_count, image: topArtists[4].image },
  ];

  const altImage = "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1254695432-crop-6711597f37fae.jpg?crop=1xw:1xh;center,top&resize=640:*"

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Box p={[2, 4, 8]}>
      {/*1, 2 & 3 places*/}
      <Box
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        height={{ base: "12rem", md: "15rem", lg: "18rem" }}
        mt={[2, 4]}
      >
        {podiumOrder.map((podium, index) => (
          <VStack key={index} spacing={2} textAlign="center" mx={{ base: 1, md: 2 }}>
            <Box position="relative" top="-1rem">
              <Image
                src={podium.image || altImage}
                alt={`Artist ${index + 1}`}
                borderRadius="full"
                boxSize={{ base: "3rem", md: "4rem", lg: "5rem" }}
                objectFit="cover"
                border="2px solid white"
              />
            </Box>
            <Box
              bg="gray.200"
              width={{ base: "5rem", md: "7rem", lg: "9rem" }}
              height="0rem"
              display="flex"
              alignItems="top"
              justifyContent="center"
              borderRadius="0"
              boxShadow="md"
              style={{
                height: animate ? `${podium.height}rem` : "0rem",
                transition: "height 1.5s ease-in-out",
              }}
            >
              <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                {podium.listens}
              </Text>
            </Box>
            <Text fontWeight="bold" fontSize={{ base: "sm", md: "md", lg: "lg" }}>
              {podium.artist}
            </Text>
          </VStack>
        ))}
      </Box>

      {/*4 & 5 places*/}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={[4, 6, 8]}
        gap={[2, 4]}
        ml={{ base: 0, lg: 6 }}
      >
        {longList.map((entry, index) => (
          <Box
            key={index}
            bg="gray.200"
            width={{ base: "20rem", md: "24rem", lg: "28rem" }}
            height="3rem"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            p={[2, 4]}
            borderRadius="0"
            boxShadow="md"
          >
            <Flex alignItems="center" flex="1">
              <Text fontWeight="bold" position="absolute" left="1.5rem" fontSize={{ base: "sm", md: "md" }}>
                {entry.place}
              </Text>
              <Image
                src={entry.image || altImage}
                alt={`Artist ${index + 4}`}
                borderRadius="full"
                boxSize={{ base: "2rem", md: "2.5rem" }}
                objectFit="cover"
              />
              <Text fontWeight="bold" mx={3} fontSize={{ base: "sm", md: "md", lg: "lg" }}>
                {entry.artist}
              </Text>
            </Flex>
            <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mx={3}>
              {entry.listens}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}