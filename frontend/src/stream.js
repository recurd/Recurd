import rabbit from 'rabbitmq-stream-js-client'

export async function createStream(streamName, onMessage, streamOptions={}) {
    const client = await rabbit.connect({
        hostname: "localhost",
        port: 5552,
        username: "guest",
        password: "guest",
        vhost: "/",
    })
    const streamSizeRetention = 5 * 1e9
    await client.createStream({ stream: streamName, arguments: { "max-length-bytes": streamSizeRetention } });
    await client.declareConsumer({ 
        stream: streamName,
        offest: rabbit.Offset.last(),
        ...streamOptions
    }, onMessage)
}