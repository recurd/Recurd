import { redirect } from 'react-router-dom'
import { 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel
} from '@chakra-ui/react'
import { getID, isLoggedIn } from '../user.js'
import LoginForm from '../components/LoginForm.jsx'
import SignupForm from '../components/SignupForm.jsx'

export async function landingPageLoader({request}) {
  const loggedIn = await isLoggedIn()
  if (loggedIn)  {
      const pathTo = new URL(request.url).searchParams.get("from")
      return redirect(pathTo ?? '/profile/'+await getID()) // TODO: better redirect than this
  }
  return null
}

function Login() {

  return (
    <Tabs>
      <TabList>
        <Tab>Login</Tab>
        <Tab>Sign Up</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <LoginForm />
        </TabPanel>
        <TabPanel>
          <SignupForm />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Login;
