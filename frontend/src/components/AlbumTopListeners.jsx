import { useState } from "react";
import { useEffect } from "react";
import { Avatar, Box, Grid, GridItem } from "@chakra-ui/react";
import backend from "../backend.js";
import AlbumItem from "./AlbumItem.jsx";

export default function AlbumTopListeners({ album_id }) {
    const [topListeners, setTopListeners] = useState([]);

    useEffect(() => {
        async function fetchTopListeners() {
            try {
                const response = await backend.get('/album/'+album_id+'/top-listeners?'+
                    new URLSearchParams({
                        n: 10
                    }))
                setTopListeners(response.data)
                console.log(response.data)
            } catch (err) {
                console.error("Error fetching top listeners: ", err)
            }
        } 
        fetchTopListeners()
    }, []);
    //change to component
    return (
        <Grid templateColumns={{base: "repeat(1, 1fr)",sm: "repeat(2, 1fr)",md: "repeat(3, 1fr)",lg: "repeat(4, 1fr)",xl: "repeat(5, 1fr)"}} className={"mt-[-15px] px-[20px]"}>
            {topListeners.length > 0 ? (
                topListeners.map(listener => (
                    <GridItem key={listener.id} colSpan="1">
                        <Box className={"relative w-full aspect-square p-2"}>
                            <Avatar name={listener.display_name} src={listener.image} size='lg' zIndex="3"/>
                        </Box>
                    </GridItem>
                ))
            ) : (
            <p>No top albums available at the moment.</p>
            )}
        </Grid>
    );
}



