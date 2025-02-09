import React from 'react';
import moment from 'moment-timezone';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { ApplicationMode, Status, BracketStatus } from '../enums';

import PlayersIcon from '../components/icons/PlayersIcon';
import WinnerIcon from '../components/icons/WinnerIcon';
import FlagIcon from '../components/icons/FlagIcon';
import SeasonIcon from '../components/SeasonIcon';

class EditionsListTile extends React.Component {
  navigate() {
    const { edition, history, mode } = this.props;
    let hasPermission = mode == ApplicationMode.ADMIN || mode == ApplicationMode.TOURNAMENT;

    if (!hasPermission && edition.schemes && edition.schemes.length === 1)
      history.push(`/schemes/${edition.schemes[0].id}`);
    else
      history.push(`/editions/${edition.id}`);
  }

  render() {
    const { edition, classes, history } = this.props;

    let showSchemeInfo = edition.schemes && edition.schemes.length === 1;
    let ongoingSuffix = ' inactive';
    if (moment(edition.startDate).isSameOrAfter(moment(), 'date'))
      ongoingSuffix = ' ongoing'

    if (edition.schemes && edition.schemes.length === 1 && edition.schemes[0].bracketStatus == BracketStatus.ELIMINATION_END)
      ongoingSuffix = ' inactive';

    return (
      <Paper elevation={1} className={classes.tileRoot + ongoingSuffix} onClick={() => this.navigate()}>
        <div className={classes.date_root + ongoingSuffix}>
          <Typography className="month_part" style={{ textTransform: 'uppercase' }}>
            {moment(edition.startDate).format('MMM')}
          </Typography>
          <Typography className="date_part">
            {moment(edition.startDate).format('D')}
          </Typography>
        </div>
        <div className={classes.name_root + ongoingSuffix}>
          <Typography className="title">{edition.name}</Typography>
          <Typography variant="caption">{edition.info}</Typography>
          {showSchemeInfo && edition.schemes[0].bracketStatus != BracketStatus.ELIMINATION_END
            && <Typography style={{ display: 'flex', alignItems: 'center' }}>
              {moment(edition.schemes[0].date).format('hh:mm A')}
              {moment().isAfter(moment(edition.schemes[0].date)) && <Typography variant="caption" style={{ marginLeft: '.3em' }}>(Играе се)</Typography>}
            </Typography>}
          {showSchemeInfo && edition.schemes[0].final
            && <div className={classes.finale}>
              {getWinnerOrFirstTeam(edition.schemes[0].final)}
              {getRunnerUpOrSecondTeam(edition.schemes[0].final)}
            </div>}
        </div>
        {showSchemeInfo && <div className={classes.info_root + ongoingSuffix}>
          <div>
            <Typography color="secondary" className={classes.icon_and_text}>
              <SeasonIcon date={edition.schemes[0].date} />
              {edition.tournament.name}
            </Typography>

            <Typography color="primary" className={classes.icon_and_text}>
              <PlayersIcon width="20px" height="20px" />
              {edition.schemes[0].maxPlayerCount}
            </Typography>
          </div>
          <div className="schemeType">
            {edition.schemes[0].hasGroupPhase && <Typography align="center" color="primary">Групова фаза</Typography>}
            {!edition.schemes[0].hasGroupPhase && <Typography align="center" color="primary">Директна елиминация</Typography>}
          </div>
        </div>}
      </Paper>
    );
  }
}

function getWinnerOrFirstTeam(match) {
  if (match.winnerId) {
    let winner = match.winnerId == match.team1Id ? match.team1 : match.team2;

    return (
      <React.Fragment>
        <WinnerIcon width="18px" height="18px" />
        <div>
          <Typography>{winner.user1.name}</Typography>
          {winner.user2 && <Typography>{winner.user2.name}</Typography>}
        </div>
      </React.Fragment>
    );
  } else if (match.team1) {
    return (
      <div>
        <Typography>{match.team1.user1.name}</Typography>
        {match.team1.user2 && <Typography>{match.team1.user2.name}</Typography>}
      </div>
    );
  }
}

function getRunnerUpOrSecondTeam(match) {
  if (match.winnerId) {
    let runnerUp = match.winnerId == match.team1Id ? match.team2 : match.team1;

    return (
      <React.Fragment>
        <FlagIcon width="18px" height="18px" />
        <div>
          <Typography>{runnerUp.user1.name}</Typography>
          {runnerUp.user2 && <Typography>{runnerUp.user2.name}</Typography>}
        </div>
      </React.Fragment>
    );
  } else if (match.team2) {
    return (
      <div>
        <Typography>{match.team2.user1.name}</Typography>
        {match.team2.user2 && <Typography>{match.team2.user2.name}</Typography>}
      </div>
    );
  }
}


const styles = (theme) => ({
  tileRoot: {
    display: 'flex',
    alignItems: 'center',
    padding: '.8em',
    marginBottom: '1em',
    cursor: 'pointer',
    background: 'linear-gradient(0deg, rgb(220, 220, 220) 0%, rgb(239, 239, 239) 100%)',
    '&.ongoing': {
      background: 'linear-gradient(0deg, rgb(239, 239, 239) 0%, rgb(253, 253, 253) 100%)'
    },
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap'
    }
  },
  date_root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '60px',
    height: '60px',
    borderRadius: '3px',
    marginRight: ' 1em',
    backgroundColor: '#969696',
    '&.ongoing': {
      backgroundColor: theme.palette.secondary.main
    },
    '& .month_part': {
      fontSize: '.8em'
    },
    '& .date_part': {
      fontSize: '1.1em',
      fontWeight: 700
    },
    '& *': {
      color: 'white'
    }
  },
  name_root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    '& .title': {
      fontWeight: 700,
      fontSize: '1.5em'
    },
    '& *': {
      color: '#808080'
    },
    '&.ongoing *': {
      color: theme.palette.text.primary
    }
  },
  finale: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontWeight: 700,
    '& > *+*': {
      marginLeft: '.3em'
    }
  },
  icon_and_text: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  info_root: {
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      marginTop: '.8em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    '&.inactive *': {
      color: '#808080 !important'
    },
    '& *': {
      fontWeight: 700
    },
    '& > div': {
      display: 'flex',
      '& > *': {
        marginRight: '.3em'
      }
    },
    '& > .schemeType': {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }
});

export default withStyles(styles)(EditionsListTile);