import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { imgUrl } from '../config/config'

const ArtistCard = ({ artist }) => (
  <Link to={`/artist/${artist.id}`} style={{ textDecoration: 'none' }}>
    <Card className="h-100" style={{ backgroundColor: ' #89ac76', color: 'white' }}>
      <Card.Img
        variant="top"
        src={`${imgUrl}${artist.image}`}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <Card.Body className="text-center">
        <Card.Title>{artist.name}</Card.Title>
      </Card.Body>
    </Card>
  </Link>
)

export default ArtistCard