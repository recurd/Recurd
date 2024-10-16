import { FaSpotify } from "react-icons/fa"
import { servicesCallbackPath } from "../services"
import ConnectServiceButton from "./ServiceConnectButton"

export default function ConnectSpotifyButton() {
    const scope = 'user-read-playback-state user-read-currently-playing user-read-recently-played'
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: window.location.origin+servicesCallbackPath.SPOTIFY,
        // state: ??
    })

    const redirectURL = 'https://accounts.spotify.com/authorize?'+params.toString()
    return <ConnectServiceButton 
                redirectURL={redirectURL}
                serviceType={'spotify'}
                serviceName={'Spotify'}
                icon={<FaSpotify/>}/>
}