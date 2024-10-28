import { useState } from "react";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
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
        <Box>
            {topAlbums.length > 0 ? (
                topAlbums.map(album => (
                    <AlbumItem key={album.id} album={album} /> // Rendering AlbumItem for each album
                ))
            ) : (
            <p>No top albums available at the moment.</p>
            )}
        </Box>
    );
}



