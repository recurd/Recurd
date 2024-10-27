import { SpotifyServiceFactory } from "./services/SpotifyService.js"
import { Service, ServiceType } from "./services/Types.js"

// Handles creating different types of service objects
const ServiceFactories = {
    [ServiceType.SPOTIFY]: new SpotifyServiceFactory()
}

// Call this function if the user is not yet connected to the service
async function connectService(service_type: ServiceType, user_id: string, payload: any) : Promise<Service> {
    if (!(service_type in ServiceFactories)) {
        return Promise.reject('Unknown service type')
    }
    const factory = ServiceFactories[service_type]
    return factory.fromExternal(user_id, payload)
}

// Call this function if the user has connected to the service
async function findService(service_type: ServiceType, user_id: string) : Promise<Service | undefined> {
    if (!(service_type in ServiceFactories)) {
        return undefined
    }
    const factory = ServiceFactories[service_type]
    return factory.fromDatabase(user_id)
}

export default {
    connectService,
    findService
}