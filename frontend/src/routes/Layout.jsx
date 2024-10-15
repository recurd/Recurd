import { Outlet } from 'react-router-dom'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import RecentListens from '../components/RecentListens'

export default function Layout() {
    return <>
        <Tabs>
            <TabList>
                <Tab>Profile?</Tab>
                <Tab>album page?</Tab>
                <Tab>Artist page?</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                <p>profile stuff!</p>
                <RecentListens/>
                </TabPanel>
                <TabPanel>
                <p>album songs!</p>
                </TabPanel>
                <TabPanel>
                <p>artist songs!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </>
}