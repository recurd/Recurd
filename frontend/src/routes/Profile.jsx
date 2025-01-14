import { useParams } from "react-router-dom";
import { Avatar, Box, Icon, Text, Button } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import Activity from "../components/Activity";
import RecentListens from "../components/RecentListens";
import TopAlbum from "../components/UserTopAlbum";
import TopArtists from "../components/UserTopArtists";
import CurrentListen from "../components/CurrentListen";
import { useEffect, useState } from "react";
import backend from "../backend";
import { getID } from '../user.js'
import { useNavigate } from 'react-router-dom'

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

  //TODO: Connect this to backend
  const [isFollowed, setIsFollowed] = useState(false)

  const [isOwnProfile, setIsOwnProfile] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
        try {
          const res = await backend.get('/user/'+id+'/profile')
          const data = res.data
          setDisplayName(data.display_name)
          setImage(data.image)
          setFollowers(data.follower_count)
          setFollowings(data.following_count)

          const localUserID = await getID()
          setIsOwnProfile(id == localUserID)

        } catch (error) {
          console.error('Error fetching user data:', error);
        }
    })()
  }, [])

  return (
    <div>
      
      {/* Gray header box */}
      <Box position="relative" textAlign="center" >
        <Box fontSize='1.5rem' zIndex="3" position="absolute" left="4" bottom="16" display="inline-flex">
          <Text color="blue.500" zIndex="3" position="relative" as="button"
          _hover={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/follow/" + id)}>
            {followers + " Followers"}
          </Text>
          <Text color="blue.500" ml="2" zIndex="3" position="relative" as="button"
          _hover={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate("/follow/" + id)}>
            {followers + " Following"}
          </Text>
          {isOwnProfile ||
            <Button px="2" ml="4">
              <Text fontSize="1.5rem" color="blue.500" zIndex="3" as="button"
                  _hover={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => alert("Followed! This is WIP")}>
                    {"+ Follow"}
              </Text>
            </Button>
          }
        </Box>
      <Box
        bg="gray.700"
        width="100%"
        height="150px" // Adjust height to cover up to middle of Avatar
        position="absolute"
        top="0"
        left="0"
        zIndex="1"
        />
      {/* Profile header */}
      
      <Box textAlign='center' mb = '4' zIndex="3">
        <Box fontSize='2.5rem' zIndex="3">{ displayName }</Box>
        <Text fontSize="2.5rem" color="white" mt="-12" zIndex="3" position="relative">
          {displayName}
        </Text>
        <Box display = 'flex' justifyContent = 'center' mt = '2'>
          <Avatar name={displayName} src={image} size='2xl' zIndex="3"/>
        </Box>
      </Box>
    </Box>
      <CurrentListen user_id={id}/>

      <div className={"flex"}>
        {/* Left column */}
        
        <div className={"w-3/5 px-[30px]"}>
          <Box {...sectionHeaderStyle}>
            <Icon>
            <SiHeadphonezone/></Icon> Top Artists</Box>
          <TopArtists user_id={id}/>
          <Box {...sectionHeaderStyle}>
              <Icon>
              <SiHeadphonezone/></Icon> Top Albums</Box>
              <TopAlbum user_id={id}/>
        </div>

        {/* Right column */}
        <div className={"w-2/5 px-[30px]"}>
          <Box {...sectionHeaderStyle}>
              <Icon>
              <SiHeadphonezone/></Icon> Recent Listens</Box>
            <RecentListens user_id={id}/>
          <Activity />
        </div>
      </div>
    </div>
  );
}

export default Profile;
