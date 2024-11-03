import { useParams } from "react-router-dom";
import { Avatar, Box, Icon } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import Activity from "../components/Activity";
import RecentListens from "../components/RecentListens";
import TopAlbum from "../components/UserTopAlbum";
import CurrentListen from "../components/CurrentListen";
import { useEffect, useState } from "react";
import backend from "../backend";

const sectionHeaderStyle = {
  as:"h2", 
  fontSize:'1.5rem',
  marginBottom:"2em"
}

function Profile() {
  const { id } = useParams() // this is user's id
  const [displayName, setDisplayName] = useState(null)
  const [image, setImage] = useState(null)
  const [followers, setFollowers] = useState(null)
  const [followings, setFollowings] = useState(null)

  useEffect(() => {
    (async () => {
        try {
          const res = await backend.get('/user/'+id+'/profile')
          const data = res.data
          setDisplayName(data.display_name)
          setImage(data.image)
          setFollowers(data.follower_count)
          setFollowings(data.following_count)
        } catch (error) {
          console.error('Error fetching recent tracks:', error);
        }
    })()
  }, [])

  return (
    <div>
      {/* Profile header */}
      <Box>
        <Box fontSize='2.5rem'>{ displayName }</Box>
        <Box>
          <Avatar name={displayName} src={image} size='2xl'/>
        </Box>
      </Box>

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
    </div>
  );
}

export default Profile;
