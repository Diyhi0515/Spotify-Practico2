const { deleteUploadedFile } = require('../utils/fileHelpers.utils');
const db = require('../models');
const path = require('path');
const fs = require('fs');

const validateAlbumRequest = (req) => {
  const { title, artistId } = req.body;
  const errors = {};

  if (!title) errors.title = 'El titulo es requerido';
  if (!artistId) errors.artistId = 'El artista es requerido';
  if (!req.file) errors.image = "La imagen es requerida";

  return { errors, album: { title, artistId } };
};

exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await db.album.findAll({
      include: [{ model: db.artist, as: 'artist' }]
    });
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const album = await db.album.findByPk(req.params.id, {
      include: [
        { model: db.artist, as: 'artist' },
        { model: db.song, as: 'songs' }
      ]
    });
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAlbumsByArtist = async (req, res) => {
  const { artistId } = req.params;
  try {
    const albums = await db.album.findAll({
      where: { artistId },
      include: [{ model: db.artist, as: 'artist' }]
    });
    if (albums.length === 0) return res.status(404).json({ error: 'No se encontraron álbumes para este artista' });
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.postAlbumCreate = async (req, res) => {
  const { errors, album } = validateAlbumRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('albums', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const newAlbum = await db.album.create(album);

    if (req.file) {
      const filePath = path.join('uploads', 'albums', req.file.filename).replace(/\\/g, '/');
      newAlbum.image = filePath;
      await newAlbum.save();
    }

    res.status(201).json(newAlbum);
  } catch (err) {
    deleteUploadedFile('albums', req.file?.filename);
    res.status(500).json({ error: err.message });
  }
};

exports.putAlbumUpdate = async (req, res) => {
  const { id } = req.params;
  const { errors, album } = validateAlbumRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('albums', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const existing = await db.album.findByPk(id);
    if (!existing) return res.status(404).json({ error: 'Álbum no encontrado' });

    const oldImage = existing.image;
    await existing.update(album);

    if (req.file) {
      if (oldImage) {
        const oldPath = path.join(__dirname, '..', oldImage.replace(/\//g, path.sep));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const filePath = path.join('uploads', 'albums', req.file.filename).replace(/\\/g, '/');
      existing.image = filePath;
      await existing.save();
    }

    res.status(200).json(existing);
  } catch (err) {
    deleteUploadedFile('albums', req.file?.filename);
    res.status(500).json({ error: err.message });
  }
};

exports.patchAlbumUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await db.album.findByPk(id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    if (req.body.title) album.title = req.body.title;
    if (req.body.artistId) album.artistId = req.body.artistId;

    if (req.file) {
      if (album.image) {
        const oldPath = path.join(__dirname, '..', album.image.replace(/\//g, path.sep));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const filePath = path.join('uploads', 'albums', req.file.filename).replace(/\\/g, '/');
      album.image = filePath;
    }

    await album.save();
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const album = await db.album.findByPk(req.params.id);
    if (!album) return res.status(404).json({ error: 'Álbum no encontrado' });

    if (album.image) {
      const imagePath = path.join(__dirname, '..', album.image.replace(/\//g, path.sep));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await album.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.serveAlbumImage = (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '..', 'uploads', 'albums', filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  return res.sendFile(imagePath);
};
