module.exports = (db, Sequelize) => {
  const Sets = db.define("Sets", {
    team1: { type: Sequelize.INTEGER, allowNull: false },
    team2: { type: Sequelize.INTEGER, allowNull: false },
    tiebreaker: { type: Sequelize.INTEGER, allowNull: true },
    order: { type: Sequelize.INTEGER, allowNull: false }
  });

  Sets.associate = (models) => {
    models.Sets.belongsTo(models.Matches, {
      as: 'match',
      foreignKey: {
        name: 'matchId',
        allowNull: false
      }
    });
  }

  return Sets;
}