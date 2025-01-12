import React from "react";
import { Box, Text, Flex, Icon, Avatar } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

function Reviews({ Reviews }) {

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleDateString("en-US", options);
    };
    return (
        <Box display="flex" flexDirection="column" gap={4}>
            {albumReviews.map((review, index) => (
                <Flex
                key={index}
                bg="gray.200"
                borderRadius="md"
                boxShadow="md"
                p={4}
                >
                    <Flex alignItems="top" mr={4}>
                        <Avatar name={`User ${review.user_id}`} size="md" />
                    </Flex>

                    <Flex flexDirection="column" flex="1">
                        <Flex justifyContent="space-between" alignItems="center" mb={2}>
                            <Box mb={2}>
                            <Text fontWeight="bold" fontSize="lg" className="text-gray-800">
                                Song Name
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Artist
                            </Text>
                            </Box>
                            <Flex alignItems="center" gap={1} mt="-10">
                                <Text fontSize="sm" fontWeight="bold">
                                {review.rating}
                                </Text>
                                <Icon as={FaStar} color="gray.500" />
                            </Flex>
                        </Flex>
                        <Text fontSize="sm" className="text-gray-700">
                            {review.review}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt="auto" alignSelf="flex-end">
                            {formatDate(review.time_stamp)}
                        </Text>
                    </Flex>
                </Flex>
            ))}
        </Box>
    );
}

export default AlbumReviews;