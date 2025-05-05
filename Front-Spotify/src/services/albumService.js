import api from './api'

export const getAlbums = () =>
    api.get('/albums').then(res => res.data);  

export const getAlbumsByArtist = (artistId) =>
  api.get(`/albums/artist/${artistId}`).then(res => res.data)

export const getAlbum = (id) =>
  api.get(`/albums/${id}`).then(res => res.data)

export const createAlbum = (data) =>
  api.post('/albums',  data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)

export const updateAlbum = (id, data) =>
  api.patch(`/albums/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data)


export const deleteAlbum = (id) =>
  api.delete(`/albums/${id}`).then(res => res.data)
