import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap'

import Loading from '../../components/loading/loading'
import Messages from "../../components/messages/messages";
import { validateString } from '../../utils/validator';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            notification: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        let {username, password} = this.state;

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

        try {
            const result = await this.props.loginMutation({
                variables: {
                    username: this.state.username,
                    password: this.state.password
                }
            });

            if (result.error) {
                console.log('error', result.error);
                this.setState({
                    notification: {
                        type: 'error',
                        text: result.error.message
                    }
                });
                return;
            }else {
                this.setState({
                    notification: null
                });
            }

            const {token} = result.data.tokenAuth;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);

            this.props.history.push('/');
        } catch (err) {
            console.log('error ', err);
            this.setState({
                notification: {
                    type: 'error',
                    text: err.message || 'Error'
                }
            });
        }

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
                                onChange={(e) => this.setState({username: e.target.value})}
                            />
                            <FormControl.Feedback/>
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
                                onChange={(e) => this.setState({password: e.target.value})}
                            />
                            <FormControl.Feedback/>
                        </FormGroup>
                    </div>

                    {this.props.loading ? <Loading/> : (
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

export default graphql(LOGIN_MUTATION, {name: 'loginMutation'})(Login)

