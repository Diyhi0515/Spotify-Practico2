import { useEffect, useState, useRef } from 'react'
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../services/genreService'
import { Container, Table, Button, Form, Row, Col, Image } from 'react-bootstrap'


import { imgUrl } from '../../config/config'

const GenreAdmin = () => {
  const [genres, setGenres] = useState([])
  const [form, setForm] = useState({ name: '', image: null })
  const [originalImage, setOriginalImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const fileInputRef = useRef()

  useEffect(() => {
    loadGenres()
  }, [])

  const loadGenres = () => {
    getGenres().then(setGenres)
  }

  const handleChange = (e) => {
    const { name, type, value, files } = e.target
    if (type === 'file') {
      setForm({ ...form, image: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!editingId && !form.image) {
      alert('La imagen es requerida para crear un nuevo Género.')
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    if (form.image instanceof File) {
      formData.append('image', form.image)
    }

    const action = editingId
      ? updateGenre(editingId, formData)
      : createGenre(formData)

    action.then(() => {
      setForm({ name: '', image: null })
      setOriginalImage(null)
      setEditingId(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = null
      }
      loadGenres()
    })
  }

  const handleEdit = (genre) => {
    setEditingId(genre.id)
    setForm({ name: genre.name, image: null })
    setOriginalImage(genre.image)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
        deleteGenre(id).then(loadGenres)
    }
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Administrar Géneros</h1>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={4}>
            <h3 className="mb-4">
              {editingId ? 'Editar Género' : 'Crear Género'}
            </h3>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                name="image"
                ref={fileInputRef}
                onChange={handleChange}
              />
              {editingId && originalImage && (
                <div className="mt-2">
                  <Form.Text>Imagen actual:</Form.Text>
                  <br />
                  <Image
                    src={`${imgUrl}${originalImage}`}
                    alt="Imagen actual"
                    height="60"
                    rounded
                  />
                </div>
              )}
            </Form.Group>

            <Button type="submit" variant="success" className="w-100">
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </Col>

          <Col md={8}>
            <h3>Géneros Registrados</h3>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre) => (
                  <tr key={genre.id}>
                    <td>{genre.name}</td>
                    <td>
                      <img
                        src={`${imgUrl}${genre.image}`}
                        alt={genre.name}
                        height="60"
                      />
                    </td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => handleEdit(genre)}
                        className="me-2"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(genre.id)}
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

export default GenreAdmin
