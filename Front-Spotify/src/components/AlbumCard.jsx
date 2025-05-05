import { Card, ListGroup } from 'react-bootstrap'
import SongPlayer from './SongPlayer'

import { imgUrl } from '../config/config'

const AlbumCard = ({ album }) => (
  <Card className="mb-4 p-3" style={{ backgroundColor: ' #89ac76', color: 'white' }}>
    <div className="d-flex align-items-center">
      <Card.Img
        variant="top"
        src={`${imgUrl}${album.image}`}
        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', marginRight: '20px' }}
      />
      <div>
        <small className="text-uppercase text-muted">Álbum</small>
        <Card.Title className="fs-1 fw-bold mb-0">
          {album.title}
        </Card.Title>
        <p className="text-muted mb-2">{album.songs.length} canciones</p>
      </div>
    </div>

    {album.songs.length > 0 && (
      <ListGroup variant="flush" className="mt-4">
        {album.songs.map((song, index) => (
          <ListGroup.Item key={song.id} style={{ backgroundColor: '#143018', color: 'white' }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{index + 1}. {song.title}</strong>
              </div>
              <SongPlayer url={song.mp3} />
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </Card>
)

export default AlbumCard