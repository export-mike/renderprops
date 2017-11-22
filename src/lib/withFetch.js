import React, {PureComponent} from 'react';

export default class WithFetch extends React.Component {
  static defaultProps = {
    fetch: () => {},
    prop: 'data',
    LoadingComponent: null,
    children: () => null
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errorLoading: false,
      [props.prop]: props.initialValue
    }
  }
  componentWillMount() {
    this.fetch();
  }
  fetch = async () => {
    try {
      this.setState({
        ...this.state,
        loading: true,
        errorLoading: false
      });
      const result = await this.props.fetch();
      this.setState({
        ...this.state,
        loading: false,
        [this.props.prop]: result
      });
    } catch (e) {
      this.setState({
        ...this.state,
        errorLoading: true,
        loading: false
      });
      console.error(e);
    }
  }
  render() {
    const render = this.props.render || this.props.children;
    const children = render(this.state) || null;
    if (this.props.LoadingComponent) {
      return <this.props.LoadingComponent error={this.state.errorLoading} loading={this.state.loading}>
        {children}
      </this.props.LoadingComponent>
    }
    return children
  }
}
