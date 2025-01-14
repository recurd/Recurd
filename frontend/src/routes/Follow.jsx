import { Link, useParams } from "react-router-dom";
import backend from '../backend.js';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

export default function Follow() {

    const { userId } = useParams();

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const [displayName, setDisplayName] = useState(null)

    const navigate = useNavigate()

    async function fetchFollowersFollowing() {
        try {
            const response = await backend.get(`/user/${userId}/profile`);
            const data = response.data
            setDisplayName(data.display_name)
        } catch (err) {
            console.error("Error fetching albums: ", err)
        }
    } 

    useEffect(() => {
        fetchFollowersFollowing()
    }, [userId]);

    return (
        <div className={"flex w-full h-full items-center justify-center"}>
            <div className={"flex flex-col w-[800px] h-[100vh] px-5  py-2 am-auto overflow-y-auto border-l border-r border-gray-300"}>
                <p>This page is work in progress!</p>
                <p>Showing followers/following for user: {displayName}</p>
            </div>
        </div>
        );
}