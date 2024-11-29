import rabbit from 'rabbitmq-stream-js-client'

export const streamType = Object.freeze({
    LISTENS: {
        name: "listens",
        getMessageFilter: (msg) => msg.applicationProperties['user_id'].toString()
    }
})

export async function createStreamConsumer(streamType, onMessage, streamOptions={}) {
    const client = await rabbit.connect({
        hostname: import.meta.env.VITE_RABBIT_HOST,
        port: Number.parseInt(import.meta.env.VOTE_RABBIT_PORT),
        username: import.meta.env.VITE_RABBIT_USERNAME,
        password: import.meta.env.VITE_RABBIT_PASSWORD,
        vhost: import.meta.env.VITE_RABBIT_VHOST
    })
    const streamSizeRetention = 5 * 1e9
    await client.createStream({ stream: streamType.name, arguments: { "max-length-bytes": streamSizeRetention } });

    const consumerOpt = { 
        stream: streamType.name,
        offest: rabbit.Offset.last(),
        ...streamOptions
    }

    // Add filter logic (check if any of the values is present in the filter)
    // filter logic is needed on client side because of RabbitMQ's use of Bloom filters (probabalistic)
    if (consumerOpt?.filter?.values && !consumerOpt?.filter?.postFilterFunc) {
        consumerOpt.filter.postFilterFunc = (msg) => consumerOpt.filter.values.includes(streamType.getMessageFilter(msg))
    }
    if (consumerOpt?.filter && consumerOpt.filter.matchUnfiltered === undefined) {
        consumerOpt.filter.matchUnfiltered = true
    }

    return await client.declareConsumer(consumerOpt, onMessage)
}