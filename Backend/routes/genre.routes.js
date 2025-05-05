module.exports = (app) => {
    let router = require("express").Router();
    const controller = require("../controllers/genre.controller.js");
    const upload = require('../middlewares/upload')(
        'genres',
        ['image/jpeg', 'image/png'],
        ['.jpg', '.jpeg', '.png']
      );

    router.get("/", controller.getAllGenres);
    router.get("/:id", controller.getGenreById);

    router.post("/", upload.single("image"), controller.postGenreCreate);

    router.patch("/:id", upload.single("image"), controller.patchGenreUpdate);
   
    router.put("/:id", upload.single("image"), controller.putGenreUpdate);

    router.delete("/:id", controller.deleteGenre);

    router.get('/image/:filename', controller.serveGenreImage);

    app.use("/api/genres", router);
}
