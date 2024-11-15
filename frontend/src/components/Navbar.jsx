// Navbar.jsx
import { React } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import Search from './Search';
import logo from '../assets/image/RecurdLogo.png';
import { Link } from 'react-router-dom';

const Links = ['Album', 'Artist', 'Profile'];

const NavLink = ({ children }) => (
  <Box
    as="a"
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Box>
);

function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={`bg-navbar shadow-md w-full sticky flex top-0 z-10 h-[49px] items-center text-[35px]`}>
      {/* Upper-left project title */}
      <Link to='/' className={`w-full h-full`}>
        <img src={logo} className={`pl-[10px] pt-[5px] h-full w-auto`}/>
      </Link>
      {/* Div for search and menu buttons */}
      <div className={`ml-auto pr-[9px] w-full h-full flex gap-x-[4px] items-center justify-end`}>
        <Search/>
        <button className={`w-[41px] h-[41px]`}>
          {/* Menu stack svg */}
          <svg className={`transition duration-100 text-white`} width="41" height="41" viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.125 30.75V27.3333H35.875V30.75H5.125ZM5.125 22.2083V18.7917H35.875V22.2083H5.125ZM5.125 13.6667V10.25H35.875V13.6667H5.125Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          aria-label={'Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box>Recurd</Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuList>
              <MenuItem>PossibleLink</MenuItem>
              <MenuItem>PossibleLink</MenuItem>
              <MenuItem>PossibleLink</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'navbar'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

export default NavBar;
