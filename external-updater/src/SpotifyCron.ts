// import { timeout } from 'cron'
import Database from './Database.js'
import { getStreamClient, getStreamPublisherRef, StreamTypes } from './Stream.js'
import { findService, ServiceType, FetchError } from 'recurd-external'
import dotenv from 'dotenv'
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
        // Each listens stream message can be filtered by the user_id of the user listening
        (msg) => msg.applicationProperties!['user_id'].toString() // function to extract filter
    )

    // Fetch a list of users' services that connected to Spotify 
    await Database.UserService.getUserIdsByType(ServiceType.SPOTIFY, async batch => {
        for (const { user_id } of batch) {
            const service = await findService(ServiceType.SPOTIFY, user_id)
            if (!service) {
                console.error(`recurd-external cannot find service ${ServiceType.SPOTIFY, user_id} for a user when it should exist`)
                continue
            }

            try {
                const listens = await service.getRecentListens() // takes care of adding to DB

                const listenMsgs = listens.map(l => {
                    return {
                        content: Buffer.from(JSON.stringify(l)),
                        // attach user's user_id for filtering of stream messages
                        applicationProperties: {
                            user_id: l.user_id
                        }
                    }
                })
                if (listens.length > 0) streamPublisher.sendSubEntries(listenMsgs)

                console.log(`Added ${listens.length} listens for user ${user_id}`)
            } catch (e) {
                console.error(`Error: SPOTIFY - User ${user_id}, ` + (e as Error).message)
                if (e instanceof FetchError) {
                    console.error(await e.getBody())
                }
            }
        }
    })
}