import { Outlet } from 'react-router-dom'
import { useState } from 'react'

export default function TestSub() {
    const [name, setName] = useState("abc")

    setName("def")
    return <>
        <h1>Hello World { name }</h1>
        <Outlet/>
    </>
}