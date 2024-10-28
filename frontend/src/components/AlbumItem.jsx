import { Box, Image } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

export default function AlbumItem({album}){
    const navigate = useNavigate()
    return (
        <Box cursor="pointer" onClick={() => navigate("/album/"+album.id)} width="fit-content">
            <Image src={album.image} alt={album.title} 
                height={{md: "200px", lg: "300px"}} aspectRatio={1} />
            <p>{album.name}</p>
            <p>{album.artists.map(a =>
                    <Box key={a.id} _hover={{ color: '#000' }}>
                        <Link to={"/artist/"+a.id}>{a.name}</Link><br />
                    </Box>)
                }</p>
            <p>{album.listen_count}</p>
        </Box>
    );
}
