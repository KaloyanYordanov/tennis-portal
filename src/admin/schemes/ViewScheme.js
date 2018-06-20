import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../services/fetch';
import { Status } from '../Infrastructure';

export class ViewScheme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TournamentEdition: {
        Tournament: {}
      },
      enrollments: [],
      queue: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    Promise.all([
      get(`/schemes/${this.props.match.params.id}`),
      get(`/schemes/${this.props.match.params.id}/enrollments`),
      get(`/schemes/${this.props.match.params.id}/queue`)
    ]).then(([scheme, enrollments, queue]) => {
      scheme.enrollments = enrollments;
      scheme.queue = queue;
      console.log(scheme);
      return this.setState(scheme);
    });
  }

  publish() {
    get(`/schemes/${this.state.id}/publish`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  draft() {
    get(`/schemes/${this.state.id}/draft`)
      .then(() => {
        this.getData();
        this.props.onChange();
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <table className="list-table">
            <thead>
              <tr>
                <th>
                  <span>{this.state.name}</span>
                  <Status status={this.state.status} />
                  {this.buttons()}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="labels"><b>Турнир</b></td>
                        <td>
                          <Link to={`/tournaments/view/${this.state.TournamentEdition.Tournament.id}`}>
                            {this.state.TournamentEdition.Tournament.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Издание</b></td>
                        <td>
                          <Link to={`/editions/view/${this.state.TournamentEdition.id}`}>
                            {this.state.TournamentEdition.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Информация</b></td><td>{this.state.info}</td>
                      </tr>
                      <tr>
                        <td><b>Дата</b></td><td>{dateString(this.state.date, true)}</td>
                      </tr>
                      <tr>
                        <td><b>Ограничения</b></td><td>{this.getSchemeLimitations()}</td>
                      </tr>
                      <tr>
                        <td><b>Брой играчи</b></td><td>{this.state.maxPlayerCount}</td>
                      </tr>
                      <tr>
                        <td><b>Записване</b></td>
                        <td>
                          от {dateString(this.state.registrationStart)} до {dateString(this.state.registrationEnd)}
                        </td>
                      </tr>
                      <tr>
                        <td><b>Тип на схемата</b></td>
                        <td>
                          {this.state.schemeType == 'elimination' ? 'елиминации' : 'групова фаза'}
                        </td>
                      </tr>
                      {this.state.schemeType == 'elimination' ?
                        <tr>
                          <td><b>Групова фаза</b></td>
                          <td>
                            {this.state.hasGroupPhase ? 'има групова фаза' : 'няма групова фаза'}
                          </td>
                        </tr> : null}
                      {this.state.schemeType == 'round-robin' ?
                        <React.Fragment>
                          <tr>
                            <td><b>Брой групи</b></td>
                            <td>{this.state.groupCount}</td>
                          </tr>
                          <tr>
                            <td><b>Брой играчи в група</b></td>
                            <td>{this.state.teamsPerGroup}</td>
                          </tr>
                        </React.Fragment> : null}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Enrollments enrollments={this.state.enrollments} />
        <Queue queue={this.state.queue} />
      </React.Fragment>
    );
  }

  getSchemeLimitations() {
    const limitations = [];
    if (this.state.singleTeams)
      limitations.push('единични отбори');
    else
      limitations.push('двойки');
    if (this.state.maleTeams)
      limitations.push('мъжки отбори');
    if (this.state.femaleTeams)
      limitations.push('женски отбори');
    if (this.state.mixedTeams)
      limitations.push('смесени двойки');
    if (this.state.ageFrom && this.state.ageTo)
      limitations.push('от ' + this.state.ageFrom + ' до ' + this.state.ageTo + ' години');
    else if (this.state.ageFrom)
      limitations.push('от ' + this.state.ageFrom + ' години');
    else if (this.state.ageTo)
      limitations.push('до ' + this.state.ageTo + ' години');

    return limitations.join(', ');
  }

  buttons() {
    return (
      <span className="button-group">
        {this.state.status === 'draft' ? <span className="button" onClick={() => this.publish()}>Публикуване</span> : null}
        {this.state.status === 'draft' ? <span className="button"><Link to={`/schemes/edit/${this.state.id}`}>Промяна</Link></span> : null}
        {this.state.status === 'published' ? <span className="button" onClick={() => this.draft()}>Връщане в чернова</span> : null}
        {/* {
          <div className="dropdown">
            <span className="button" onClick={() => this.setState({ showDrawScheme: !this.state.showDrawScheme })}>Изтегляне на схема</span>
            {this.state.showDrawScheme ?
              <div className="dropdown-content">
                <div className="input-group">
                  <div style={{ "width": "100%" }}>Позиционирани играчи</div>
                  <input type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
                </div>
                <div className="button center" onClick={() => null}>Изтегли</div>
              </div>
              : null}
          </div>
        } */}
      </span>
    );
  }
}

function dateString(str, noTime = false) {
  let date = new Date(str);
  return noTime ? date.toLocaleDateString() : date.toLocaleString();
}

export class Enrollments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10
    }
  }
  render() {
    return (
      <div className="container">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Записани играчи</span>
              </th>
              <th className="text-right">
                Точки
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.enrollments.slice(0, this.state.limit).map((e, i) => (
              <tr key={e.id}>
                <td>
                  <span>{(i + 1) + '.'}</span><Link to={`/editions/view/${e.id}`} >{e.name}</Link>
                </td>
                <td className="text-right">
                  {e.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.props.enrollments.length == 0 ? <div><i>Няма записани играчи</i></div> : null}
        {this.state.limit != this.props.enrollments.length && this.props.enrollments.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: this.props.enrollments.length })}>
              покажи всичко
              </a>
          </div> : null}
        {this.state.limit == this.props.enrollments.length && this.props.enrollments.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: 10 })}>
              скрий
              </a>
          </div> : null}
      </div>
    );
  }
}

export class Queue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10
    }
  }

  render() {
    return (
      <div className="container">
        <table className="list-table">
          <thead>
            <tr>
              <th>
                <span>Опашка</span>
              </th>
              <th className="text-right">
                Точки
              </th>
            </tr>
          </thead>
          <tbody>
            {this.props.queue.slice(0, this.state.limit).map((e, i) => (
              <tr key={e.id}>
                <td>
                  <span>{(i + 1) + '.'}</span><Link to={`/editions/view/${e.id}`} >{e.name}</Link>
                </td>
                <td className="text-right">
                  {e.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.props.queue.length == 0 ? <div><i>Няма записани играчи в опашка</i></div> : null}
        {this.state.limit != this.props.queue.length && this.props.queue.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: this.props.queue.length })}>
              покажи всичко
              </a>
          </div> : null}
        {this.state.limit == this.props.queue.length && this.props.queue.length > 0 ?
          <div className="center">
            <a className="link" onClick={() => this.setState({ limit: 10 })}>
              скрий
              </a>
          </div> : null}
      </div>
    );
  }
}