import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router';

import './App.css';
import Header from "./components/header/header";
import Main from "./pages/main";
import Login from './pages/login/login'
import Signup from './pages/signup/signup'
import Post from './pages/post/post'
import AddPost from './pages/addPost/addPost'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>

                <div className="container">
                    <div className="row">
                        <Switch>
                            <Route exact path='/' component={Main}/>
                            <Route exact path='/signup' component={Signup}/>
                            <Route exact path='/login' component={Login}/>
                            <Route exact path='/posts/:id' component={Post}/>
                            <Route exact path='/addPost' render={(props) => {
                                let token = localStorage.getItem('token');
                                if (token) {
                                    return <AddPost {...props}/>
                                } else {
                                    return <Redirect to="/login"/>
                                }
                            }}
                            />
                            <Route component={Main}/>
                        </Switch>
                    </div>
                </div>

            </div>
        );
    }
}


export default App;
