import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './assets/css/index.css'
import Layout from './routes/Layout';
import { ChakraProvider } from '@chakra-ui/react'

const router = createBrowserRouter([{
    path: "/",
    element: <Layout/>,
    children: [{
      path: "test1",
      element: <h2>Test 1</h2>
    }, {
      path: "test2",
      element: <h2>Test 2</h2>
    }]
}])

createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ChakraProvider>
)