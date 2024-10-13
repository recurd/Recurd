import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from "react-router-dom";
import './assets/css/index.css'
import Layout from './routes/Layout';
import { ChakraProvider } from '@chakra-ui/react'
import Login from './routes/Login';
import backend from './backend.js';

async function isLoggedIn() {
  try {
    const res = await backend.get('/auth/status')
    return res.data.loggedIn
  } catch (err) {
    // TODO: display error message
    if (err.serverResponds) {
      console.log("Server responds with status " + err.response.status)
    } else if (err.requestSent) {
      console.log("Server timed out!")
    }
  }
}

// Redirects to login page if user is not logged in
async function authGateLoader({request}) {
  const loggedIn = await isLoggedIn()
  if (!loggedIn) {
      let params = new URLSearchParams()
      params.set("from", new URL(request.url).pathname)
      return redirect("/login?" + params.toString())
  }
  return null
}

async function loginPageLoader({request}) {
  const loggedIn = await isLoggedIn()
  if (loggedIn)  {
    const pathTo = new URL(request.url).searchParams.get("from")
    print(pathTo)
    return redirect(pathTo ?? '/')
  }
  return null
}

const router = createBrowserRouter([{
    path: "/",
    element: <Layout/>,
    children: [{
      index: true,
      element: <h2>Test 1</h2>,
      loader: authGateLoader,
    }, {
      path: "login",
      element: <Login/>,
      loader: loginPageLoader
    }, {
      path: "test",
      element: <p>abc</p>,
      loader: authGateLoader
    }]
}])

createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ChakraProvider>
)