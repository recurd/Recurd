import { Outlet } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'
import { isLoggedIn } from '../user'
import { useEffect, useState } from 'react'
import GlobalErrorBoundary from '../components/GlobalErrorBoundary.jsx'

export default function Layout() {
    const [loggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        (async () => {
            setIsLoggedIn(await isLoggedIn())
        })()
    }, [])

    return <>
        <GlobalErrorBoundary>
        <Outlet />
        { loggedIn
            ? <LogoutButton />
            : <></> }
        </GlobalErrorBoundary>
    </>
}