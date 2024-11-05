import { useParams } from "react-router-dom";
import { Box, Icon } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import Activity from "../components/Activity";
import RecentListens from "../components/RecentListens";
import TopAlbum from "../components/UserTopAlbum";
import CurrentListen from "../components/CurrentListen";

const sectionHeaderStyle = {
  as:"h2", 
  fontSize:'1.5rem',
  marginBottom:"2em"
}

function Profile() {
  const { id } = useParams() // this is user's id
  return (
    <div>
      {/* Header for the Profile Page */}
      <h2>User Profile</h2>
      
      {/* Placeholder for the profile description */}
      {/* TODO: Display user's profile information */}
      
      {/* Placeholder for the edit profile button (if viewing own profile) */}
      {/* TODO: Implement edit button for logged-in users */}

      <Box {...sectionHeaderStyle}>
          <Icon>
          <SiHeadphonezone/></Icon> Top Albums</Box>
      <TopAlbum user_id={id}/>

      <CurrentListen user_id={id}/>
      <Activity />

      <Box {...sectionHeaderStyle}>
          <Icon>
          <SiHeadphonezone/></Icon> Recent Listens</Box>
      <RecentListens user_id={id}/>

      {/* Placeholder for the reviews */}
      {/* TODO: Display user's reviews */}
    </div>
  );
}

export default Profile;
