import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom"
import './assets/css/index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { redirect } from 'react-router-dom'
import Layout from './routes/Layout'
import Landing, { landingPageLoader } from './routes/Landing.jsx'
import Artist from './routes/Artist.jsx'
import Album from './routes/Album.jsx'
import Song from './routes/Song.jsx'
import Profile from './routes/Profile.jsx'
import Review from './routes/Review.jsx'
import Settings from './routes/Settings.jsx'
import NavBar from './components/Navbar.jsx'
import { isLoggedIn } from './user.js'
import { servicesCallbackPath, spotifyRedirLoader } from './services.js'
import './assets/css/index.css';
import SearchResults from './routes/SearchResults.jsx'

// Redirects to login page if user is not logged in
export async function authGateLoader({request}) {
  const loggedIn = await isLoggedIn()
  if (!loggedIn) {
      let params = new URLSearchParams()
      params.set("from", new URL(request.url).pathname)
      return redirect("/login?" + params.toString())
  }
  return null
}

const router = createBrowserRouter([{
    path: "/",
    element: <Layout/>,
    children: [{
      index: true,
      element: <Landing />,
      loader: landingPageLoader,
    }, {
      path: "settings",
      element: <Settings />,
      loader: authGateLoader
    }, {
      path: "profile/:id",
      element: <><NavBar/><Profile/></>
    }, {
      path: "review/:id",
      element: <Review />
    }, {
      path: "artist/:id",
      element: <><NavBar/><Artist/></>
    }, {
      path: "album/:id",
      element: <><NavBar/><Album/></>
    }, {
      path: "song/:id",
      element: <><NavBar/><Song/></>
    }, {
      path: "search/:query",
      element: <><NavBar/><SearchResults/></>
    }],
}, {
  path: servicesCallbackPath.SPOTIFY,
  loader: spotifyRedirLoader
}])

createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
  </ChakraProvider>
)