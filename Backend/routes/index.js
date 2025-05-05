module.exports = app => {
    require('./genre.routes.js')(app);
    require('./artist.routes.js')(app);
    require('./album.routes.js')(app);
    require('./song.routes.js')(app);
}