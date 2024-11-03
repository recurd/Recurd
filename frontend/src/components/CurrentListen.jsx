import { useEffect, useState } from "react"
import { Box, Icon, Image, Text } from "@chakra-ui/react"
import { FaPause } from "react-icons/fa6";
import { Link } from "react-router-dom"
import backend from "../backend"
import { FallbackSongImage } from "./FallbackImages"
import SoundBarsAnim from "./SoundBarsAnim"

export default function CurrentListen({ user_id }) {
    const [song, setSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    async function fetchCurrentListenPeriodic(timeToEnd) {
        setTimeout(async () => {
            try {
                const back = await backend.get('user/'+user_id+'/currently-listening')
                const result = back.data
                setSong(result.track)
                console.log(result)

                // If no currently playing song, then fetch again in 5 minutes
                // else, fetch song when it is done playing, with a delay of 5 seconds

                let newTimeToEnd = 300000 // 5 minutes
                if (result.track) {
                    setIsPlaying(!result.is_paused)

                    newTimeToEnd = result.duration - result.progress + 5000 // + 5 seconds
                    // in case that song is paused near the end, we rate limit the request to every 2 minutes
                    if (result.is_paused) {
                        newTimeToEnd = Math.max(newTimeToEnd, 120000)
                    }
                }
                console.log(newTimeToEnd)
                fetchCurrentListenPeriodic(newTimeToEnd) // no await
            } catch (err) {
                // TODO: display error message
                if (err.serverResponds) {
                    console.log("Server responds with status " + err.response.status)
                } else if (err.requestSent) {
                    console.log("Server timed out!")
                }
            }
        }, timeToEnd)
    }

    useEffect(() => {
        (async () => {
            await fetchCurrentListenPeriodic()
        })()
    }, [])

    if (!song) 
        return <Box width='20rem' margin='0.5rem'>
                No currently playing song.
            </Box>
    return <Box width='20rem' margin='0.5rem'>
            <Box display='inline-block'
                width='20%'
                height='100%'
                verticalAlign='middle'
                position='relative'>
                <Link to={"/song/"+song.id}>
                    { song.album?.image ? 
                        <Image src={song.album.image} opacity='0.7'/>
                        : <FallbackSongImage /> }
                    { isPlaying ? 
                        <SoundBarsAnim 
                            width='calc(100% / 3)' // center anim inside the box
                            position='absolute'
                            top='calc(100%/3)'
                            left='calc(100%/3)'
                            />
                         : <Icon
                                as={FaPause}
                                w='calc(100%/3)'
                                h='calc(100%/3)'
                                position='absolute'
                                top='calc(100%/3)'
                                left='calc(100%/3)'
                                /> }
                </Link>
            </Box>
            <Box display='inline-block'
                width='75%'
                height='100%'
                marginLeft='0.7rem'
                verticalAlign='middle'>
                <Link to={"/song/"+song.id}>
                    <Text textStyle='5xl' fontWeight='bold' isTruncated>{ song.name }</Text>
                </Link>
                <Text isTruncated>
                    { song.artists.map((a,idx,arr) => {
                        return <span key={a.id}>
                            <Link to={"/artist/"+a.id}>{a.name}</Link>
                            { (idx != arr.length -1) ? ', ' : '' }
                        </span>
                    })}
                </Text>
            </Box>
        </Box>
}