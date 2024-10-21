import { useParams } from "react-router-dom";
import TopSongs from "../components/TopSongs";
import RecentListens from "../components/RecentListens";
import Histogram from "../components/Histogram";
import { Box, Image } from '@chakra-ui/react'
import axios from 'axios';

function Profile() {
  const { id } = useParams() // this is user's id
  return (
    <div>
      {/* Header for the Profile Page */}
      <h2>User Profile</h2>
        <Box as="header" height="100vh" width="100vw" bg="0d1117">
        <Text fontSize="4xl" color="white" textAlign="center">

        </Text>
        <Image
          borderRadius='full'
          boxSize='150px'
          src='https://bit.ly/dan-abramov'
          alt='Dan Abramov'
        />  
        </Box>
      {/* Placeholder for the profile description */}
      {/* TODO: Display user's profile information */}
      
      {/* Placeholder for the edit profile button (if viewing own profile) */}
      {/* TODO: Implement edit button for logged-in users */}
      
      {/* Placeholder for the recent listens */}
      {/* TODO: Add a section to show user's recent listens */}
      
      {/* Placeholder for the reviews */}
      {/* TODO: Display user's reviews */}

    </div>
  );
}

export default Profile;
