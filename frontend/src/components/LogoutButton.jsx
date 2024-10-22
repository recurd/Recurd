import { useNavigate } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import { useErrorBoundary } from "react-error-boundary"
import backend from '../backend.js'

export default function LogoutButton() {
    const navigate = useNavigate()
    const { showBoundary } = useErrorBoundary()
    async function logout() {
        try {
            await backend.post('/auth/logout')
            navigate('/')
          } catch (err) {
            showBoundary(err)
          }
    }

    return <Button type="button" onClick={logout}>Logout</Button>
}