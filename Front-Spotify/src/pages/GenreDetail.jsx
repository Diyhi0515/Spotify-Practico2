import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArtistsByGenre } from '../services/artistService'
import { Container, Row, Col, Card } from 'react-bootstrap'

import ArtistCard from '../components/ArtistCard'



const GenreDetail = () => {
  const { id } = useParams()
  const [artists, setArtists] = useState([])

  useEffect(() => {
    getArtistsByGenre(id)
      .then(setArtists)
      .catch(err => console.error('Error al cargar artistas:', err))
  }, [id])

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Artistas del Género</h1>
      <Row xs={2} sm={3} md={4} className="g-4">
        {artists.map((artist) => (
          <Col key={artist.id}>
            <ArtistCard artist={artist} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default GenreDetail
