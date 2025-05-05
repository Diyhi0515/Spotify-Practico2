const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ArtistGenre = sequelize.define('ArtistGenre', {
        associatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          }
    }, { timestamps: false });

    return ArtistGenre;
}