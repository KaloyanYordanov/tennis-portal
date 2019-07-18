import React from 'react';
import { withRouter } from 'react-router-dom';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { MuiThemeProvider } from '@material-ui/core/styles';

import AppRouting from './app.routing';
import SignIn from '../login/SignIn';
import Navigation from '../menu/Navigation';
import { catchEvent } from '../services/events.service';
import UserService from '../services/user.service';
import NavigationModel from '../menu/navigation.model';
import { ApplicationMode } from '../enums';
import theme from '../theme';
import './app.styles.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationMode: ApplicationMode.GUEST,
      currentRoute: 0
    }

    this.handleLoginTab = (event, index) => {
      this.setState({ index });
    };
  }

  setApplicationMode() {
    UserService.getAuthenticatedUser()
      .then(user => {
        let mode = ApplicationMode.GUEST
        if (user)
          mode = ApplicationMode.USER;

        if (user && user.isAdmin)
          mode = ApplicationMode.ADMIN;
        this.setState({ applicationMode: mode });
      });
  }

  componentDidMount() {
    document.body.classList.add('background');
    this.setApplicationMode();

    catchEvent('not-found', () => this.props.history.replace('/oops'));
    catchEvent('login', () => this.setApplicationMode());
    catchEvent('logout', () => {
      this.setState({
        applicationMode: ApplicationMode.GUEST
      });
      this.props.history.replace('/');
    });
    this.onRouteChanged(this.props.location);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.onRouteChanged(this.props.location);
    }
  }

  onRouteChanged(location) {
    var route = (NavigationModel.routes
      .find(route => location.pathname.indexOf(route.to) != -1)
      || NavigationModel.adminRoutes
        .find(route => location.pathname.indexOf(route.to) != -1));
    if (route)
      this.setState({ currentRoute: route.id });
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiThemeProvider theme={theme}>
          <UserService.SetApplicationMode value={this.state.applicationMode}>
            <NavigationModel.SetCurrentRoute value={this.state.currentRoute}>
              <div className="wrapper">
                <Navigation />
                {/* <Home /> */}
                <SignIn />
                <AppRouting />
              </div>
            </NavigationModel.SetCurrentRoute>
          </UserService.SetApplicationMode>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withRouter(App);