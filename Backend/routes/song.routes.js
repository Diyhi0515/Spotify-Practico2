module.exports = (app) => {
    const controller = require("../controllers/song.controller.js");
    const router = require("express").Router();
    const upload = require('../middlewares/upload')(
        'songs',
        ['audio/mpeg', 'audio/mp3'],
        ['.mp3']
      );

    router.get("/", controller.getAllSongs);
    router.get("/:id", controller.getSongById);

    router.get("/album/:albumId", controller.getAllSongsByAlbum);
   

    router.post("/", upload.single("mp3"), controller.postSongCreate);

    router.patch("/:id", upload.single("mp3"), controller.patchSongUpdate);

    router.put("/:id", upload.single("mp3"), controller.putSongUpdate);

    router.delete("/:id", controller.deleteSong);

    app.use("/api/songs", router);

    
}    