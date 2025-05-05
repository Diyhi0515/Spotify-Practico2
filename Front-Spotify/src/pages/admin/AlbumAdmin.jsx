import React, { useEffect, useState, useRef } from 'react';
import { getAlbums, createAlbum, updateAlbum, deleteAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import { Container, Table, Button, Form, Row, Col, Image } from 'react-bootstrap';

import { imgUrl } from '../../config/config';

const AlbumAdmin = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [form, setForm] = useState({ title: '', artistId: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    loadAlbums();
    loadArtists();
  }, []);

  const loadAlbums = async () => {
    const data = await getAlbums();
    setAlbums(data);
  };

  const loadArtists = async () => {
    const data = await getArtists();
    setArtists(data);
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
    if (form.artistId) formData.append('artistId', form.artistId);
    if (form.image) formData.append('image', form.image);

    if (!editingId && (!form.title || !form.artistId || !form.image)) {
      alert('Todos los campos son requeridos para crear un álbum.');
      return;
    }

    if (editingId) {
      await updateAlbum(editingId, formData);
    } else {
      await createAlbum(formData);
    }

    setForm({ title: '', artistId: '', image: null });
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
    loadAlbums();
  };

  const handleEdit = (album) => {
    setEditingId(album.id);
    setForm({
      title: album.title,
      artistId: album.artist.id,
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este álbum?')) {
      await deleteAlbum(id);
      loadAlbums();
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Administrar Álbumes</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={4}>
            <h3>{editingId ? 'Editar Álbum' : 'Crear Álbum'}</h3>
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
              <Form.Label>Artista</Form.Label>
              <Form.Select
                name="artistId"
                value={form.artistId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un artista</option>
                {artists.map(artist => (
                  <option key={artist.id} value={artist.id}>{artist.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="image"
                ref={fileInputRef}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="success" className="w-100">
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </Col>
          <Col md={8}>
            <h3>Álbumes Registrados</h3>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Título</th>
                  <th>Artista</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {albums.map(album => (
                  <tr key={album.id}>
                    <td>
                      <Image
                        src={`${imgUrl}${album.image}`}
                        alt={album.title}
                        height="60"
                        rounded
                      />
                    </td>
                    <td>{album.title}</td>
                    <td>{album.artist.name}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(album)} className="me-2">
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(album.id)}>
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

export default AlbumAdmin;