export interface ServiceFactory<ServiceType extends Service> {
    // For when the user is not yet connected to the service
    // Note that the user_id is Recurd's user id
    fromExternal(user_id: string, payload: any) : Promise<ServiceType>

    // For when the user has connected to the service
    fromDatabase(user_id: string) : Promise<ServiceType | undefined>
}

export interface Service {
    user_id: string

    // Fetches the currently listening track from the service, and stores its metadata in the database
    getCurrentlyListening(): Promise<{ track: any, is_paused?: boolean }>

    // Fetches the recent listens from the service, and stores its metadata alongside the listens in the database
    getRecentListens(): Promise<any[]>
}

export enum ServiceType {
    SPOTIFY = 'spotify'
}