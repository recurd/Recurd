import { FaSpotify } from "react-icons/fa"
import { servicesCallbackPath } from "../services"
import ConnectServiceButton from "./ServiceConnectButton"

export default function ConnectSpotifyButton() {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: import.meta.env.VITE_SPOTIFY_SCOPE,
        redirect_uri: window.location.origin+servicesCallbackPath.SPOTIFY
    })

    const redirectURL = 'https://accounts.spotify.com/authorize?'+params.toString()
    return <ConnectServiceButton 
                redirectURL={redirectURL}
                serviceType={'spotify'}
                serviceName={'Spotify'}
                icon={<FaSpotify/>}/>
}