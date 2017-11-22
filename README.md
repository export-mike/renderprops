# *** WORK IN PROGRESS ***

#React Render Props
Utility Library for Render Prop Components


```js
import WithRequest from 'renderprops/WithRequest';

const fetchUsers = () => Api.users();

export default () => <ul>
              <WithRequest
                fetch={fetchUsers}
                prop="users"
                initialValue={[]}
              >
                {({users}) => users.map(user => <li>
                  {user.username} {user.email}
                </li>)}
              </WithRequest>
            </ul>
```

```js
import WithState from 'renderprops/WithState';

export default () => <WithState value={0} prop="counter" fn="setCounter">
  {({counter, setCounter}) => <div>
    <a onClick={() => setCounter(v => v+1)}>Increment +</a>
    <a onClick={() => setCounter(v => v-1)}>Decrement -</a>
    <div>Value {counter}</div>
  </div>}
</div>
```

```js

import {SharedStateProvider, WithSharedState } from 'renderprops/SharedState';
import { user, books } from './sharedstate';

class App extends React.Component {
  render() {
    return <SharedStateProvider shared={{user, books}}>
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
    </SharedStateProvider>
  }
}

const Home = () => <WithSharedState selector={state => ({user: state.user})}>
  {({user}) => {
    if (!user) {
      return <Redirect to="/login"/>
    }
    return <div>
      Hi! {user.firstName} {user.lastName}
    </div>
  }}
</WithSharedState>

const Login = () =>
  <WithSharedState
    action={actions => ({login: actions.user.login})}>
    {({login}) => <Formzy>
      {({fields, isFormValid, submitting, submit}) =>
        <form onSubmit={submit(data => login(data))}>
          <input type={'text'} value={fields.username.value} onChange={fields.username.onChange} />
          <input type={'text'} value={fields.password.value} onChange={fields.password.onChange} />
          <input type="submit" value="Login"/>
        </form>
      }
    </Formzy>}
  </WithSharedState>

export default sharedState({
  user: {
    username: '',
    password: '',
    token: '',
    login: data => Api.login(data),
    createUserAndLogin = async data => {
      await Api.create(data);
      return await Api.login(data);
    }
  },
  books: {
    books: [],
    getBooks: async data => {
      const books = await Api.getBooks(data);
      return {books};
    }
  }    
})
```
