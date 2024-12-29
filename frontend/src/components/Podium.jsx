import React, { useState } from "react";
import { Box, Text, VStack, HStack, Image } from "@chakra-ui/react";

export default function Podium ({ topArtists }) {
  if (!topArtists || topArtists.length < 5) {
    console.log(topArtists)
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

  const testImage = "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1254695432-crop-6711597f37fae.jpg?crop=1xw:1xh;center,top&resize=640:*"

  return (
    <Box>
      {/*1, 2 & 3 places*/}
      <Box display="flex" alignItems="flex-end" justifyContent="center" height="15rem" mt={4}>
        {podiumOrder.map((podium, index) => (
          <VStack key={index} spacing={2} textAlign="center" mx={2}>
            <Box position="relative" top="-1rem">
              <Image
                src={podium.image ? (podium.image) : (testImage) }
                alt={`Artist ${index + 1}`}
                borderRadius="full"
                boxSize="4rem"
                objectFit="cover"
                border="2px solid white"
              />
            </Box>

            <Box
              bg="gray.200"
              width="8rem"
              height={`${podium.height}rem`}
              display="flex"
              alignItems="top"
              justifyContent="center"
              borderRadius="0"
              boxShadow="md"
            >
              <Text fontWeight="bold">{podium.listens}</Text>
            </Box>
            <Text fontWeight="bold">{podium.artist}</Text>
          </VStack>
        ))}
      </Box>

      {/*4 & 5 places*/}
      <Box display="flex" flexDirection="column" alignItems="center" mt={8} gap={4} ml={30}>
        {longList.map((entry, index) => (
          <Box
            key={index}
            bg="gray.200"
            width="24rem"
            height="3rem"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            p={2}
            borderRadius="0"
            boxShadow="md"
          >
            <Text fontWeight="bold" position="absolute" left="0.33rem">{entry.place}</Text>

            <Image
              src={entry.image ? (entry.image) : (testImage) }
              alt={`Artist ${index + 4}`}
              borderRadius="full"
              boxSize="2.5rem"
              objectFit="cover"
            />

            <Text fontWeight="bold" mx={3}>{entry.artist}</Text>
            
            <Text fontWeight="bold" position="absolute" left="27rem">{entry.listens}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}