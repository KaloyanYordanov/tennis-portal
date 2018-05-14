import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import logo from './tennis-logo.svg';

export class Menu extends Component {
  links = [
    { path: '/tournaments', name: 'Tурнири' },
    { path: '/editions', name: 'Издания' },
    { path: '/schemes', name: 'Схеми' },
    { path: '/login', name: 'Вход' },
    { path: '/register', name: 'Рег' }
  ]
  constructor(props) {
    super(props);
    this.state = {
      active: props.defaultState
    };
  }

  getMenuElement(link) {
    return (
      <li key={link.path} className={this.GetActiveClass(link.path)}>
        <Link to={link.path} onClick={() => this.setState({ active: link.path })}>
          {link.name}
        </Link>
      </li>
    );
  }

  render() {
    return <div id='menu'>
      <img src={logo} className="logo" alt="logo" />
      <ul>{this.links.map(link => this.getMenuElement(link))}</ul>
    </div>
  }

  GetActiveClass(path) {
    return this.state.active === path ? 'active' : '';
  }
}