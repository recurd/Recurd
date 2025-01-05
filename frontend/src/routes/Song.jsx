import { Avatar, Box, Icon, Text } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import { useParams } from "react-router-dom";

const sectionHeaderStyle = {
  as:"h2", 
  fontSize:'1.5rem',
  marginBottom:"2em"
}


function Song() {
  const { id } = useParams() // this is song id
    return (
      <div>
        {/* Header for the song Page */}
        <h2>Song Details</h2>

        <div className={"flex"}>
        {/* Left column */}
        
        <div className={"w-3/5 px-[30px]"}>
          <Box {...sectionHeaderStyle}>
            <Icon>
            <SiHeadphonezone/></Icon> Top Artists</Box>
          
          <Box {...sectionHeaderStyle}>
              <Icon>
              <SiHeadphonezone/></Icon> Top Albums</Box>
              
        </div>

        {/* Right column */}
        <div className={"w-2/5 px-[30px]"}>
        <Box {...sectionHeaderStyle}>
          <Icon>
          </Icon> Review</Box>
        </div>
      </div>
      </div>
    );
  }
  
  export default Song
  