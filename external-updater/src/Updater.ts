import { CronJob } from 'cron'
import { SpotifyUpdater, cronTime as SpotifyCronTime } from './SpotifyCron.js'

const TIMEZONE = 'utc'

console.log(new Date().toUTCString() + ": Starting updater...")
const spotifyJob = new CronJob(
	SpotifyCronTime,
	SpotifyUpdater,
	null, // onComplete
	true, // start
	TIMEZONE, // timeZone
	undefined, // context for updater
	true // runOnInit
)