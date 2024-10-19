import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getID } from "../user.js"

export default function Layout() {
    const [userID, setUserID] = useState('')
    useEffect(()=>{
        (async () => setUserID(await getID()))()
    }, [])

    return <>
        <h1>This is the landing page</h1>

        <Link to={'/profile/:'+userID}>Link to user&apos;s profile (dont change this page for now)</Link>
        </>
}