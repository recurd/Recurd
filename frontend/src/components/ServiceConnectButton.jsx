import { Button, ButtonGroup, Tooltip } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { disconnectSpotify, isServiceConnected } from '../services'

export default function ConnectServiceButton({ redirectURL, serviceType, serviceName, icon }) {
    const [loading, setLoading] = useState(true)
    const [connected, setConnected] = useState(false)
    useEffect(() => {
        (async () => {
            const conned = await isServiceConnected(serviceType)
            setConnected(conned)
            setLoading(false)
        })()
    }, [])

    function redirectToURL() {
        window.location.assign(redirectURL)
    }

    if (connected)
        return <ButtonGroup size='md' isAttached>
                <Button 
                    colorScheme='green' 
                    leftIcon={icon}
                    isDisabled
                    isLoading={loading}
                    loadingText='Loading'>{serviceName} connected</Button>
            {loading ?
                <></> : 
                <Button
                    onClick={async () => {
                        const { success } = await disconnectSpotify()
                        setConnected(!success)
                    }}
                    colorScheme='red'
                    variant='outline'>Disconnect</Button>}
        </ButtonGroup>
    else
        return <div>
            <Tooltip hasArrow label={'Redirect to Spotify'}>
                <Button 
                    onClick={redirectToURL} 
                    colorScheme='green' 
                    size='md' 
                    leftIcon={icon}
                    isLoading={loading}
                    loadingText='Loading'>Connect to {serviceName}</Button>
            </Tooltip>
        </div>
}