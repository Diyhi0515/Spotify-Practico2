const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Song = sequelize.define('Song', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mp3:{
        type: DataTypes.STRING
      }
    });
  
    return Song;
  };
  