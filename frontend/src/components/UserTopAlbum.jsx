import { useState } from "react";
import { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import backend from "../backend.js";
import AlbumItem from "./AlbumItem.jsx";

export default function UserTopAlbum({ user_id }) {
    const [topAlbums, setTopAlbums] = useState([]);

    useEffect(() => {
        async function fetchTopAlbums() {
            try {
                const response = await backend.get('/user/'+user_id+'/top/albums?'+
                    new URLSearchParams({
                        n: 10
                    }))
                setTopAlbums(response.data)
            } catch (err) {
                console.error("Error fetching top albums: ", err)
            }
        } 
        fetchTopAlbums()
    }, []);
    //change to component
    return (
        <Grid templateColumns="repeat(5, 1fr)">
            {topAlbums.length > 0 ? (
                topAlbums.map(album => (
                    <GridItem key={album.id} colSpan="1">
                        <AlbumItem album={album} /> 
                    </GridItem>
                ))
            ) : (
            <p>No top albums available at the moment.</p>
            )}
        </Grid>
    );
}



