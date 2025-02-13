const { Status } = require('../infrastructure/enums');

module.exports = (db, Sequelize) => {
  const Tournaments = db.define('Tournaments', {
    name: { type: Sequelize.STRING, allowNull: false, },
    info: Sequelize.TEXT,
    status: {
      type: Sequelize.ENUM, allowNull: false,
      values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE]
    },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false }
  });

  Tournaments.associate = function (models) {
    models.Tournaments.belongsTo(models.Files, {
      as: 'thumbnail',
      foreignKey: {
        name: 'thumbnailId',
        allowNull: true
      }
    });

    models.Tournaments.hasMany(models.Rankings, {
      as: 'rankings',
      foreignKey: {
        name: 'tournamentId',
        allowNull: false
      }
    })
  }

  return Tournaments;
}