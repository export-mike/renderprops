import {createState, createActions} from './createSharedState'

test('Filter functions', () => {
	const state = {
		user: {
			firstName: 'bob',
			email: 'test@test.com',
			age: 24,
			login: data => console.log(data)
		}
	};

	expect(createState(state)).toEqual({
		user: {
			firstName: 'bob',
			email: 'test@test.com',
			age: 24
		}
	});
});


test('Filter non functions', () => {
	const login = data => console.log(data);
	const state = {
		user: {
			firstName: 'bob',
			email: 'test@test.com',
			age: 24,
			login
		}
	};

	expect(createActions(state)).toEqual({
		user: {
			login
		}
	});
});
