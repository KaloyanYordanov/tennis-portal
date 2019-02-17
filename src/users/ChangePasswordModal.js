import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import QueryService from '../services/query.service';
import FormModal from '../components/FormModal';

class ChangePasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      errors: null
    };

    this.handleChange = (prop) => (event) => {
      const state = this.state;
      state[prop] = event.target.value;
      this.setState(state);
    }
  }

  save() {
    return QueryService
      .post('/users/changePassword', this.state)
      .then(() => this.props.onClose())
      .catch(err => this.setState({ errors: err }));
  }

  render() {
    const { currentPassword, newPassword, confirmNewPassword } = this.state;
    const { onClose } = this.props;

    const title = 'Промяна на парола';
    const actions = <React.Fragment>
      <Button variant="contained" color="primary" onClick={() => this.save()}>Запис</Button>
      <Button variant="outlined" color="primary" onClick={onClose}>Отказ</Button>
    </React.Fragment>;
    const body = <React.Fragment>
      <TextField
        fullWidth
        label="Текуща парола"
        value={currentPassword}
        onChange={this.handleChange('currentPassword')}
      />
      <TextField
        fullWidth
        label="Нова парола"
        value={newPassword}
        onChange={this.handleChange('newPassword')}
      />
      <TextField
        fullWidth
        label="Повтори новата парола"
        value={confirmNewPassword}
        onChange={this.handleChange('confirmNewPassword')}
      />
    </React.Fragment>;

    return (
      <FormModal onClose={onClose} title={title} body={body} actions={actions} />
    );
  }
}

export default ChangePasswordModal;