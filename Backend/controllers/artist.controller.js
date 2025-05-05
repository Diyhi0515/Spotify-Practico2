const { deleteUploadedFile } = require('../utils/fileHelpers.utils');
const db = require('../models');
const path = require('path');
const fs = require('fs');

const validateArtistRequest = (req) => {
  const { name, genreIds } = req.body;
  const errors = {};

  if (!name) {
    errors.name = "El nombre es requerido";
  }

  if (!req.file) errors.image = "La imagen es requerida";

  return {
    errors,
    artist: { name },
    genreIds: Array.isArray(genreIds)
      ? genreIds.map(id => parseInt(id)).filter(Boolean)
      : genreIds ? [parseInt(genreIds)] : []
  };
};

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await db.artist.findAll({
      include: {
        model: db.genre,
        as: 'genres',
        through: { attributes: [] },
      }
    });
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllArtistsByGenre = async (req, res) => {
  const { genreId } = req.params;
  try {
    const artists = await db.artist.findAll({
      include: {
        model: db.genre,
        as: 'genres',
        through: { attributes: [] },
        where: { id: genreId }
      }
    });
    if (artists.length === 0) {
      return res.status(404).json({ error: "No se encontraron artistas para este género" });
    }
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await db.artist.findByPk(id, {
      include: {
        model: db.genre,
        as: 'genres',
        through: { attributes: [] },
      }
    });
    if (!artist) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postArtistCreate = async (req, res) => {
  const { errors, artist, genreIds } = validateArtistRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('artists', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const newArtist = await db.artist.create(artist);

    if (req.file) {
      const filePath = path.join('uploads', 'artists', req.file.filename).replace(/\\/g, '/');
      newArtist.image = filePath;
      await newArtist.save();
    }

    if (genreIds.length > 0) {
      await newArtist.setGenres(genreIds);
    }

    const fullArtist = await db.artist.findByPk(newArtist.id, {
      include: { model: db.genre, as: 'genres', through: { attributes: [] } }
    });

    res.status(201).json(fullArtist);
  } catch (error) {
    deleteUploadedFile('artists', req.file?.filename);
    res.status(500).json({ error: error.message });
  }
};

exports.patchArtistUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await db.artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    if (req.body.name) {
      artist.name = req.body.name;
    }

    if (req.file) {
      if (artist.image) {
        const oldPath = path.join(__dirname, '..', artist.image.replace(/\//g, path.sep));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const filePath = path.join('uploads', 'artists', req.file.filename).replace(/\\/g, '/');
      artist.image = filePath;
    }

    await artist.save();

    if (req.body.genreIds) {
      const genreIds = Array.isArray(req.body.genreIds)
        ? req.body.genreIds.map(id => parseInt(id)).filter(Boolean)
        : [parseInt(req.body.genreIds)];
      await artist.setGenres(genreIds);
    }

    const updated = await db.artist.findByPk(id, {
      include: { model: db.genre, as: 'genres', through: { attributes: [] } }
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.putArtistUpdate = async (req, res) => {
  const { id } = req.params;
  const { errors, artist, genreIds } = validateArtistRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('artists', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const existingArtist = await db.artist.findByPk(id);
    if (!existingArtist) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    const oldImage = existingArtist.image;

    await existingArtist.update(artist);

    if (req.file) {
      if (oldImage) {
        const oldPath = path.join(__dirname, '..', oldImage.replace(/\//g, path.sep));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const filePath = path.join('uploads', 'artists', req.file.filename).replace(/\\/g, '/');
      existingArtist.image = filePath;
      await existingArtist.save();
    }

    if (genreIds.length > 0) {
      await existingArtist.setGenres(genreIds);
    }

    const updatedArtist = await db.artist.findByPk(id, {
      include: { model: db.genre, as: 'genres', through: { attributes: [] } }
    });

    res.status(200).json(updatedArtist);
  } catch (error) {
    deleteUploadedFile('artists', req.file?.filename);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await db.artist.findByPk(id);
    if (!artist) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    if (artist.image) {
      const imagePath = path.join(__dirname, '..', artist.image.replace(/\//g, path.sep));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await artist.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.serveArtistImage = (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, '..', 'uploads', 'artists', filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  res.sendFile(imagePath);
};
