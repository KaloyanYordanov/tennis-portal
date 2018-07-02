module.exports = {
  getWinner, getMatchStatistics, parseSet, formatSet, generatePoints, transfer, orderGroupByStatistics
};

/** 
* Returns the winner teamId based on the match.sets and match.withdraw
*/
function getWinner(match) {
  let winner = null;

  if (match.withdraw == 1)
    winner = match.team2Id;
  else if (match.withdraw == 2)
    winner = match.team1Id;
  else if (match.sets.length > 0)
    //if there are sets, winner is the one with winning last set
    winner = match.sets[match.sets.length - 1].team1 > match.sets[match.sets.length - 1].team2 ?
      match.team1Id : match.team2Id;

  return winner;
}

function getMatchStatistics(match, teamId) {
  let ourTeam = match.team1Id == teamId ? 'team1' : 'team2';
  let oppositeTeam = match.team1Id == teamId ? 'team2' : 'team1';

  return {
    sets: match.sets.length,
    setsWon: match.sets.reduce((acc, next) => (next[ourTeam] > next[oppositeTeam] ? acc + 1 : acc), 0),
    games: match.sets.reduce((acc, next) => acc + next.team1 + next.team2, 0),
    gamesWon: match.sets.reduce((acc, next) => (next[ourTeam] > next[oppositeTeam] ? acc + next[ourTeam] : acc), 0),
    isWinner: getWinner(match) == teamId
  }
}

/**
 * Order by wins, setsScore, gamesScore 
 */
function orderGroupByStatistics(group) {
  group.teams = group.teams.map(team => {
    let statistics = group.matches.filter(match => match.team1Id == team.teamId
      || match.team2Id == team.teamId)
      .map(match => getMatchStatistics(match, team.teamId));

    team.wins = statistics.filter(s => s.isWinner).length;
    team.totalSets = statistics.reduce((acc, next) => acc + next.sets, 0);
    team.totalSetsWon = statistics.reduce((acc, next) => acc + next.setsWon, 0);
    team.totalGames = statistics.reduce((acc, next) => acc + next.games, 0);
    team.totalGamesWon = statistics.reduce((acc, next) => acc + next.gamesWon, 0);
    team.setsScore = (team.totalSets != 0 ? team.totalSetsWon / team.totalSets : 0);
    team.gamesScore = (team.totalGames != 0 ? team.totalGamesWon / team.totalGames : 0);

    return team;
  });

  group.teams.sort((t1, t2) => {
    if (t1.wins == t2.wins) {
      if (t1.setsScore == t2.setsScore)
        return t2.gamesScore - t1.gamesScore;
      else
        return t2.setsScore - t1.setsScore;
    }
    else return t2.wins - t1.wins;
  });
  return group;
}

function parseSet(set) {
  const scoreParser = /^(\d+)(\(\d+\))*$/;

  if (!set.team1 || !set.team2)
    throw { name: 'DomainActionError', message: 'Invalid format: match->set' };

  let t1m = set.team1.toString().match(scoreParser);
  let t2m = set.team2.toString().match(scoreParser);
  if ((t1m[2] && t2m[2]) || t1m.length < 2 || t2m.length < 2)
    throw { name: 'DomainActionError', message: 'Invalid format: match->set' };

  set.team1 = parseInt(t1m[1]);
  set.team2 = parseInt(t2m[1]);

  if (t1m[2])
    set.tiebreaker = parseInt(t1m[2].slice(1, t1m[2].length - 1));
  else if (t2m[2])
    set.tiebreaker = parseInt(t2m[2].slice(1, t2m[2].length - 1));
  else set.tiebreaker = null;

  return set;
}

function formatSet(set) {
  if (!set.tiebreaker)
    return set;

  if (set.team1 < set.team2)
    set.team1 = set.team1 + "(" + set.tiebreaker + ")";
  else
    set.team2 = set.team2 + "(" + set.tiebreaker + ")";

  return set;
}

/**
 * Transfer team between SchemeEnrollments and EnrollmentQueues
 */
function transfer(from, to, schemeId, teamId, transaction) {
  return Promise.all([
    from.destroy({
      where: {
        schemeId: schemeId,
        userId: teamId
      },
      transaction: transaction
    }),
    to.create({
      schemeId: schemeId,
      userId: teamId
    }, { transaction: transaction })
  ]);
}

/**
 * Function to generate points for tournament "Rankings".
 * Matches should be ordered ascending: tournament final should be last.
 * Team1, team2, sets should be included
 */
function generatePoints(scheme, matches, hasWinner) {
  let teamPoints = [];
  matches.forEach(match => {
    if (!teamPoints[match.team1Id])
      teamPoints[match.team1Id] = scheme.pPoints;
    if (!teamPoints[match.team2Id])
      teamPoints[match.team2Id] = scheme.pPoints;
  });

  matches.forEach(match => {
    let winner = getWinner(match);
    teamPoints[winner] += scheme.wPoints;
  });

  //let tournamentWinner = getWinner(matches[matches.length - 1]);
  if (hasWinner)
    teamPoints[matches[matches.length - 1].team1Id] += scheme.cPoints;
  return teamPoints
}