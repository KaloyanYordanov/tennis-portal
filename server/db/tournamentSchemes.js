const { Status, SchemeType } = require('../enums');
const moment = require('moment');

module.exports = (db, Sequelize) => {
  const ELIMINATION = 'elimination';
  const GROUP = 'round-robin';

  const TournamentSchemes = db.define('TournamentSchemes', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    info: Sequelize.TEXT,
    date: { type: Sequelize.DATEONLY, allowNull: false },
    singleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    maleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    femaleTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    mixedTeams: { type: Sequelize.BOOLEAN, allowNull: false },
    ageFrom: {
      type: Sequelize.INTEGER,
      validate: {
        min: 0
      }
    },
    ageTo: {
      type: Sequelize.INTEGER,
      validate: {
        min: 0
      }
    },
    maxPlayerCount: { type: Sequelize.INTEGER, allowNull: true },
    groupCount: { type: Sequelize.INTEGER, allowNull: true },
    teamsPerGroup: { type: Sequelize.INTEGER, allowNull: true },
    registrationStart: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue('registrationStart')).format('YYYY-MM-DDTHH:mm');
      }
    },
    registrationEnd: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function () {
        return moment(this.getDataValue('registrationEnd')).format('YYYY-MM-DDTHH:mm');
      }
    },
    hasGroupPhase: { type: Sequelize.BOOLEAN, allowNull: false },
    status: {
      type: Sequelize.ENUM,
      values: [Status.DRAFT, Status.PUBLISHED, Status.FINALIZED, Status.INACTIVE],
      allowNull: false
    },
    schemeType: {
      type: Sequelize.ENUM,
      values: [SchemeType.ELIMINATION, SchemeType.GROUP],
      allowNull: false
    },
    pPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    wPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false },
    cPoints: { type: Sequelize.INTEGER, default: 0, allowNull: false }
  }, {
      validate: {
        mixedSingleTeams() {
          if (this.singleTeams && this.mixedTeams)
            throw new Error('Cannot have mixed teams when the scheme is for single teams');
        },
        ageFromTo() {
          if (this.ageFrom && this.ageTo && this.ageFrom > this.ageTo)
            throw new Error('Age from must be <= Age to');
        },
        registrationStartEnd() {
          if (new Date(this.registrationStart) > new Date(this.registrationEnd))
            throw new Error('Registration start date cannot be after registration end date');
        },
        tournamentDate() {
          if (this.date < new Date(this.registrationStart))
            throw new Error('Tournament start cannot be before registration start date');
        },
        schemeFormat() {
          if (!this.maleTeams && !this.femaleTeams && !this.mixedTeams)
            throw new Error('');
        },
        eTeamCount() {
          if (this.schemeType == ELIMINATION && !this.maxPlayerCount)
            throw new Error();
        },
        gCount() {
          if (this.schemeType == GROUP && !this.groupCount)
            throw new Error();
        },
        rrTeamCount() {
          if (this.schemeType == GROUP && !this.teamsPerGroup)
            throw new Error();
        },
        groupPhase() {
          if (!this.groupPhaseId && this.hasGroupPhase)
            throw new Error();
        }
      }
    });

  TournamentSchemes.associate = (models) => {
    models.TournamentSchemes.belongsTo(models.TournamentEditions, {
      foreignKey: {
        name: 'tournamentEditionId',
        allowNull: false
      }
    });

    models.TournamentSchemes.hasMany(models.SchemeEnrollments, {
      as: 'enrollments',
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });

    models.TournamentSchemes.hasMany(models.EnrollmentQueues, {
      as: 'EnrollmentQueues',
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });

    models.TournamentSchemes.belongsTo(models.TournamentSchemes, {
      as: 'groupPhase',
      foreignKey: {
        name: 'groupPhaseId',
        allowNull: true
      }
    });

    models.TournamentSchemes.hasMany(models.Matches, {
      foreignKey: {
        name: 'schemeId',
        allowNull: false
      }
    });
  }

  return TournamentSchemes;
}