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

  if (match.team2Id == null)
    winner = match.team1Id;
  if (match.team1Id == null)
    winner = match.team2Id;
  if (match.team1Id == null && match.team2Id == null)
    winner = null;

  return winner;
}

function parseSet(set) {
  const scoreParser = /^(\d+)(\(\d+\))*$/;

  if (!set.team1 || !set.team2)
    throw { name: 'DomainActionError', error: { message: 'Invalid format: match->set' } };

  let t1m = set.team1.toString().match(scoreParser);
  let t2m = set.team2.toString().match(scoreParser);
  if ((t1m[2] && t2m[2]) || t1m.length < 2 || t2m.length < 2)
    throw { name: 'DomainActionError', erorr: { message: 'Invalid format: match->set' } };

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

module.exports = { getWinner, parseSet, formatSet };