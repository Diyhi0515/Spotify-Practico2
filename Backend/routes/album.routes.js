module.exports = (app) => {
    const controller = require("../controllers/album.controller.js");
    const router = require("express").Router();
    const upload = require('../middlewares/upload')(
        'albums',
        ['image/jpeg', 'image/png'],
        ['.jpg', '.jpeg', '.png']
      );

    router.get("/", controller.getAllAlbums);
    router.get("/:id", controller.getAlbumById);
    router.get("/image/:filename", controller.serveAlbumImage);

    router.get("/artist/:artistId", controller.getAllAlbumsByArtist);

    router.post("/", upload.single("image"), controller.postAlbumCreate);

    router.patch("/:id", upload.single("image"), controller.patchAlbumUpdate);

    router.put("/:id", upload.single("image"), controller.putAlbumUpdate);

    router.delete("/:id", controller.deleteAlbum);

    app.use("/api/albums", router);
}    