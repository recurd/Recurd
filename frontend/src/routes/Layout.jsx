import { Outlet, useNavigate } from 'react-router-dom'
import backend from '../backend.js'
// import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function Layout() {
    const navigate = useNavigate()
    async function logout() {
        try {
            await backend.post('/auth/logout')
            navigate('/login')
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
        <Outlet />
        <button type="button" onClick={logout}>Logout</button>
        {/* <Tabs>
            <TabList>
                <Tab>Profile?</Tab>
                <Tab>album page?</Tab>
                <Tab>Artist page?</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                <p>profile stuff!</p>
                </TabPanel>
                <TabPanel>
                <p>album songs!</p>
                </TabPanel>
                <TabPanel>
                <p>artist songs!</p>
                </TabPanel>
            </TabPanels>
        </Tabs> */}
    </>
}