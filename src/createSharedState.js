const isFunction = t => typeof(t) === 'function';
const isObject = t => typeof(t) === 'object';

export function createState(state) {
  const stateCreated = Object.keys(state).reduce((acc, key) => {
    if (!state[key]) return acc;
    if (isFunction(state[key])) return acc;
		if (isObject(state[key])) return {...acc, [key]: createState(state[key])}
		return {...acc, [key]: state[key]};
  }, {});

  return stateCreated;
}

export function createActions(state) {
  const stateCreated = Object.keys(state).reduce((acc, key) => {
    if (!state[key]) return acc;
		if (isObject(state[key])) return {...acc, [key]: createActions(state[key])}
		if (!isFunction(state[key])) return acc;
		return {...acc, [key]: state[key]};
  }, {});

  return stateCreated;
}

export default state => {
	return {
		state: createState(state),
		actions: createActions(state)
	}
}
