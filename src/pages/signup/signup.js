import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Loading from '../../components/loading/loading'

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        let { email, password, username } = this.state;


        if (!email || !password || !username) {
            console.log('Not valid ', this.state);
            return;
        }

        const result = await this.props.signupMutation({
            variables: {
                email: this.state.email,
                password: this.state.password,
                username: this.state.username
            }
        });

        if (result.error) {
            console.log('error', result.error);
            return;
        }

       // const { token } = result.data.login;
        //localStorage.setItem('token', token);

        this.props.history.push('/login');
    }

    render() {

        return (
            <div className="flex pa1 justify-between nowrap orange">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <FormGroup
                            controlId="username"
                        >
                            <ControlLabel>Username</ControlLabel>
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
                            controlId="email"
                        >
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                type="email"
                                value={this.state.email}
                                placeholder="Enter email"
                                onChange={(e) => this.setState({email: e.target.value}) }
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
                                onChange={(e) => this.setState({password: e.target.value}) }
                            />
                            <FormControl.Feedback />
                        </FormGroup>
                    </div>

                    {this.props.loading? <Loading/>: (
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Sign Up</button>
                        </div>
                    )}
                </form>
            </div>
        )
    }
}

const SIGNUP_MUTATION = gql`
  mutation CreateUser($email: String!, $password: String!, $username: String!) {
    createUser(email: $email, password: $password, username: $username) {
      user{
        username
        email
      }
    }
  }
`

export default graphql(SIGNUP_MUTATION, { name: 'signupMutation' })(Signup)

