import { Image, Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function formatTimestamp(timestamp) {
    return timestamp.getMonth()+'/'+timestamp.getDay()+' '+timestamp.getHours()+':'+
        (timestamp.getMinutes() < 10 ? '0':'') + timestamp.getMinutes()
}

export default function ListenItem({ listen, ...props }) {
    const song = listen.song
    const timestamp = listen.time_stamp
    const artists = listen.artists
    const album = listen.album

    return <Flex justifyContent="space-between"
                alignItems="center"
                marginBottom="0.2em"
                padding="0.1em"
                className={"shadow-sm transition duration-100 hover:shadow-md"}
                {...props}>
        { album ?
            <Link to={"/album/"+album.image}>
                <Image 
                    src={album.image}
                    alt={album.name}
                    height="2.5em"
                    aspectRatio={1}
                    marginRight="1em" />
            </Link>
            : <Image src={"TODO"} aspectRatio={1} 
                marginRight="1em"/>
        }
        <Flex justifyContent="space-between" alignItems="center" flexGrow="1">
            <Box fontWeight="bold">
                <Link to={"/song/"+song.id}>{song.name}</Link>
            </Box>
            <Box color='#666'
                fontSize='0.9rem'
                textAlign='right'
                whiteSpace="nowrap">
                { artists.map(a =>
                    <Box key={a.id} _hover={{ color: '#000' }}>
                        <Link to={"/artist/"+a.id}>{a.name}</Link><br />
                    </Box>
                )}
            </Box>
        </Flex>
        <Box marginLeft='1em'>
            {formatTimestamp(timestamp)}
        </Box>
    </Flex>
}