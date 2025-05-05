import api from './api'

export const getArtists = () =>
    api.get('/artists').then(res => res.data)

export const getArtistsByGenre = (genreId) =>
  api.get(`/artists/genre/${genreId}`).then(res => res.data)

export const getArtist = (id) =>
  api.get(`/artists/${id}`).then(res => res.data)

export const createArtist = (data) =>
  api.post('/artists', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)

export const updateArtist = (id, data) =>
  api.patch(`/artists/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)

export const deleteArtist = (id) =>
  api.delete(`/artists/${id}`).then(res => res.data)
