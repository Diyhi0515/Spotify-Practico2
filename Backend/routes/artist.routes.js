module.exports = (app) => {
    const controller = require("../controllers/artist.controller.js");
    const router = require("express").Router();
    const upload = require('../middlewares/upload')(
        'artists',
        ['image/jpeg', 'image/png'],
        ['.jpg', '.jpeg', '.png']
      );


    router.get("/", controller.getAllArtists);
    router.get("/:id", controller.getArtistById);
    router.get("/image/:filename", controller.serveArtistImage);

    router.get("/genre/:genreId", controller.getAllArtistsByGenre);

    router.post("/", upload.single("image"), controller.postArtistCreate);
    
    router.patch("/:id", upload.single("image"), controller.patchArtistUpdate);

    router.put("/:id", upload.single("image"),controller.putArtistUpdate);

    router.delete("/:id", controller.deleteArtist);


    app.use("/api/artists", router);
}