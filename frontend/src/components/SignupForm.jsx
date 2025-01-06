import { useState, useEffect } from 'react'
import {
    Text,
    Box,
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

    const [errorText, setErrorText] = useState('')

    const [buttonDisabled, setButtonDisabled] = useState(true)

    const navigate = useNavigate()

    useEffect (() =>
        {
            // TODO: Should displayName need to be non-empty?
            setButtonDisabled(username.length == 0 || password.length == 0)
        }, [username, password, displayName]);

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
            setErrorText(err.response.data.message)
        }
    }

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
            <Button 
                    className={"mt-4 w-full"}
                    isDisabled={buttonDisabled}
                    colorScheme={buttonDisabled ? 'gray' : 'blue'}
                    onClick={()=>handleSignup()}>Sign Up
            </Button>
            <Text className={"mt-2"} color="red.500" fontSize="md">{errorText}</Text>
        </Box>
    </>
}