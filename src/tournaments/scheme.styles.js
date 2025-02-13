export default (theme) => ({
  root: {
    padding: '2em'
  },
  heading: {
    fontWeight: 700,
    fontSize: '1.3em'
  },
  mobile_heading: {
    margin: '0 0 .3em 0',
    fontWeight: 700,
    fontSize: '1.1em'
  },
  info_bar_root: {
    display: 'flex',
    justifyContent: 'flex-start',
    color: theme.palette.primary.light,
    marginBottom: '1em',
    '& > *': {
      color: theme.palette.primary.light,
      fontWeight: 600,
      marginRight: '.5em',
      display: 'flex',
      alignItems: 'center'
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  widgets_root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  widgets_second_row: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    '& > .left': {
      flexGrow: 1,
      flexBasis: '40%',
      [theme.breakpoints.down('sm')]: {
        flexBasis: '100%'
      }
    },
    '& > .right': {
      flexGrow: 1,
      flexBasis: '40%',
      marginLeft: '1em',
      [theme.breakpoints.down('sm')]: {
        flexBasis: '100%',
        marginLeft: '0',
        marginTop: '1em'
      }
    }
  },
  schemes_widget: {
    display: 'flex',
    padding: '2em',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  schemes_widget_tile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '.3em 1em',
    background: 'linear-gradient(0deg, rgb(255, 232, 217) 0%, rgb(255, 255, 255) 100%)',
    color: theme.palette.secondary.main,
    cursor: 'pointer'
  },
  register_widget: {
    display: 'flex',
    flexDirection: 'column',
    padding: '.5em 1.5em',
    '& .buttons': {
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    }
  },
  enrollments_widget: {
    padding: '1em',
    background: 'linear-gradient(0deg, rgb(220, 220, 220) 0%, rgb(239, 239, 239) 100%)'
  },
  // single_teams_finale_mobile: {
  //   padding: '1em',
  //   background: 'linear-gradient(0deg, rgb(239, 239, 239) 0%, rgb(253, 253, 253) 100%)',
  //   '& .root': {
  //     flexDirection: 'column',
  //     alignItems: 'center',
  //     flexGrow: 1
  //   },
  //   '& .player': {
  //     flexDirection: 'row',
  //     justifyContent: 'flex-start',
  //     margin: '.5em 0',
  //     '& img': {
  //       width: '50px !important',
  //       height: '50px !important'
  //     }
  //   },
  //   '& .score': {
  //     alignSelf: 'center'
  //   }
  // },
  single_teams_finale: {
    background: 'linear-gradient(0deg, #faffd6 0%, rgb(255, 255, 255) 65%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .player': {
      margin: '0 2em',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    '& .root': {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    '& .score': {

    },
    // [theme.breakpoints.down('xs')]: {
    //   // justifyContent: 'flex-start',
    //   '& .root': {
    //     flexDirection: 'column',
    //     alignItems: 'flex-start'
    //   },
    //   '& *': {
    //     fontSize: '1em'
    //   },
    //   '& .player': {
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    //     margin: '.5em 0',
    //     '& img': {
    //       width: '50px !important',
    //       height: '50px !important'
    //     }
    //   },
    //   '& .score': {
    //     margin: '0 0 0 50px'
    //   }
    // }
  },
  finale_widget: {
    background: 'linear-gradient(0deg, rgb(239, 239, 239) 0%, rgb(255, 255, 255) 100%)',
    '& .table-root': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    '& .row-root': {
      marginBottom: '1em',
      display: 'flex',
      width: '67%',
      marginBottom: '1em',
      padding: '.5em .8em',
      background: 'linear-gradient(0deg, rgb(239, 239, 239) 0%, rgb(253, 253, 253) 100%)',
      '&.winner': {
        background: 'linear-gradient(0deg, #faffd6 0%, rgb(255, 255, 255) 65%)'
        // background: 'linear-gradient(0deg, #b2cc81 0%, rgb(253, 253, 253) 50%)'
      }
    },
    [theme.breakpoints.down('xs')]: {
      background: 'initial',
      '& .table-root': {
        display: 'initial'
      },
      '& .row-root': {
        width: 'initial',
        marginBottom: '.5em'
      }
    }
  }
});