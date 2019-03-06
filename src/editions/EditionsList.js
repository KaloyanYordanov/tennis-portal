import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import TournamentFormModal from '../tournaments/TournamentFormModal';
import EditionFormModal from './EditionFormModal';
import EditionsDesktopView from './EditionsDesktopView';
import EditionsMobileView from './EditionsMobileView';
import editionsViewActions from './EditionsViewActions';
import QueryService from '../services/query.service';
import UserService from '../services/user.service';
import { ApplicationMode, Status } from '../enums';

class EditionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editions: [],
      editionModel: null,
      tournamentModel: null
    }

    this.handleOpenModal = (editionModel) => {
      this.setState({ editionModel });
    }

    this.handleRemoveEdition = (edition) => {

    }
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    return QueryService
      .post(`/editions/filter`, {})
      .then(editions => this.setState({ editions }));
  }

  render() {
    const { editions, editionModel, tournamentModel } = this.state;
    const actions = editionsViewActions(this.handleOpenModal, this.handleRemoveEdition);

    return (
      <UserService.WithApplicationMode>
        {mode => (
          <div className="container">
            {editionModel
              && <EditionFormModal
                model={editionModel}
                onChange={() => { this.setState({ editionModel: null }); this.getData(); }}
                onClose={() => this.setState({ editionModel: null })}
              />}

            {tournamentModel
              && <TournamentFormModal
                model={tournamentModel}
                onChange={() => { this.setState({ tournamentModel: null }); this.getData(); }}
                onClose={() => this.setState({ tournamentModel: null })}
              />}

            {mode == ApplicationMode.ADMIN
              && <React.Fragment>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.setState({ status: Status.DRAFT, tournamentModel: { name: '', info: '', thumbnailId: null } })}
                >
                  Нова Лига
                  </Button>

                <Button
                  style={{ marginLeft: '.3rem' }}
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => this.setState({ editionModel: { status: Status.DRAFT, name: '', info: '', startDate: null, endDate: null } })}
                >
                  Нов Турнир
                  </Button>
              </React.Fragment>}

            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="headline">Турнири</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>

                {editions.length == 0 && <Typography variant="caption">Няма регистрирани турнири</Typography>}
                {editions.length > 0 && <Hidden smDown>
                  <EditionsDesktopView editions={editions} actions={actions} />
                </Hidden>}

                {editions.length > 0 && <Hidden mdUp>
                  <EditionsMobileView editions={editions} actions={actions} />
                </Hidden>}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        )}
      </UserService.WithApplicationMode>
    );
  }
}

export default EditionsList;