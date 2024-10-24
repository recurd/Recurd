import dotenv from 'dotenv'
dotenv.config({ path:'../../../.env', debug:true })
import { CronJob } from 'cron'
import SpotifyUpdater from './SpotifyUpdater.js'

console.log("Starting updater cron jobs...")
const spotifyJob = new CronJob(
	// '* */1 * * *', // every hour
    '* * * * * *',
	SpotifyUpdater,
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
)