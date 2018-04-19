import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import { POST_QUERY } from '../main/index';

import Loading from '../../components/loading/loading'


class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: ''
        };

        this.addPost = this.addPost.bind(this);
    }

    addPost = async(e) => {
        e.preventDefault();

        let { title, content } = this.state;


        if (!title || !content) {
            console.log('Not valid ', this.state);
            return;
        }

        let token = localStorage.getItem('token');

        if (!token) {
            console.log('No user');
            this.props.history.push('/login');
            return;
        }

        const result = await this.props.addPostMutation({
            variables: {
                title: title,
                content: content
            },
            update: (proxy, {data: { createPost }}) => {
                try {
                    const data = proxy.readQuery({query:  POST_QUERY });

                    data.posts.unshift(createPost);

                    proxy.writeQuery({query: POST_QUERY, data});
                }catch(e) {
                    console.log('e ', e);
                }

            }
        });

        if (result.error) {
            console.log('error', result.error);
            return;
        }

        this.props.history.push('/')
    };


    render() {

        return (
            <div className="add-post-wrapper">
                <h2>Add Post</h2>

                <div className="add-post">
                    <form onSubmit={this.addPost}>
                        <div className="form-group">
                            <FormGroup
                                controlId="title"
                            >
                                <ControlLabel>Title</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.title}
                                    placeholder="Enter title"
                                    onChange={(e) => this.setState({title: e.target.value}) }
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </div>

                        <div className="form-group">
                            <FormGroup
                                controlId="conent"
                            >
                                <ControlLabel>Content</ControlLabel>
                                <FormControl
                                    type="textarea"
                                    value={this.state.content}
                                    placeholder="Enter post text"
                                    onChange={(e) => this.setState({content: e.target.value}) }
                                />
                                <FormControl.Feedback />
                            </FormGroup>
                        </div>

                        {this.props.loading? <Loading/>: (
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary">Add Post</button>
                            </div>
                        )}
                    </form>
                </div>

            </div>

        )
    }


}

const ADD_POST_MUTATION = gql`
  mutation AddPostMutation($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
      author {
        id
        username
      } 
    }
  }
`;

export default graphql(ADD_POST_MUTATION, {
    name: 'addPostMutation'
})(AddPost)

