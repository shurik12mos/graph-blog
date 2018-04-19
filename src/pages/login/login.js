import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Loading from '../../components/loading/loading'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        let { username, password } = this.state;


        if (!username || !password) {
            console.log('Not valid ', this.state);
            return;
        }

        const result = await this.props.loginMutation({
            variables: {
                username: this.state.username,
                password: this.state.password
            }
        });

        if (result.error) {
            console.log('error', result.error);
            return;
        }


        const { token } = result.data.tokenAuth;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        this.props.history.push('/');
    }

    render() {

        return (
            <div className="flex pa1 justify-between nowrap orange">
                <form onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <FormGroup
                            controlId="email"

                        >
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.username}
                                placeholder="Enter username"
                                onChange={(e) => this.setState({username: e.target.value}) }
                            />
                            <FormControl.Feedback />
                        </FormGroup>


                    </div>

                    <div className="form-group">
                        <FormGroup
                            controlId="password"
                        >
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                type="password"
                                value={this.state.password}
                                placeholder="Enter password"
                                onChange={(e) => this.setState({password: e.target.value})}
                            />
                            <FormControl.Feedback />
                        </FormGroup>
                    </div>

                    {this.props.loading? <Loading/>: (
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    )}
                </form>
            </div>
        )
    }
}

const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {      
      token
    }
  }
`

export default graphql(LOGIN_MUTATION, { name: 'loginMutation' })(Login)

