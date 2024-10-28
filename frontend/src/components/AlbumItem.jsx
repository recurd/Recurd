export default function AlbumItem({album}){
    return (
        <div>
            <img src={album.image} alt={album.title} />
            <p>{album.title}</p>
            <p>{album.artist}</p>
            <p>Rank: {album.rank}</p>
        </div>
    )
}
