const {sequelize} = require('../config/db.config.js');

const genre = require('./genre.model.js')(sequelize);
const artist = require('./artist.model.js')(sequelize);
const album = require('./album.model.js')(sequelize);
const song = require('./song.model.js')(sequelize);

const ArtistGenre = require('./artistGenre.model.js')(sequelize);


artist.belongsToMany(genre, {
  through: ArtistGenre,
  foreignKey: 'artistId',
  as: 'genres'
});
genre.belongsToMany(artist, {
  through: ArtistGenre,
  foreignKey: 'genreId',
  as: 'artists'
});

artist.hasMany(album, { foreignKey: 'artistId', as: 'albums' });
album.belongsTo(artist, { foreignKey: 'artistId', as: 'artist' });

album.hasMany(song, { foreignKey: 'albumId', as: 'songs' });
song.belongsTo(album, { foreignKey: 'albumId', as: 'album' });



module.exports = {
    genre,
    artist,
    album,
    song,
    sequelize,
    Sequelize: sequelize.Sequelize
}