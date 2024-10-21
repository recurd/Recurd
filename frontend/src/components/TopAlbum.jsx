import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import backend from "../backend.js";
import Histogram from './Histogram.jsx';
import AlbumItem from "./AlbumItem.jsx";

export default function TopAlbum() {
    const [topAlbums, setTopAlbums] = useState([]);
    
    useEffect(() => {
        async function fetchTopAlbums() {
            try {
                const response = await backend.get('placeholder'); 
                setTopAlbums(response.data);
            } catch (err) {
                console.error("Error fetching top albums: ", err)
            }
        } 
        fetchTopAlbums();
    }, []);
    //change to component
    return (
        <div>
            <h3>Top Albums</h3>
            <Histogram />
            <div>
                {topAlbums.length > 0 ? (
                    topAlbums.map((album, index) => (
                        <AlbumItem key={index} album={album} /> // Rendering AlbumItem for each album
                    ))
                ) : (
                <p>No top albums available at the moment.</p>
                )}
            </div>
        </div>
    );
}



