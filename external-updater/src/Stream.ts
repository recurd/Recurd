import rabbit from 'rabbitmq-stream-js-client'
import dotenv from "dotenv"
dotenv.config()

export enum StreamTypes {
    LISTENS = 'listens'
}

export async function getStreamClient(streamName : string) : Promise<rabbit.Client> {
    const client = await rabbit.connect({
        hostname: process.env.RABBIT_HOST!,
        port: Number.parseInt(process.env.RABBIT_PORT!),
        username: process.env.RABBIT_USERNAME!,
        password: process.env.RABBIT_PASSWORD!,
        vhost: process.env.RABBIT_VHOST!,
        // ssl: {
        //     key: "<client_private_key>",
        //     cert: "<client_certificate>",
        //     ca: "<ca>", // Optional
        // },
    })

    const streamSizeRetention = 5 * 1e9
    await client.createStream({
        stream: streamName,
        arguments: {
            'max-length-bytes': streamSizeRetention,
            'max-age': '1D' // any message in stream has an age of 1 day
        }
    })

    return client
}

export function getStreamPublisherRef(type : string) : string {
    return `${type}-publisher-${new Date().toISOString()}`
}