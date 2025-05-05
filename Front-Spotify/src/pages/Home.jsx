import { useEffect, useState } from 'react'
import { getGenres } from '../services/genreService'
import { Container, Row, Col } from 'react-bootstrap'
import GenreCard from '../components/GenreCard'

const Home = () => {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(err => console.error('Error al cargar los géneros:', err))
  }, [])

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Géneros Musicales</h1>
      <Row xs={2} sm={3} md={4} className="g-4">
        {genres.map((genre) => (
          <Col key={genre.id}>
            <GenreCard genre={genre} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Home
