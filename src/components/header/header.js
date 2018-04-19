import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import logo from '../../logo.svg';


class Header extends Component {
    render() {
        const authToken = localStorage.getItem('token');

        return (
            <header className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">
                                <img src={logo} alt=""/>
                            </a>
                        </div>

                    {authToken ? (
                        <div>
                            <ul className="navbar-nav nav navbar-right">
                                <li>
                                    <Link to="/" className="">
                                        Posts
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/addPost" className="">
                                        Add Post
                                    </Link>
                                </li>
                                <li
                                    className=""
                                    onClick={() => {
                                        localStorage.removeItem('token')
                                    }}
                                >
                                    <Link to="/" className="">
                                        Logout
                                    </Link>

                                </li>
                            </ul>
                        </div>

                    ) : (
                        <div>
                            <ul className="navbar-nav nav navbar-right">
                                <li>
                                    <Link to="/" className="">
                                        Posts
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/signup" className="">
                                        Sign Up
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className="">
                                        Login
                                    </Link>
                                </li>

                            </ul>
                        </div>
                    )}
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;
