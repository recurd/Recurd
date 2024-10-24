import { useNavigate } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import backend from '../backend.js'

export default function LogoutButton() {
    const navigate = useNavigate()
    async function logout() {
        try {
            await backend.post('/auth/logout')
            navigate('/')
          } catch (err) {
            // TODO: display error message
            if (err.serverResponds) {
              console.log("Server responds with status " + err.response.status)
            } else if (err.requestSent) {
              console.log("Server timed out!")
            }
          }
    }

    return <Button type="button" onClick={logout}>Logout</Button>
}