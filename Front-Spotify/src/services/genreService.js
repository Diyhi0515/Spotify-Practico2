import api from './api'

export const getGenres = () =>
  api.get('/genres').then(res => res.data)

export const getGenre = (id) =>
  api.get(`/genres/${id}`).then(res => res.data)

export const createGenre = (data) =>
    api.post('/genres', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
  
export const updateGenre = (id, data) =>
    api.patch(`/genres/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data)
  

export const deleteGenre = (id) =>
  api.delete(`/genres/${id}`).then(res => res.data)
