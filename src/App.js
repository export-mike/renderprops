import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SharedStateProvider, WithSharedState, createSharedState} from './SharedState';
const sharedState = createSharedState({
	user: {
		username: 'mikejames'
	}
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
				<SharedStateProvider state={sharedState}>
					<WithSharedState selector={state => ({user: state.user})}>
						{({user}) => <span>Hi! {user.username}</span>}
					</WithSharedState>
				</SharedStateProvider>
      </div>
    );
  }
}

export default App;
