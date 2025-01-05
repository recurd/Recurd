import { Avatar, Box, Icon, Text } from "@chakra-ui/react"
import { SiHeadphonezone } from "react-icons/si";
import { useParams } from "react-router-dom";

const sectionHeaderStyle = {
  as:"h2", 
  fontSize:'1.5rem',
  marginBottom:"2em"
}


function Artist() {
  const { id } = useParams() // this is artist id
  return (
    <div>
      {/* Header for the Artist Page */}
      <h2>Artist Details</h2>
      
      {/* Placeholder for displaying artist's albums */}
      {/* TODO: Implement grid view of artist's albums */}
      
      {/* Placeholder for the ratings graph */}
      {/* TODO: Implement ratings graph based on user feedback */}

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

export default Artist;
