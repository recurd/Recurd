import postgres from 'postgres'
import User from './lib/User'
import UserService from './lib/UserService'
import Listen from './lib/Listen'
import Metadata from './lib/Metadata'
import Artist from './lib/Artist'
import Album from './lib/Album'
import Song from './lib/Song'

export default function db({ host, port, database, username, password }) {
    const sql = postgres({
        host,       // Postgres ip address[s] or domain name[s]
        port,       // Postgres server port[s]
        database,   // Name of database to connect to
        username,   // Username of database user
        password,   // Password of database user
        ssl: true,
        transform : {
            undefined: null
        }
    })

    // Note: None of these objects inherits from a shared superclass, even though
    // they have the same structure, because we need to hide the DB instance from the export,
    // but that is impossible with inheritance because there are no "protected" variables in js

    const metadata = new Metadata(sql)
    const listen = new Listen(sql, metadata)

    return {
        User: new User(sql),
        UserService: new UserService(sql),
        Listen: listen,
        Metadata: metadata,
        Artist: new Artist(sql),
        Album: new Album(sql),
        Song: new Song(sql)
    }
}