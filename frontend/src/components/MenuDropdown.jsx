import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getID, isLoggedIn } from '../user.js'
import {
    Text,
    Box,
    Input,
    FormControl,
    FormLabel,
    Button
 } from '@chakra-ui/react'
import backend from "../backend";

function MenuDropdown() {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);

    const navigate = useNavigate();

    async function onClickProfile() {
        try {
            var id = await getID()
            navigate('/profile/' + id)
            setDropdownOpen(false)
        } catch(err) {
            showBoundary(err)
        }
    };

    async function onClickLogout() {
        try {
            await backend.post('/auth/logout')
            navigate('/')
            setDropdownOpen(false)
        } catch (err) {
            showBoundary(err)
        }
    };

    return (
        <div className={`flex justify-end items-center transition-all rounded-full max-w-[41px] h-[41px]`}>
            <button onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)} onMouseUp={() => { setDropdownOpen(!dropdownOpen) }} className={`h-full aspect-square transition-all duration-100`}>
                {/* Menu stack svg */}
                <svg className={`transition-all duration-100 transform rounded-full ${(buttonHover || dropdownOpen) ? "scale-[90%] text-[#1D1B20] bg-white" : "text-white"}`} viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.125 30.75V27.3333H35.875V30.75H5.125ZM5.125 22.2083V18.7917H35.875V22.2083H5.125ZM5.125 13.6667V10.25H35.875V13.6667H5.125Z" fill="currentColor"/>
                </svg>
            </button>
            

            <Box position="absolute" top="45px" w="200px" h="80px" overflow="hidden">
      {/* Profile Button */}
      <Box
        position="absolute"
        top="0px"
        right="0"
        transform={dropdownOpen ? "translateY(0%)" : "translateY(-200%)"}
        transition="transform 0.5s"
        w="200px"
        h="40px"
        bg="white"
        border="2px solid"
        borderColor="gray.200"
      >
        <Button
          onClick={onClickProfile}
          w="full"
          h="full"
          textAlign="left"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          pl="5px"
          fontSize="50%"
          color="gray.600"
          _hover={{ color: "gray.400" }}
          variant="unstyled"
          cursor="pointer"
        >
          My Profile
        </Button>
      </Box>

      {/* Logout Button */}
      <Box
        position="absolute"
        top="38px"
        right="0"
        transform={dropdownOpen ? "translateY(0%)" : "translateY(-200%)"}
        transition="transform 0.5s"
        w="200px"
        h="40px"
        bg="white"
        border="2px solid"
        borderColor="gray.200"
        borderBottomRadius="md"
      >
        <Button
          onClick={onClickLogout}
          w="full"
          h="full"
          textAlign="left"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          pl="5px"
          fontSize="50%"
          color="gray.600"
          _hover={{ color: "gray.400" }}
          variant="unstyled"
          cursor="pointer"
        >
          Logout
        </Button>
      </Box>
    </Box>

            {/* <div className={`absolute top-[45px] w-[200px] h-[80px] overflow-hidden `}>
                <div className={`flex absolute top-[0px] transition-transform duration-500 right-0 ${dropdownOpen ? "translate-y-[0%]" : "translate-y-[-200%]"} w-[200px] h-[40px] bg-white border-2`}>
                    <button onClick={onClickProfile} className={`m-0 p-0 w-full h-full text-left flex items-center pl-[5px] text-[70%] text-gray-600 hover:text-gray-400 cursor-pointer`}>My Profile</button>
                </div>
                <div className={`flex absolute top-[38px] transition-transform duration-500 right-0 ${dropdownOpen ? "translate-y-[0%]" : "translate-y-[-200%]"} right-0 w-[200px] h-[40px] bg-white border-2`}>
                    <button onClick={onClickLogout} className={`m-0 p-0 w-full h-full text-left flex items-center pl-[5px] text-[70%] text-gray-600 hover:text-gray-400 cursor-pointer`}>Logout</button>
                </div>
            </div> */}
        </div>
    );
}

export default MenuDropdown;