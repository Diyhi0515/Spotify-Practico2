import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { imgUrl } from '../config/config'

const GenreCard = ({ genre }) => (
  <Link to={`/genre/${genre.id}`} style={{ textDecoration: 'none' }}>
    <Card className="h-100" style={{ backgroundColor: ' #89ac76', color: 'white' }}>
      <Card.Img
        variant="top"
        src={`${imgUrl}${genre.image}`}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <Card.Body className="text-center">
        <Card.Title>{genre.name}</Card.Title>
      </Card.Body>
    </Card>
  </Link>
)

export default GenreCard