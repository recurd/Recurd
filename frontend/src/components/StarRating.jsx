// Import necessary modules
import React, { useState } from 'react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = () => {
  const [rating, setRating] = useState(0); // locked in rating
  const [hoverRating, setHoverRating] = useState(0); // hovering rating

  const handleMouseMove = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const starWidth = width / 5; // for each of the five stars
    const relativeX = e.clientX - left;
    const hoverValue = Math.min(5, Math.max(0, (relativeX / starWidth)));
    setHoverRating(Math.round(hoverValue * 2) / 2); // rouding to nearest 0.5
  };

  const handleClick = () => {
    setRating(hoverRating);
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isFull = i <= Math.floor(hoverRating || rating);
      const isHalf = !isFull && (hoverRating || rating) >= i - 0.5;

      stars.push(
        <Icon
          key={i}
          as={isFull ? FaStar : isHalf ? FaStarHalfAlt : FaStar}
          boxSize={6}
          color={isFull || isHalf ? 'yellow.400' : 'gray.300'}
        />
      );
    }

    return stars;
  };

  return (
    <Flex
      align="center"
      position="relative"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={() => setHoverRating(0)}
      width="120px"
      height="24px"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={1}
        cursor="pointer"
      />
      <Flex zIndex={0}>{renderStars()}</Flex>
      <Box ml={3} fontWeight="bold">
        {rating > 0 ? `Rating: ${rating} Stars` : 'Hover to rate'}
      </Box>
    </Flex>
  );
};

export default StarRating;
