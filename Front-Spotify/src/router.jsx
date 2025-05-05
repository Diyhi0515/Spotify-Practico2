import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import GenreDetail from './pages/GenreDetail'
import ArtistDetail from './pages/ArtistDetail'


import GenresAdmin from './pages/admin/GenreAdmin'
import ArtistsAdmin from './pages/admin/ArtistAdmin'
import AlbumsAdmin from './pages/admin/AlbumAdmin'
import SongsAdmin from './pages/admin/SongAdmin'


const Router = () => (
  <Routes>
    {/* Página pública */}
    <Route path="/" element={<Home />} />
    <Route path="/genre/:id" element={<GenreDetail />} />
    <Route path="/artist/:id" element={<ArtistDetail />} />

    {/* Admin */}
    <Route path="/admin/" element={<GenresAdmin />} />
    <Route path="/admin/artists" element={<ArtistsAdmin />} />
    <Route path="/admin/albums" element={<AlbumsAdmin />} />
    <Route path="/admin/songs" element={<SongsAdmin />} />

  </Routes>
)

export default Router
