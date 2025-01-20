import { Avatar, Box, Icon, Text } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import backend from "../backend";
import TrackList from "../components/AlbumTrackList";
import TopListeners from "../components/AlbumTopListeners";
import Reviews from "../components/Reviews";
import Rating from "../components/StarRating"

const sectionHeaderStyle = {
  as:"h2", 
  fontSize:'1.5rem',
  marginBottom:"2em"
}

function Album() {
  const { id } = useParams() // this is album id
  const [albumName, setAlbumName] = useState(null)
  const [image, setImage] = useState(null)
  
  useEffect(() => {
    (async () => {
        try {
          const res = await backend.get('/album/'+id)
          const data = res.data
          setAlbumName(data.name)
          setImage(data.image)
        } catch (err) {
            console.error("Error fetching album data: ", err)
        }
    })()
  }, []);

  return (
    <div>
      
      {/* Gray header box */}
      <Box position="relative" textAlign="center" >
      <Box
        bg="gray.700"
        width="100%"
        height="150px" // Adjust height to cover up to middle of Avatar
        position="absolute"
        top="0"
        left="0"
        zIndex="1"
      />

      {/* Header for the album Page */}

      <Box textAlign="center" mb="4" zIndex="3">
        <Box fontSize="2.5rem" zIndex="3">{albumName}</Box>
          <Box display="flex" justifyContent="left" ml="10" mt="4" alignItems="center">
            <Avatar name={albumName} src={image} size="2xl" zIndex="3" />
            <Text fontSize="2.5rem" color="white" zIndex="3" mt="-12" position="relative" ml="4">
              {albumName}
            </Text>
          </Box>
        </Box>
      </Box>
      <div className={"flex"}>
        {/* Left column */}
        
        <div className={"w-3/5 px-[30px]"}>
          <Box {...sectionHeaderStyle}>
            <Icon>
            <SiHeadphonezone/></Icon> Tracklist</Box>
            <TrackList album_id={id}/>
          <Box {...sectionHeaderStyle}>
              <Icon>
              <SiHeadphonezone/></Icon> Top Listeners</Box>
              <TopListeners album_id={id}/>
          <Box {...sectionHeaderStyle}>
              <Icon>
              <SiHeadphonezone/></Icon> Reviews</Box>
              <Reviews ReviewList={[
                  {
                      "user_id": "33bd22c5-0bb1-4a4e-8183-5e10fc0da45e",
                      "time_stamp": "2024-10-21T20:11:56.063Z",
                      "rating": 2,
                      "review": "This is the body of the review. This is the body of the review. This is the body of the review. This is the body of the review. This is the body of the review. This is the body of the review. This is the body of the review. This is the body of the review. This is the body of the review..."
                  }, {
                    "user_id": "33bd22c5-0bb1-4a4e-8183-5e10fc0da45e",
                    "time_stamp": "2024-10-21T20:11:56.063Z",
                    "rating": 2,
                    "review": "N@X99}I.<["
                }
              ]}/>
            
        </div>

        {/* Right column */}
        <div className={"w-2/5 px-[30px]"}>
        <Box {...sectionHeaderStyle}>
          <Icon>
          </Icon> Review</Box>
          <Rating></Rating>
          
        <Box {...sectionHeaderStyle}>
          <Icon>
          </Icon> Ratings</Box>
        <Box {...sectionHeaderStyle}>
          <Icon>
          </Icon> Activity</Box>
        </div>
      </div>
    </div>
  );
}

export default Album
