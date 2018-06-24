import React from 'react';
import { get } from '../../services/fetch';

export class BracketDrawForm extends React.Component {
  draw() {
    get(`/schemes/${this.props.draw.schemeId}/draw?seed=${this.state.seed}`)
      .then(draw => this.props.onChange(draw));
  }

  render() {
    if (this.props.draw && !this.props.draw.isDrawn)
      return (
        <div>
          <div className="input-group"><i>Схемата не е изтеглена</i></div>
          <div className="input-group">
            <div>Брой поставени играчи</div>
            <input className="inline" type="number" onChange={(e) => this.setState({ seed: e.target.value })} />
          </div>
          <span className="button" onClick={() => this.draw()} >изтегляне</span>
        </div>
      );
    else
      return null;
  }
}