import { useState } from "react";
import { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import backend from "../backend.js";
import Podium from "./Podium.jsx";

export default function UserTopArtists({ user_id }) {
    const [topArtists, setTopArtists] = useState([]);

    useEffect(() => {
        async function fetchTopArtists() {
            try {
                const response = await backend.get('/user/'+user_id+'/top/artists?'+
                    new URLSearchParams({
                        n: 5
                    }))
                setTopArtists(response.data)
            } catch (err) {
                console.error("Error fetching top artists: ", err)
            }
        } 
        fetchTopArtists()
    }, []);
    
    return (
        <Grid templateColumns="repeat(5, 1fr)">
            {topArtists.length > 0 ? (
            <Podium topArtists={topArtists} />
            ) : (
            <p>No top artists available at the moment.</p>
            )}
        </Grid>
    );
}


