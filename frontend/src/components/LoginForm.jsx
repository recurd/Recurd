import { useState } from 'react'
import { 
    Button,
    Input,
    FormControl,
    FormLabel
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useErrorBoundary } from "react-error-boundary"
import backend from '../backend.js'

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { showBoundary } = useErrorBoundary()
    const navigate = useNavigate()

    async function handleLogin() {
        try {
            await backend.post('/auth/password', {
                username: username,
                password: password
            })

            // Get url params for path to redirect back to
            const url = new URL(window.location.href)
            const redirPath = url.searchParams.get("from") ?? '/' // default to main page
            navigate(redirPath)
        } catch (err) {
            // TODO: display error message
            if (err.serverResponds) {
                console.log("Server responds with status " + err.response.status)
            } else if (err.requestSent) {
                console.log("Server timed out!")
            }
            showBoundary(err)
        }
    }

    return <>
        <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input  
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required/>
        </FormControl>
        <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input  
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required />
        </FormControl>
        <Button onClick={()=>handleLogin()}>Login</Button>
    </>
}