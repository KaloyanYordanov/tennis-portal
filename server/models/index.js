const Matches = require('./matches');
const Groups = require('./groups');
const Draws = require('./draws');
const Users = require('./users');
const Enrollments = require('./enrollments');
const Rankings = require('./rankings');
const TournamentSchemes = require('./schemes');
const {
  EnrollmentQueues,
  SchemeEnrollments,
  GroupTeams,
  Logs,
  Tokens,
  Sets,
  Tournaments,
  TournamentEditions,
  Teams,
  Invitations,
  News,
  Files,
  Gallery,
  SmtpCredentials,
  UserDetails,
  UserActivationCodes,
  EnrollmentGuards,
  Payments
} = require('../db');

module.exports = {
  Tournaments, TournamentEditions, TournamentSchemes, Rankings,
  Matches, Sets, Groups, GroupTeams, Draws, Teams,
  Enrollments,
  Tokens, Users, Invitations, Logs, News, Files, Gallery,
  SmtpCredentials, UserDetails, UserActivationCodes, EnrollmentGuards,
  Payments
}
//removed export of them because their usage is anti-pattern: use Enrollments instead
//SchemeEnrollments, EnrollmentQueues,