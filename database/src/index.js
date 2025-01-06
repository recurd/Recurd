import postgres from 'postgres'
import User from './lib/User.js'
import UserService from './lib/UserService.js'
import Listen from './lib/Listen.js'
import Metadata from './lib/Metadata.js'
import Artist from './lib/Artist.js'
import Album from './lib/Album.js'
import Song from './lib/Song.js'
import Opinion from './lib/opinion.js'

export default function db(configs) {
    // Necessary configs consists of
    // host       // Postgres ip address[s] or domain name[s]
    // port       // Postgres server port[s]
    // database   // Name of database to connect to
    // username   // Username of database user
    // password   // Password of database user
    const sql = postgres({
        ssl: true,
        connection: {
            TimeZone: 'UTC',
            DateStyle: 'ISO, YMD'
        },
        transform : {
            undefined: null
        },
        types: {
            date: {
                to: 1184,
                from: [1082, 1114, 1184], // From date, timestamp, timestampz (respectively)
                serialize: x => (x instanceof Date ? x : new Date(x)).toISOString(),
                parse: x => {
                    // Postgres output (for ISO) is:
                    // timestamp: YYYY-MM-DD HH:mm:ss
                    // timestamptz: YYYY-MM-DD HH:mm:ss(+|-)hh[:mm] (not sure if minute is ever included. Seems to always be in UTC: +00)
                    // date: YYYY-MM-DD

                    // JS interprets date string as follows:
                    // When the time zone offset is absent, date-only forms are interpreted as a UTC time and 
                    // date-time forms are interpreted as a local time.
                    // NOTE: JS expects datestring format to be:
                    // YYYY-MM-DDTHH:mm:ss.sssZ
                    // But it parses Postgres' ISO format for some reason (although this could break in the future)

                    // Check if string is in date (no space, because no time component)
                    // or timestamptz format
                    // If so, return it (parsed directly in UTC time)
                    if (!x.includes(' ') ||
                        x.match(/(\+|-)([0-9]{2}(:[0-9]{2})?)$/)) { // matches (+|-)hh[:mm]
                        return new Date(x)
                    }
                    // If timezome not present, we add it so the string is interpreted as UTC
                    return new Date(x+'+00:00')
                }
            }
        },
        ...configs
    })

    // Note: None of these objects inherits from a shared superclass, even though
    // they have the same structure, because we need to hide the DB instance from the export,
    // but that is impossible with inheritance because there are no "protected" variables in js
    return {
        User: new User(sql),
        UserService: new UserService(sql),
        Listen: new Listen(sql),
        Metadata: new Metadata(sql),
        Opinion: new Opinion(sql),
        Artist: new Artist(sql),
        Album: new Album(sql),
        Song: new Song(sql)
    }
}