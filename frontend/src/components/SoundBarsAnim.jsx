import css from '../assets/css/components/SoundBarsAnim.module.css'
import { Box } from "@chakra-ui/react"

export default function SoundBarsAnim({color = 'black', ...props}) {
    const barCss = {
        width: 'calc(100% / 4)', // 1.5rem / 3
        height: '100%',
        backgroundColor: color,
        borderRadius: '3px',
        content: '',
        transformOrigin: 'bottom' // make animation transform from the bottom
    }

    return <Box position='relative'
                display='flex'
                justifyContent='space-between'
                width='1rem'
                aspectRatio='1'
                {...props}
                >
            <Box {...barCss} animation={`${css['bounce']} 2.2s ease infinite alternate`}></Box>
            <Box {...barCss} animation={`${css['bounce']} 2.2s ease -2.2s infinite alternate`}></Box>
            <Box {...barCss} animation={`${css['bounce']} 2.2s ease -3.7s infinite alternate`}></Box>
    </Box>
}