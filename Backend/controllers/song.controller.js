const db = require('../models');
const fs = require('fs');
const path = require('path');
const { deleteUploadedFile } = require('../utils/fileHelpers.utils');

const validateSongRequest = (req) => {
  const { title, albumId } = req.body;
  const errors = {};

  if (!title) errors.title = 'El título es requerido';
  if (!albumId) errors.albumId = 'El álbum es requerido';
  if (!req.file) errors.mp3 = "La canción (archivo MP3) es requerida";

  const song = { title, albumId};
  if (req.file) {
    const filePath = path.join('uploads', 'songs', req.file.filename).replace(/\\/g, '/');
    song.mp3 = filePath;
  }

  return { errors, song };
};

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await db.song.findAll({
      include: [
        {
          model: db.album,
          as: 'album',
          include: [{ model: db.artist, as: 'artist' }]
        }
      ]
    });
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSongsByAlbum = async (req, res) => {
  const { albumId } = req.params;
  try {
    const songs = await db.song.findAll({
      where: { albumId },
      include: [
        {
          model: db.album,
          as: 'album',
          include: [{ model: db.artist, as: 'artist' }]
        }
      ]
    });
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await db.song.findByPk(req.params.id, {
      include: [
        {
          model: db.album,
          as: 'album',
          include: [{ model: db.artist, as: 'artist' }]
        }
      ]
    });

    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });
    res.status(200).json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postSongCreate = async (req, res) => {
  const { errors, song } = validateSongRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('songs', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const newSong = await db.song.create(song);
    res.status(201).json(newSong);
  } catch (err) {
    deleteUploadedFile('songs', req.file?.filename);
    res.status(500).json({ error: err.message });
  }
};

exports.putSongUpdate = async (req, res) => {
  const { id } = req.params;
  const { errors, song } = validateSongRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('songs', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const existing = await db.song.findByPk(id);
    if (!existing) return res.status(404).json({ error: 'Canción no encontrada' });

    const oldMp3 = existing.mp3;
    await existing.update(song);


    if (req.file && oldMp3) {
      const oldPath = path.join(__dirname, '..', oldMp3.replace(/\//g, path.sep));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    res.status(200).json(existing);
  } catch (err) {
    deleteUploadedFile('songs', req.file?.filename);
    res.status(500).json({ error: err.message });
  }
};


exports.patchSongUpdate = async (req, res) => {
  try {
    const song = await db.song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });

    if (req.body.title) song.title = req.body.title;
    if (req.body.albumId) song.albumId = req.body.albumId;

  
    if (req.file && (req.file.mimetype === 'audio/mpeg' || req.file.mimetype === 'audio/mp3')) {
      console.log('Archivo nuevo recibido:', req.file.filename);

   
      if (song.mp3) { //eliminar el archivo anterior
        const oldFilename = path.basename(song.mp3);
        deleteUploadedFile('songs', oldFilename); 
        console.log('Archivo anterior eliminado:', oldFilename);
      }

      
      const newAudioPath = path.join('uploads', 'songs', req.file.filename).replace(/\\/g, '/');
      song.mp3 = newAudioPath;
    }

    await song.save(); 
    res.status(200).json(song);
  } catch (err) {
    console.error('Error al actualizar canción:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await db.song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: 'Canción no encontrada' });


    if (song.mp3) {
      const filePath = path.join(__dirname, '..', song.mp3.replace(/\//g, path.sep));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await song.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
