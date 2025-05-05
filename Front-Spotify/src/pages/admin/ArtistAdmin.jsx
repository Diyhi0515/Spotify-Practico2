import React, { useEffect, useState, useRef } from 'react'
import {
  getArtists,
  createArtist,
  updateArtist,
  deleteArtist
} from '../../services/artistService'
import { getGenres } from '../../services/genreService'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Table,
  Image
} from 'react-bootstrap'

import { imgUrl } from '../../config/config';

const ArtistAdmin = () => {
  const [artists, setArtists] = useState([])
  const [genres, setGenres] = useState([])
  const [form, setForm] = useState({ name: '', genreIds: [], image: null })
  const [editingArtist, setEditingArtist] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const fileInputRef = useRef()


  useEffect(() => {
    loadArtists()
    loadGenres()
  }, [])

  const loadArtists = async () => {
    const data = await getArtists()
    setArtists(data)
  }

  const loadGenres = async () => {
    const data = await getGenres()
    setGenres(data)
  }

  const handleChange = e => {
    const { name, value, type, files } = e.target

    if (type === 'file') {
      setForm({ ...form, image: files[0] })
    } else if (name === 'genreIds') {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value)
      setForm({ ...form, genreIds: selected })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!editingArtist && !form.image) {
      alert('La imagen es requerida para crear un nuevo artista.')
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    form.genreIds.forEach(id => formData.append('genreIds', id))
    if (form.image instanceof File) {
      formData.append('image', form.image)
    }

    if (editingArtist) {
      await updateArtist(editingArtist.id, formData)
    } else {
      await createArtist(formData)
    }

    setForm({ name: '', genreIds: [], image: null })
    setEditingArtist(null)
    setOriginalImage(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = null
    }

    loadArtists()
  }

  const handleEdit = artist => {
    setEditingArtist(artist)
    setForm({
      name: artist.name,
      genreIds: artist.genres.map(g => g.id.toString()),
      image: null
    })
    setOriginalImage(artist.image)
  }

  const handleDelete = async id => {
    if (window.confirm('¿Estás seguro de eliminar este artista?')) {
      await deleteArtist(id)
      loadArtists()
    }
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Administrar Artistas</h1>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <h3 className="mb-4">{editingArtist ? 'Editar Artista' : 'Crear Artista'}</h3>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Artista</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Karol G"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Géneros</Form.Label>
              <Form.Select
                multiple
                name="genreIds"
                value={form.genreIds}
                onChange={handleChange}
              >
                {genres.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen del Artista</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
                ref={fileInputRef}
              />
              {editingArtist && originalImage && (
                <div className="mt-2">
                  <Form.Text>Imagen actual:</Form.Text>
                  <br />
                  <Image
                    src={`${imgUrl}${originalImage}`}
                    alt={form.name}
                    height="60"
                    rounded
                  />
                </div>
              )}
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              {editingArtist ? 'Actualizar' : 'Crear'}
            </Button>
          </Col>

          <Col md={8}>
            <h3>Artistas Registrados</h3>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Géneros</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {artists.map(artist => (
                  <tr key={artist.id}>
                    <td>
                      <img
                        src={`${imgUrl}${artist.image}`}
                        alt={artist.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{artist.name}</td>
                    <td>{artist.genres.map(g => g.name).join(', ')}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(artist)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(artist.id)}
                      >
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
  )
}

export default ArtistAdmin
