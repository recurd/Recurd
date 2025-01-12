import { Avatar, Box, Icon, Text } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import backend from "../backend";
import TopListeners from "../components/SongTopListeners";

const sectionHeaderStyle = {
  as:"h2", 
  fontSize:'1.5rem',
  marginBottom:"2em"
}


function Song() {
  const { id } = useParams() // this is song id
  const [songName, setSongName] = useState(null)
  const [image, setImage] = useState(null)

  useEffect(() => {
    (async () => {
        try {
          const res = await backend.get('/song/'+id)
          const data = res.data
          setSongName(data[0].name)
          setImage(data[0].image)
        } catch (err) {
            console.error("Error fetching song data: ", err)
        }
    })()
  }, []);

  return (
    <div>
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
      {/* Header for the song Page */}
      <Box textAlign="center" mb="4" zIndex="3">
        <Box fontSize="2.5rem" zIndex="3">{songName}</Box>
          <Box display="flex" justifyContent="left" ml="10" mt="4" alignItems="center">
            <Avatar name={songName} src={image} size="2xl" zIndex="3" />
            <Text fontSize="2.5rem" color="white" zIndex="3" mt="-12" position="relative" ml="4">
              {songName}
            </Text>
          </Box>
        </Box>
      </Box>

      <div className={"flex"}>
      {/* Left column */}
      
      <div className={"w-3/5 px-[30px]"}>
        <Box {...sectionHeaderStyle}>
          <Icon>
          <SiHeadphonezone/></Icon> Top Listeners</Box>
          <TopListeners song_id={id}/>
            
      </div>

      {/* Right column */}
      <div className={"w-2/5 px-[30px]"}>
      <Box {...sectionHeaderStyle}>
        <Icon>
        </Icon> Activity</Box>
      </div>
    </div>
    </div>
  );
}
  
  export default Song
  