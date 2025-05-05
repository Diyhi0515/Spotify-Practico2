const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Genre = sequelize.define('Genre', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING
      },
    });
  
    return Genre;
  };
  