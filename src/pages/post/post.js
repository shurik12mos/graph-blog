import React, {Component} from 'react'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import { FormGroup, FormControl } from 'react-bootstrap'

import Loading from '../../components/loading/loading'
import Messages from "../../components/messages/messages"
import { validateString } from '../../utils/validator'

class Post extends Component {
    constructor(props) {
        super(props);


        this.state = {
            comment: '',
            post: null,
            notification: null
        };

        this.addComment = this.addComment.bind(this);
    }

    componentWillReceiveProps(props) {
        const {loading, error, posts} = props.postQueryId;

        if (!loading && !error && posts) {
            const post = {...posts[0]};
            this.setState({post: post});
        }
    }

    addComment = async (e) => {
        const self = this;
        e.preventDefault();

        let {comment} = this.state;


        if (validateString(comment, {min: 1, max: 200}) !== 'success') {
            this.setState({
                notification: {
                    type: 'error',
                    text: 'Not valid comment'
                }
            });
            return;
        }

        let token = localStorage.getItem('token');

        if (!token ) {
            console.log('No user');
            this.props.history.push('/login');
            return;
        }

        const result = await this.props.addCommentMutation({
            variables: {
                post: this.props.match.params.id,
                content: this.state.comment
            },
            update: (proxy, {data: {createComment}}) => {

                try {
                    const data = proxy.readQuery({ query: POST_QUERY_ID, variables: {id: self.state.post.id} });

                    let postFind = data.posts.find((post) => {
                        return post.id === self.state.post.id;
                    });

                    postFind.comments.unshift(createComment);

                    proxy.writeQuery({query: POST_QUERY_ID, data});
                }catch (e) {
                    debugger;
                    console.log(e);

                }

                self.props.postQueryId.refetch({variables: this.state.post.id});

                self.setState({comment: ''});
            }
        });

        if (result.error) {
            console.log('error', result.error);
            return;
        }
    };


    render() {
        const authToken = localStorage.getItem('token');
        const { post } = this.state;
        const { loading, error } = this.props.postQueryId;

        if (loading) {
            return < Loading/>;
        }

        if (error) {
            return <div>Error</div>;
        }

        if (!post) {
            return <Loading/>;
        }

        let comments = [];

        if(post.comments && post.comments.length) {
           comments = post.comments.map((comment) => {
                return <li className="comment list-group-item" key={comment.id}>
                    <p>{comment.content}</p>
                    <div className="comment-info">
                        <p>Username: {comment.author.username}</p>
                        <p>Date: {(new Date(comment.timestamp)).toLocaleString()}</p>
                    </div>
                </li>
            });
        }


        return (
            <div className="main">

                {
                    this.state.notification ?
                        <Messages message={this.state.notification} />
                        : null
                }

                <div className="post">
                    <div className="post-header">
                        <h2>{post.title}</h2>
                        <small className="post-date">{(new Date(post.timestamp)).toLocaleString()}</small>
                    </div>

                    <p className="post-content">
                        {post.content}
                    </p>

                    <small className="post-author">Posted by {post.author.username}</small>
                </div>

                {authToken ?
                    <div className="add-comment">
                        <form onSubmit={this.addComment}>
                            <div className="form-group">
                                <FormGroup
                                    controlId="comment"
                                    validationState={validateString(this.state.password, {min: 1, max: 200})}
                                >
                                    <FormControl
                                        type="text"
                                        value={this.state.comment}
                                        placeholder="Enter your comment"
                                        onChange={(e) => this.setState({comment: e.target.value}) }
                                    />
                                    <FormControl.Feedback/>
                                </FormGroup>
                            </div>


                            {this.props.loading ? <Loading/> : (
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">Add Comment</button>
                                </div>
                            )}
                        </form>
                    </div>
                    :
                    <div className="add-comment"><b>You have to be logged in to add comment</b></div>
                }


                <div className="comments">
                    <h5>Comments</h5>
                    <ul className="list-group">
                        {comments}
                    </ul>
                </div>

            </div>

        )
    }


}


const ADD_COMMENT_MUTATION = gql`
  mutation AddCommentMutation($post: Int!, $content: String!) {
    createComment(post: $post, content: $content) {
      id      
      content
      author {
        id
        username
      }      
    }
  }
`;

const POST_QUERY_ID = gql`
  query PostQuery($id: ID!) {      
      posts(id: $id) {
        id
        author{
            id
            username
        }
        title
        content
        timestamp       
        comments {
          id          
          content
          author {
            id
            username
          }
          timestamp
        }
      }    
  }
`;

export default compose(
    graphql(ADD_COMMENT_MUTATION, {
        name: 'addCommentMutation',
        refetchQueries: [{
            query: POST_QUERY_ID,
            options: ownProps => {
                const id = ownProps.match.params.id;
                return {
                    variables: {id},
                }
            }
        }]
    }),
    graphql(POST_QUERY_ID, {
        name: 'postQueryId',
        options: ownProps => {
           const id = ownProps.match.params.id;
            return {
                variables: {id},
            }
        }
    })
)(Post)