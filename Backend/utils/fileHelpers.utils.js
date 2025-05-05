const fs = require('fs');
const path = require('path');

/**
 * Elimina un archivo subido si existe
 * @param {string} folder - Carpeta dentro de /uploads (ej: 'albums', 'songs')
 * @param {string} filename - Nombre del archivo (ej: 'image-123456.jpg')
 */


const deleteUploadedFile = (folder, filename) => {
  if (!filename) return;

  const filePath = path.join(__dirname, '..', 'uploads', folder, filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(`Error al eliminar archivo ${filePath}:`, unlinkErr);
        }
      });
    }
  });
};

module.exports = {
  deleteUploadedFile
};
