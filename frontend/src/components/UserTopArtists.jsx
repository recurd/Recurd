import { useState } from "react";
import { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import backend from "../backend.js";

export default function UserTopArtists({ user_id }) {
    const [topArtists, setTopArtists] = useState([]);

    
    return (
        <Grid templateColumns="repeat(5, 1fr)">
            {topArtists.length > 0 ? (
            <p>something here</p>
            ) : (
            <p>No top artists available at the moment.</p>
            )}
        </Grid>
    );
}


