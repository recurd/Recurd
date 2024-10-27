import { Outlet } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'
import { isLoggedIn } from '../user'
import { useEffect, useState } from 'react'

export default function Layout() {
    const [loggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        (async () => {
            setIsLoggedIn(await isLoggedIn())
        })()
    }, [])

    return <>
        <Outlet />
        { loggedIn
            ? <LogoutButton />
            : <></> }
    </>
}