import { getUserServicesForUpdate } from 'recurd-database/userService'
import External from '../index.js'

export default async function SpotifyUpdater() {
    console.log("Starting Spotify updater...")

    // Fetch a list of users that connected to Spotify 
    await getUserServicesForUpdate(External.ServiceType.SPOTIFY, 
        function ({ user_id, access_token, refres_token, last_updated }) {
            console.log(user_id)
    })
}