import api from './api'

export const getSongs = () =>
  api.get('/songs').then(res => res.data)

export const getSongsByAlbum = (albumId) =>
  api.get(`/songs/album/${albumId}`).then(res => res.data)

export const getSong = (id) =>
  api.get(`/songs/${id}`).then(res => res.data)

export const createSong = (data) =>
  api.post('/songs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)

export const updateSong = (id, data) =>
  api.patch(`/songs/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)

export const deleteSong = (id) =>
  api.delete(`/songs/${id}`).then(res => res.data)

