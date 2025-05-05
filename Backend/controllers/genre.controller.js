const { deleteUploadedFile } = require('../utils/fileHelpers.utils');
const db = require('../models');
const path = require('path');
const fs = require('fs');



const validateGenreRequest = (req) => {
  const { name } = req.body;
  const errors = {};

  if (!name ) errors.name = "El nombre es requerido";
  if (!req.file) errors.image = "La imagen es requerida";

  return { errors, genre: { name } };
};


exports.getAllGenres = async (req, res) => {
  try {
    const genres = await db.genre.findAll();
    return res.status(200).json(genres);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getGenreById = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await db.genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({ error: "Género no encontrado" });
    }
    return res.status(200).json(genre);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.postGenreCreate = async (req, res) => {
  const { errors, genre } = validateGenreRequest(req);
  if (Object.keys(errors).length > 0) {
    console.log('entro con errrores', errors);
    deleteUploadedFile('genres', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const newGenre = await db.genre.create(genre);
    
    if (req.file) {
      const filePath = path.join('uploads', 'genres', req.file.filename).replace(/\\/g, '/');
      newGenre.image = filePath;
      await newGenre.save();
    }

    return res.status(201).json(newGenre);
  } catch (error) {
    deleteUploadedFile('genres', req.file?.filename);
    return res.status(500).json({ error: error.message });
  }
};

exports.patchGenreUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await db.genre.findByPk(id);
    if (!genre) {
      deleteUploadedFile('genres', req.file?.filename);
      return res.status(404).json({ error: "Género no encontrado" });
    }

    if (req.body.name) {
      genre.name = req.body.name;
    }

    if (req.file) {
      if (genre.image) {
        const oldPath = path.join(__dirname, '..', genre.image.replace(/\//g, path.sep));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const filePath = path.join('uploads', 'genres', req.file.filename).replace(/\\/g, '/');
      genre.image = filePath;
    }

    await genre.save();
    return res.status(200).json(genre);
  } catch (error) {
    deleteUploadedFile('genres', req.file?.filename);
    return res.status(500).json({ error: error.message });
  }
};

exports.putGenreUpdate = async (req, res) => {
  const { id } = req.params;
  const { errors, genre } = validateGenreRequest(req);
  if (Object.keys(errors).length > 0) {
    deleteUploadedFile('genres', req.file?.filename);
    return res.status(400).json({ errors });
  }

  try {
    const existingGenre = await db.genre.findByPk(id);
    if (!existingGenre) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    const oldImage = existingGenre.image;

    await existingGenre.update(genre);

    if (req.file) {
      if (oldImage) {
        const oldPath = path.join(__dirname, '..', oldImage.replace(/\//g, path.sep));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const filePath = path.join('uploads', 'genres', req.file.filename).replace(/\\/g, '/');
      existingGenre.image = filePath;
      await existingGenre.save();
    }

    return res.status(200).json(existingGenre);
  } catch (error) {
    deleteUploadedFile('genres', req.file?.filename);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteGenre = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await db.genre.findByPk(id);
    if (!genre) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    if (genre.image) {
      const imagePath = path.join(__dirname, '..', genre.image.replace(/\//g, path.sep));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await genre.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.serveGenreImage = (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'uploads', 'genres', filename);
  
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }
  
    return res.sendFile(imagePath);
  };
