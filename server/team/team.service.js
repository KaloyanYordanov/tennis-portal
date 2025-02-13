const { Teams, Users, Files, sequelize } = require('../db');
const { Gender } = require('../infrastructure/enums');

class TeamsService {
  getAll(filter) {
    let options = {
      where: {
        participateInTournaments: true
      },
      limit: (filter.limit || 25),
      offset: (filter.offset || 0),
      include: [
        { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
        { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
      ],
      order: [['globalRank', 'asc']]
    };

    const searchQuery = {
      '$user1.name$': {
        [sequelize.Op.iLike]: '%' + filter.searchTerm + '%'
      },
      '$user2.name$': {
        [sequelize.Op.iLike]: '%' + filter.searchTerm + '%'
      }
    };


    if (filter.searchTerm)
      options.where[sequelize.Op.or] = searchQuery;

    if (filter.type === 'single')
      options.where['user2Id'] = null;
    else if (filter.type === 'double')
      options.where['user2Id'] = {
        [sequelize.Op.not]: null
      };

    return Teams.findAndCountAll(options);
  }

  getUserTeam(userId) {
    return Teams.findOne({
      where: {
        user1Id: userId,
        user2Id: null
      },
      include: [
        { model: Users, as: 'user1', attributes: ['id', 'name', 'email', 'birthDate', 'gender'] },
        { model: Users, as: 'user2', attributes: ['id', 'name', 'email', 'birthDate', 'gender'] }
      ]
    });
  }

  async findOrCreate(model, transaction) {
    let user1Id = model.user1.id;
    let user2Id = (model.user2 || { id: null }).id;

    if (model.user2
      && model.user1.gender == Gender.FEMALE
      && model.user2.gender == Gender.MALE
    ) {
      let temp = user2Id;
      user2Id = user1Id;
      user1Id = temp;
    }

    const existingTeam = await Teams.findOne({
      where: { user1Id, user2Id },
      include: [
        { model: Users, as: 'user1', attributes: ['gender', 'birthDate'] },
        { model: Users, as: 'user2', attributes: ['gender', 'birthDate'] }
      ],
      transaction
    });

    if (existingTeam)
      return existingTeam;
    else {
      await Teams.create({ user1Id, user2Id }, { transaction });
      return await Teams.findOne({
        where: { user1Id, user2Id },
        include: [
          { model: Users, as: 'user1', attributes: ['gender', 'birthDate'] },
          { model: Users, as: 'user2', attributes: ['gender', 'birthDate'] }
        ],
        transaction
      });
    }
  }

  async update(id, model, transaction) {
    let entity = await Teams.findById(id);
    if (!entity)
      throw { name: 'NotFound' };

    let wonMatches = parseInt(model.wonMatches) || 0;
    let totalMatches = parseInt(model.totalMatches) || 0;
    let wonTournaments = parseInt(model.wonTournaments) || 0;
    let totalTournaments = parseInt(model.totalTournaments) || 0;

    if (entity.wonMatches != wonMatches)
      entity.wonMatches = wonMatches;
    if (entity.totalMatches != totalMatches)
      entity.totalMatches = totalMatches;
    if (entity.wonTournaments != wonTournaments)
      entity.wonTournaments = wonTournaments;
    if (entity.totalTournaments != totalTournaments)
      entity.totalTournaments = totalTournaments;

    this.calculateCoefficients(entity);
    return entity.save({ transaction });
  }

  async participateInTournaments(id) {
    let entity = await Teams.findById(id);
    if (!entity)
      throw { name: 'NotFound' };

    entity.participateInTournaments = !entity.participateInTournaments;

    if (!entity.participateInTournaments) {
      entity.rankingCoefficient = 0;
      entity.globalRank = -1;
    } else {
      entity.rankingCoefficient = -1
      await entity.save();
      this.calculateCoefficients(entity);
    }

    await entity.save();
  }

  calculateCoefficients(entity) {
    let matchesCoefficient = (entity.totalMatches != 0) ? entity.wonMatches / entity.totalMatches : 0;
    let tournamentsCoefficient = (entity.totalTournaments != 0) ? entity.wonTournaments / entity.totalTournaments : 0;
    let rankingCoefficient = matchesCoefficient + 1.2 * tournamentsCoefficient;

    if (entity.rankingCoefficient != rankingCoefficient)
      entity.rankingCoefficient = rankingCoefficient;
  }

  // delete(id) {
  //   return sequelize.transaction((trn) => {
  //     return Teams
  //       .findById(id)
  //       .then(team => {
  //         if (!team)
  //           return;
  //         if (team.user1Id && team.user2Id)
  //           return Teams.destroy({ where: { id: id } });
  //         else return UserService.delete(team.user1Id);
  //       });
  //   });
  // };
}

module.exports = new TeamsService();