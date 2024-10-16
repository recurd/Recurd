import { useSearchParams } from "react-router-dom"
import { Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { isServiceConnected } from '../services'

export default function ConnectServiceButton({ redirectURL, serviceType, serviceName, icon }) {
    // When user presses connect, we redirect them to the service.
    // Then when the service redirects back, it goes to the service loader
    // Which interprets the response, notifies the backend, and redirects the user here
    // With search params indicating success/failure
    const [loading, setLoading] = useState(true)
    const [connected, setConnected] = useState(false)
    const [searchParams] = useSearchParams()
    useEffect(() => {
        (async () => {
            const conned = await isServiceConnected(serviceType)
            setConnected(conned)
            setLoading(false)
        })()

        // If this button is rendered on redirect back, we will notify the user of the error, if any
        if (searchParams.get("success") === "false") {
            // TODO: better display
            window.alert(`Connecting to ${searchParams.get("service_type")} failed with message: ${searchParams.get("message")}`)
        }
    }, [])

    function redirectToURL() {
        window.location.replace(redirectURL)
    }

    if (connected)
        return <Button 
                    colorScheme='green' 
                    size='md' 
                    leftIcon={icon}
                    isDisabled
                    isLoading={loading}
                    loadingText='Loading'>{serviceName} connected</Button>
    else
        return <Button 
                    onClick={redirectToURL} 
                    colorScheme='green' 
                    size='md' 
                    leftIcon={icon}
                    isLoading={loading}
                    loadingText='Loading'>Connect to {serviceName}</Button>
}