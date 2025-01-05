import { Box, Image } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function ListenerItem({listener}){

    const [hovered, setHovered] = useState(false);

    return (
        <Box cursor="pointer" className={"relative w-full aspect-square p-2"} 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
            <Image src={listener.image} alt={listener.display_name} className={"aspect-square shadow-md"} objectFit="cover"/>
                    {/* Gradient overlay - visible on hover */}
                    <Box
                        className={`absolute bottom-2 left-2 right-2 h-[50%] bg-gradient-to-t from-black to-transparent transition-opacity duration-100 ${hovered ? 'opacity-70' : 'opacity-0'}`}
                    />
                    <Box
                        className={`absolute h-[50%] left-2 right-2 top-2 bg-gradient-to-t from-transparent to-black transition-opacity duration-100 ${hovered ? 'opacity-70' : 'opacity-0'}`}
                    />

                    {/* Tooltip - visible on hover */}
                    <Box
                        className={`absolute bottom-0 left-0 w-full h-full text-white text-sm p-[10px] transition-opacity duration-100 ${hovered ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <p className={"absolute h-full left-[14px] right-[14px] top-[14px] truncate text-[130%]"}>
                            {listener.display_name}
                        </p>
                        <br/>
                        <p className={"absolute bottom-[14px] right-[14px] truncate text-[120%]"}>
                            {listener.listen_count}
                        </p>
                </Box>
        </Box>
    );
}
