import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withStyles } from '@material-ui/core/styles';

import QueryService from '../../services/query.service';
import AsyncSelect from '../../components/select/AsyncSelect';

class MatchFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: {},
      errors: []
    }

    this.handleChange = (prop) => (event) => {
      let model = this.state.model;
      model[prop] = event.target.value;
      this.setState({ model });
    }

    this.handleCustomChange = (prop) => (value) => {
      const model = this.state.model;

      if (prop === 'team1') {
        model.team1 = value;
        model.team1Id = (value || { id: null }).id
      }

      if (prop === 'team2') {
        model.team2 = value;
        model.team2Id = (value || { id: null }).id
      }

      if (prop === 'withdraw') {
        if (value == model.team1)
          model.withdraw = 1;
        else if (value == model.team2)
          model.withdraw = 2;
        else model.withdraw = null;
      }

      this.setState({ model });
    }
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.model != this.props.model)
      this.setState({ model: this.props.model });
  }

  save() {
    const model = this.state.model;
    return QueryService
      .post(`/tournaments/${model.id ? model.id : ''}`, model)
      .then(e => this.props.onChange(e));
  }

  render() {
    const { model, errors } = this.state;
    const { onClose, classes, fullScreen, doubles } = this.props;

    const enableTeamChange = model.round == 1;
    const label = (doubles ? 'Отбор ' : 'Играч ');
    const withdrawOptions = [model.team1, model.team2];

    return (
      <Dialog
        open={true}
        onClose={onClose}
        fullScreen={fullScreen}
        classes={{ paper: classes.root }}
      >
        <DialogTitle>
          <Typography component="span" variant="headline">
            Въвеждане/промяна на мач {model.match} рунд {model.round}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {enableTeamChange && <React.Fragment>
            <AsyncSelect
              label={label + 1}
              value={model.team1}
              query="teams"
              filter={{
                singleTeams: !doubles,
                schemeId: model.schemeId
              }}
              noOptionsMessage={() => 'Няма намерени отбори'}
              formatOptionLabel={(option) => <Typography component="span">
                {option.user1.name}
              </Typography>}
              onChange={this.handleCustomChange('team1')}
            />

            <AsyncSelect
              label={label + 2}
              value={model.team2}
              query="teams"
              filter={{
                singleTeams: !doubles,
                schemeId: model.schemeId
              }}
              noOptionsMessage={() => 'Няма намерени отбори'}
              formatOptionLabel={(option) => <Typography component="span">
                {option.user1.name}
              </Typography>}
              onChange={this.handleCustomChange('team2')}
            />
          </React.Fragment>}

          {!enableTeamChange &&
            <React.Fragment><Typography>
              <Typography variant="caption">{label + 1}</Typography>
              {model.team1 ? model.team1.user1.name : 'BYE'}
              {doubles && model.team1 && <Typography>{model.team1.user2.name}</Typography>}
            </Typography>

              <Typography>
                <Typography variant="caption">{label + 2}</Typography>
                {model.team2 ? model.team2.user1.name : 'BYE'}
                {doubles && model.team2 && <Typography>{model.team2.user2.name}</Typography>}
              </Typography>
            </React.Fragment>}

          {model.team1 && model.team2 &&
            <FormControl style={{ width: '300px' }}>
              <InputLabel shrink>Отказал се</InputLabel>
              <Select
                onChange={this.handleChange('withdraw')}
                value={model.withdraw}
              >
                <MenuItem value={null}>Няма</MenuItem>
                <MenuItem value={1}>
                  <Typography>{model.team1.user1.name} </Typography>
                  {doubles && <Typography>{model.team1.user2.name} </Typography>}
                </MenuItem>
                <MenuItem value={2}>
                  <Typography>{model.team2.user1.name} </Typography>
                  {doubles && <Typography>{model.team2.user2.name} </Typography>}
                </MenuItem>
              </Select>
            </FormControl>}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="dense">Сет №</TableCell>
                <TableCell padding="none">{label + 1}</TableCell>
                <TableCell padding="none">{label + 2}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map(index => {
                return (
                  <TableRow key={index}>
                    <TableCell padding="dense">{index}</TableCell>
                    <TableCell padding="none">
                      <input type="text" style={{ maxWidth: '40px' }} />
                    </TableCell>
                    <TableCell padding="none">
                      <input type="text" style={{ maxWidth: '40px' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions className={classes.btnContainer}>
          <Button variant="contained" color="primary" className={classes.btn} onClick={() => this.save()}>
            Запис
          </Button>
          <Button variant="outlined" color="primary" className={classes.btn} onClick={onClose}>
            Отказ
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: '600px'
  },
  btnContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  btn: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '.3rem',
      width: '100%'
    }
  }
});

export default withStyles(styles)(
  withMobileDialog({ breakpoint: 'xs' })(MatchFormModal)
);