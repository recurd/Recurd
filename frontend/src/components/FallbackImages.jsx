import { Image } from "@chakra-ui/react"

export function FallbackSongImage(props) {
    return <Image src="../assets/image/musical-note.png" {...props} />
}

export function FallbackAlbumImage(props) {
    return <Image src="../assets/image/vinyl.png" {...props} />
}

export function FallbackArtistImage(props) {
    return <Image src="../assets/image/artist.png" {...props} />
}