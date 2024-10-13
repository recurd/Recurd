import { Outlet } from 'react-router-dom'
// import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function Layout() {
    return <>
        <Outlet />
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