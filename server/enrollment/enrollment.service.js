const { Sequelize, Enrollments, Teams, Users, Rankings } = require('../db');
const { Gender } = require('../infrastructure/enums');
const Op = Sequelize.Op;

class EnrollmentService {
  getByUserId(userId) {
    return Enrollments
      .findAll({
        include: [
          {
            model: Teams, as: 'team',
            where: {
              [Op.or]: {
                user1Id: userId,
                user2Id: userId
              }
            }
          }
        ]
      });
  }

  getById(id) {
    return Enrollments.findById(id, {
      include: [
        {
          model: Teams, as: 'team',
          include: ['user1', 'user2']
        }
      ]
    });
  }

  getPlayers(scheme) {
    return Enrollments
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          {
            model: Teams, as: 'team',
            include: [
              {
                model: Rankings, as: 'rankings'
              },
              { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
              { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
            ]
          }
        ],
        order: [['createdAt']],
        limit: scheme.maxPlayerCount,
      })
      .then(enrollments => {
        return enrollments.sort((a, b) => {
          let ap = ((a.team.rankings || []).find(r => r.tournamentId == scheme.edition.tournamentId) || { points: 0 }).points;
          let bp = ((b.team.rankings || []).find(r => r.tournamentId == scheme.edition.tournamentId) || { points: 0 }).points;
          return bp - ap;
        });
      });
  }

  getPlayersInQueue(scheme) {
    return Enrollments
      .findAll({
        where: {
          schemeId: scheme.id
        },
        include: [
          {
            model: Teams, as: 'team',
            include: [
              { model: Users, as: 'user1', attributes: ['id', 'name', 'email'] },
              { model: Users, as: 'user2', attributes: ['id', 'name', 'email'] }
            ]
          }
        ],
        order: [['createdAt']],
        offset: scheme.maxPlayerCount,
      });
  }

  getAll(scheme) {
    return Promise
      .all([
        this.getPlayers(scheme),
        this.getPlayersInQueue(scheme)
      ])
      .then(([p, q]) => {
        return (p || []).concat((q || []));
      });
  }

  //Throws
  //ExistingEnrollment
  //RequirementsNotMet
  //UserHasNoInfo
  async enroll(data) {
    const existingEnrollment = await Enrollments
      .findOne({
        where: {
          schemeId: data.scheme.id,
        },
        include: [
          {
            model: Teams, as: 'team',
            where: {
              [Op.or]: {
                user1Id: [data.user1Id].concat((data.user2Id ? [data.user2Id] : [])),
                user2Id: [data.user1Id].concat((data.user2Id ? [data.user2Id] : []))
              }
            }
          }
        ]
      });

    if (existingEnrollment)
      throw { name: 'DomainActionError', error: { message: 'ExistingEnrollment' } };

    let errors = this.validateEnrollment(data.scheme, data.team);
    if (errors.length > 0)
      throw { name: 'DomainActionError', error: { message: 'RequirementsNotMet', errors } };

    return Enrollments.create({ schemeId: data.scheme.id, teamId: data.team.id });
  }

  async cancelEnroll(id) {
    const enrollment = await this.getById(id);
    if (!enrollment)
      throw { name: 'NotFound' };

    await Enrollments.destroy({ where: { id: id } });
    //send emails for enrollment.team->users
  }

  validateEnrollment(scheme, team) {
    const errors = [];
    if (!team.user1.gender || !team.user1.birthDate)
      throw { name: 'DomainActionError', error: { message: 'UserHasNoInfo' } };

    if (scheme.singleTeams) {
      if ((scheme.maleTeams && team.user1.gender != Gender.MALE)
        || (scheme.femaleTeams && team.user.gender != Gender.FEMALE))
        errors.push('gender');

    }
  }
}

module.exports = new EnrollmentService();