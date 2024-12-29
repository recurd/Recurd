import { Link, useParams } from "react-router-dom";
import backend from '../backend.js';
import { useState, useEffect } from "react";

export default function SearchResults() {

    const { query } = useParams();

    const [albumResults, setAlbumResults] = useState([]);
    const [artistResults, setArtistResults] = useState([]);
    const [songResults, setSongResults] = useState([]);

    async function fetchAlbumResults() {
        try {
            const response = await backend.get('/album/search/', {
                params: { query }
            });
            setAlbumResults(response.data)
        } catch (err) {
            console.error("Error fetching albums: ", err)
        }
    } 

    async function fetchArtistResults() {
        try {
            const response = await backend.get('/artist/search/', {
                params: { query }
            });
            setArtistResults(response.data)
        } catch (err) {
            console.error("Error fetching artists: ", err)
        }
    } 

    async function fetchSongResults() {
        try {
            const response = await backend.get('/song/search/', {
                params: { query }
            });
            setSongResults(response.data)
        } catch (err) {
            console.error("Error fetching songs: ", err)
        }
    } 

    useEffect(() => {
        fetchAlbumResults()
        fetchArtistResults()
        fetchSongResults()
    }, [query]);

    return (
        <div className={"flex w-full h-full items-center justify-center"}>
            <div className={"flex flex-col w-[800px] h-[100vh] px-5  py-2 am-auto overflow-y-auto border-l border-r border-gray-300"}>
                <h2 className={"text-[150%]"}>Search Results for "{query}"</h2>
                <h1 className={"ml-5 text-[120%]"}>Albums</h1>
                <div className={"pl-10 text-[110%] w-full border-b"}>{ albumResults.length > 0 ? albumResults.map(a =>
                    <div>
                    <Link to={`/album/${a.id}`} className={"transition duration-[200] hover:opacity-70"}>{a.name}</Link>
                    <br/>
                    </div>
                ) : "No albums found"}
                </div>
                <h1 className={"ml-5 text-[120%]"}>Artists</h1>
                <div className={"pl-10 text-[110%] w-full border-b"}>{ artistResults.length > 0 ? artistResults.map(a =>
                    <div>
                    <Link to={`/artist/${a.id}`} className={"transition duration-[200] hover:opacity-70"}>{a.name}</Link>
                    <br/>
                    </div>
                ) : "No artists found"}
                </div>
                <h1 className={"ml-5 text-[120%]"}>Songs</h1>
                <div className={"pl-10 text-[110%] w-full border-b"}>{ songResults.length > 0 ? songResults.map(a =>
                    <div>
                    <Link to={`/song/${a.id}`} className={"transition duration-[200] hover:opacity-70"}>{a.name}</Link>
                    <br/>
                    </div>
                ) : "No songs found"}
                </div>
            </div>
        </div>
        );
}