import { useState } from "react";
import { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import backend from "../backend.js";
import Podium from "./Podium.jsx";

export default function UserTopArtists({ user_id }) {
    const [topArtists, setTopArtists] = useState(["Kanye West","Kanye West","Kanye West","Kanye West","Kanye West"]);
    
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


