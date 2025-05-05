import React, { useEffect, useState, useRef } from 'react';
import { getSongs, createSong, updateSong, deleteSong } from '../../services/songService';
import { getAlbums } from '../../services/albumService';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';

import { mp3Url } from '../../config/config';

import { useContext } from 'react';
import { AudioContext } from '../../context/AudioContext';


const SongAdmin = () => {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({ title: '', albumId: '', mp3: null });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef();

  const { registerAudio } = useContext(AudioContext);


  useEffect(() => {
    loadSongs();
    loadAlbums();
    return () => registerAudio(null);
  }, [registerAudio]);

  const loadSongs = async () => {
    const data = await getSongs();
    setSongs(data);
  };

  const loadAlbums = async () => {
    const data = await getAlbums();
    setAlbums(data);
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (form.title) formData.append('title', form.title);
    if (form.albumId) formData.append('albumId', form.albumId);
    if (form.mp3) formData.append('mp3', form.mp3);

    if (!editingId && (!form.title || !form.albumId || !form.mp3)) {
      alert('Todos los campos son requeridos para crear una canción.');
      return;
    }

    if (editingId) {
      await updateSong(editingId, formData);
    } else {
      await createSong(formData);
    }

    setForm({ title: '', albumId: '', mp3: null });
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    loadSongs();
  };

  const handleEdit = (song) => {
    setEditingId(song.id);
    setForm({
      title: song.title,
      albumId: song.album.id,
      mp3: null
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta canción?')) {
      await deleteSong(id);
      loadSongs();
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Administrar Canciones</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={4}>
            <h3>{editingId ? 'Editar Canción' : 'Crear Canción'}</h3>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Álbum</Form.Label>
              <Form.Select
                name="albumId"
                value={form.albumId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un álbum</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>{album.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Archivo MP3</Form.Label>
              <Form.Control
                type="file"
                name="mp3"
                ref={fileInputRef}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </Col>
          <Col md={8}>
            <h3>Canciones Registradas</h3>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Álbum</th>
                  <th>Artista</th>
                  <th>Reproducir</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {songs.map(song => (
                  <tr key={song.id}>
                    <td>{song.title}</td>
                    <td>{song.album.title}</td>
                    <td>{song.album.artist.name}</td>
                    <td>
                    <audio
                        controls
                        src={`${mp3Url}${song.mp3}`}
                        style={{ width: '100%' }}
                        onPlay={(e) => registerAudio(e.target)}>
                        Tu navegador no soporta audio.
                    </audio>

                    </td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(song)} className="me-2">
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(song.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default SongAdmin;
