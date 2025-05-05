import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAlbumsByArtist } from '../services/albumService'
import { getSongsByAlbum } from '../services/songService'
import { Container, Row, Col } from 'react-bootstrap'
import AlbumCard from '../components/AlbumCard'

const ArtistDetail = () => {
  const { id } = useParams()
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    getAlbumsByArtist(id)
      .then(async (albumsData) => {
        const albumsWithSongs = await Promise.all(
          albumsData.map(async (album) => {
            const songs = await getSongsByAlbum(album.id)
            return { ...album, songs }
          })
        )
        setAlbums(albumsWithSongs.filter(album => album.songs.length > 0))
      })
      .catch(err => console.error('Error al cargar álbumes o canciones:', err))
  }, [id])

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Álbumes del Artista</h1>
      <Row xs={1} className="g-4">
        {albums.map((album) => (
          <Col key={album.id}>
            <AlbumCard album={album} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default ArtistDetail
