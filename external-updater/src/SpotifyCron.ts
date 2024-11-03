// import { timeout } from 'cron'
import Database from './Database.js'
import External from 'recurd-external'
import dotenv from 'dotenv'
dotenv.config()

export const cronTime = '0 0 */1 * * *' // every hour

export async function SpotifyUpdater() {
    console.log(new Date().toUTCString() + ": Starting Spotify updater...")
    // console.log(`Running again at (roughly) ${new Date(Date.now()+timeout(cronTime)).toUTCString()}`)

    // Fetch a list of users' services that connected to Spotify 
    await Database.UserService.getUserIdsByType(External.ServiceType.SPOTIFY, async batch => {
        for (const { user_id } of batch) {
            const service = await External.findService(External.ServiceType.SPOTIFY, user_id)
            if (!service) {
                console.error(`recurd-external cannot find service ${External.ServiceType.SPOTIFY, user_id} for a user when it should exist`)
                continue
            }
            const listens = await service.getRecentListens() // takes care of adding to DB
            console.log(`Added ${listens.length} listens for user ${user_id}`)
        }
    })
}