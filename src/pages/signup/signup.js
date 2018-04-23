import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Loading from '../../components/loading/loading'
import Messages from "../../components/messages/messages";
import { validateString } from '../../utils/validator';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            notification: null
        };

       this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        console.log('this ', this);

        let { email, password, username } = this.state;


        if (validateString(username, {min: 3, max: 20}) !== 'success') {
            this.setState({
                notification: {
                    type: 'error',
                    text: 'Not valid username'
                }
            });
            return;
        }

        if (validateString(password, {min: 3, max: 20}) !== 'success') {
            this.setState({
                notification: {
                    type: 'error',
                    text: 'Not valid password'
                }
            });
            return;
        }

        if (validateString(email, {min: 3, max: 50, regexp: '.*@\\w*\\.\\w*'}) !== 'success') {
            this.setState({
                notification: {
                    type: 'error',
                    text: 'Not valid email'
                }
            });
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

                {
                    this.state.notification ?
                        <Messages message={this.state.notification} />
                        : null
                }

                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <FormGroup
                            controlId="username"
                            validationState={validateString(this.state.username, {min: 3, max: 20})}
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
                            validationState={validateString(this.state.email, {min: 3, max: 20, regexp: '.*@\\w*\\.\\w*'})}
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
                            validationState={validateString(this.state.password, {min: 3, max: 20})}
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

