import { ErrorBoundary } from "react-error-boundary"
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

function logError(error, { componentStack }) {
    // console.error('Error occurred: ', error)
    // console.error('Component stack: ', componentStack)
}

function Fallback({ error, resetErrorBoundary }) {
    const toast = useToast()

    // Handle axios error
    // this is bad code, bad coupling!! too lazy to fix rn
    let msg = null
    let errorDesc = null
    if (error?.response) {
        msg = error.response.data.message ?? error.response.statusText
        errorDesc = JSON.stringify(error.response.data?.error)
    }
    msg = msg ?? error?.message ?? 'Unknown error'

    useEffect(() => {
        toast({
            title: 'Error: ' + msg,
            description: errorDesc,
            status: 'error',
            duration: 15000,
            isClosable: true,
        })
    }, [])
    return <></>
}

export default function GlobalErrorBoundary({ children }) {
    return <ErrorBoundary 
                FallbackComponent={Fallback}
                onError={logError}>
        { children }
    </ErrorBoundary>
}