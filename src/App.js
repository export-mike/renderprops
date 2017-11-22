import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import {SharedStateProvider, WithSharedState, createSharedState} from './SharedState';
const Api = {
	login: data => new Promise(resolve => {
		setTimeout(() => resolve({token: '123'}), 2000);
	})
}
const sharedState = createSharedState({
	user: {
		username: 'mikejames',
		loggingIn: false,
		errorLoggingIn: false,
		token: null,
		login: async (data, update) => {
			try {
				update({ loggingIn: true });
				const {token} = await Api.login(data);
				return {loggingIn: false, token};
			} catch (e) {
				console.error(e);
				return {errorLoggingIn: true};
			}
		},
		logout: () => ({token: null})
	}
});

class App extends PureComponent {
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
						{({user}) => <div>
							{!user.token && <Login />}
							{user.token && <SayHi />}
						</div>}
					</WithSharedState>
				</SharedStateProvider>
      </div>
    );
  }
}

const Login = () =>
<WithSharedState
	selector={state => ({user: state.user})}
	actions={actions => ({login: actions.user.login})}>
	{({login, user}) => <div>
		{user.errorLoggingIn && <span>Error Logging In</span>}
		<button disable={!user.loggingIn} onClick={() => login()}>
			{user.loggingIn && <span>Please Wait...</span>}
			{!user.loggingIn && <span>Login!</span>}
		</button>
	</div>
	}
</WithSharedState>

const SayHi = () =>
<WithSharedState
	selector={state => ({user: state.user})}
	actions={actions => ({logout: actions.user.logout})}>
	{({user, logout}) =>
		<div>
			<span>Hi! {user.username}</span>
			<button onClick={() => logout()}>
				Logout
			</button>
		</div>
	}
</WithSharedState>
export default App;
