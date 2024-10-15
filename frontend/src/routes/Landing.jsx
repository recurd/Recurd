import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import backend from "../backend"

export default function Layout() {
    const [userID, setUserID] = useState('')
    useEffect(()=>{
        (async () => {
            try {
                const res = await backend.get('/auth/status')
                setUserID(res.data.user_id)
            } catch (err) {
                // TODO: display error message
                if (err.serverResponds) {
                console.log("Server responds with status " + err.response.status)
                } else if (err.requestSent) {
                console.log("Server timed out!")
                }
            }
        })()
    }, [])

    return <>
        <h1>This is the landing page</h1>

        <Link to={'/profile/:'+userID}>Link to user&apos;s profile (dont change this page for now)</Link>
        </>
}