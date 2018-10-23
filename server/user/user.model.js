const {
  Gender,
  PlayStyle,
  CourtType,
  BackhandType
} = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Users = db.define('Users', {

    //account properties
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    passwordHash: { type: Sequelize.STRING(40), allowNull: false },
    passwordSalt: { type: Sequelize.STRING(16), allowNull: false },

    //user required information
    name: { type: Sequelize.STRING, allowNull: false },
    birthDate: { type: Sequelize.DATEONLY, allowNull: false },
    telephone: { type: Sequelize.STRING, allowNull: false },
    gender: {
      type: Sequelize.ENUM, allowNull: false,
      values: [Gender.MALE, Gender.FEMALE]
    },

    //user optional information
    startedPlaying: Sequelize.INTEGER,
    playStyle: {
      type: Sequelize.ENUM,
      values: [PlayStyle.LEFT, PlayStyle.RIGHT]
    },
    backhandType: {
      type: Sequelize.ENUM,
      values: [BackhandType.ONE, BackhandType.TWO]
    },
    courtType: {
      type: Sequelize.ENUM,
      values: [CourtType.CLAY, CourtType.GRASS, CourtType.HARD, CourtType.INDOOR]
    },

    //system properties
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  });

  return Users;
}