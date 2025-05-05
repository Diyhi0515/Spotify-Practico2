const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Artist = sequelize.define('Artist', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING
      },
    });
  
    return Artist;
  };
  