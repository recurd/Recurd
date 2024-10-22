import { useState } from 'react'
import { 
  Input,
  FormControl,
  FormLabel,
  Button
 } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import backend from '../backend.js'; 

export default function SignupForm() {
    const [username, setUsername] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    async function handleSignup() {
        try {
            await backend.post('/account/create/password', {
                username: username,
                display_name: displayName,
                password: password
            })

            // log in
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
        <FormControl>
            <FormLabel>Display Name</FormLabel>
            <Input  
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
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
        <Button onClick={()=>handleSignup()}>Sign up</Button>
    </>
}