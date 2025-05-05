const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Album = sequelize.define('Album', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING
      }
    });
  
    return Album;
  };
  