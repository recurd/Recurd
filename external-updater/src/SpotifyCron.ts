// import { timeout } from 'cron'
import Database from './Database.js'
import { getStreamClient, getStreamPublisherRef } from './Stream.js'
import { StreamTypes } from './StreamTypes.js'
import External from 'recurd-external'
import dotenv from 'dotenv'
import { ServiceType } from '../../external/dist/src/services/Types.js'
dotenv.config()

export const cronTime = '0 0 */1 * * *' // every hour

export async function SpotifyUpdater() {
    console.log(new Date().toUTCString() + ": Starting Spotify updater...")
    // console.log(`Running again at (roughly) ${new Date(Date.now()+timeout(cronTime)).toUTCString()}`)

    const streamClient = await getStreamClient(StreamTypes.LISTENS)
    const streamPublisher = await streamClient.declarePublisher({
            stream: StreamTypes.LISTENS,
            publisherRef: getStreamPublisherRef(ServiceType.SPOTIFY),
        },
        (msg) => msg!['user_id'] // function to extract filter
    )

    // Fetch a list of users' services that connected to Spotify 
    await Database.UserService.getUserIdsByType(External.ServiceType.SPOTIFY, async batch => {
        for (const { user_id } of batch) {
            const service = await External.findService(External.ServiceType.SPOTIFY, user_id)
            if (!service) {
                console.error(`recurd-external cannot find service ${External.ServiceType.SPOTIFY, user_id} for a user when it should exist`)
                continue
            }

            const listens = await service.getRecentListens() // takes care of adding to DB

            const listenMsgs = listens.map(l => {
                return {
                    content: Buffer.from(JSON.stringify(l)),
                    applicationProperties: l.user_id
                }
            })
            if (listens.length > 0) streamPublisher.sendSubEntries(listenMsgs)

            console.log(`Added ${listens.length} listens for user ${user_id}`)
        }
    })

    await streamClient.close()
}