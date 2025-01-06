import { useEffect, useState } from 'react'
import { 
    Text,
    Box,
    Button,
    Input,
    FormControl,
    FormLabel
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import backend from '../backend.js'

export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorText, setErrorText] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(true)
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
                setErrorText(err.response.data.message)
            } else if (err.requestSent) {
                console.log("Server timed out!")
                setErrorText("Server timed out!")
            }
        }
    }

    useEffect (() =>
    {
        setButtonDisabled(username.length == 0 || password.length == 0)
    }, [username, password]);

    return <>
        <Box className={"flex-col items-center m-auto w-[500px]"}>
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
            <Button 
                className={"mt-4 w-full"}
                isDisabled={buttonDisabled}
                colorScheme={buttonDisabled ? 'gray' : 'blue'}
                onClick={()=>handleLogin()}>Login
            </Button>
            <Text className={"mt-2"} color="red.500" fontSize="md">{errorText}</Text>
        </Box>
    </>
}