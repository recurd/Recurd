import { Outlet } from 'react-router-dom'
import LogoutButton from '../components/LogoutButton'

export default function Layout() {
    return <>
        <Outlet />
        <LogoutButton />
    </>
}