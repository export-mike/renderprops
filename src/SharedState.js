import {PureComponent} from 'react';
import PropTypes from 'prop-types';
export {default as createSharedState} from './createSharedState';

export class SharedStateProvider extends PureComponent {
	static childContextTypes = {
		sharedState: PropTypes.object
	}
  constructor(props) {
    super(props);
    this.state = props.state.state;
		this.actions = this.wrapActions(props.state.actions);
		this.subscribers = [];
  }
  getChildContext() {
    return {
			sharedState: {
				getState: this.getState,
				setState: this.setState,
				getActions: this.getActions,
				onChange: this.registerSubscriber
			}
		};
  }
	registerSubscriber = (fn) => {
		this.subscribers = [...this.subscribers, fn];
		return () => this.subscribers.filter(f => f !== fn);
	}
	onChange = () => {
		this.subscribers.forEach(fn => fn());
	}
	getState = () => this.state;
	getActions = () => this.actions;
	wrapActions = actions => {
		return Object.keys(actions).reduce((acc,key) => {
			return {...acc, [key]: this.createActionsForScope(actions[key], key)};
		}, {});
	}
	createActionsForScope = (actions, scope) => {
		return Object.keys(actions).reduce((acc,key) => {
			return {...acc, [key]: this.createAction(actions[key], scope)};
		}, {});
	}
	createAction = (fn, scope) => {
		return async (...args) => {
			try {
				const res = await fn.apply(this, [...args, this.getState]);
				this.setState({
					...this.state,
					[scope]: {
						...this.state[scope],
						...res
					}
				}, () => this.onChange());
			} catch (e) {
				console.error(e);
				throw (e);
			}
		}
	}
	render() {
		return this.props.children;
	}
}

export class WithSharedState extends PureComponent {
	static contextTypes = {
		sharedState: PropTypes.object
	}
	static defaultProps = {
		actions: () => ({}),
		selector: () => ({})
	}
	componentWillMount(){
		this.subscription = this.context.sharedState.onChange(() => {
			const state = this.context.sharedState.getState();
			const scopedState = this.props.selector(state);
			if (this._scopedState !== scopedState) {
				this.forceUpdate();
			}
		});
	}
	componentWillUnmount() {
		this.subscription();
	}
	render() {
		const action = this.props.actions(this.context.sharedState.getActions());
		const state = this.props.selector(this.context.sharedState.getState());
		return this.props.children({...state, ...action});
	}
}
