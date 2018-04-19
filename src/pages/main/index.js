import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {Link} from 'react-router-dom'

import Loading from '../../components/loading/loading'


class Main extends Component {

    render() {
        if (this.props.postQuery && this.props.postQuery.loading) {
            return < Loading/>;
        }

        if (this.props.postQuery && this.props.postQuery.error) {
            return <div className="center-block">
                <p className="text-warning">Error</p>
            </div>
        }


        const posts = this.props.postQuery.posts.map((post) => {
            return <li key={post.id} className="post list-group-item list-group-item-action">
                <div className="post-header">
                    <Link to={{
                        pathname: "/posts/" + post.id,
                        state: {post: post}
                    }
                    }
                          key={post.id}
                          post={post}
                          className="">
                        <h5 className="">{post.title}</h5>
                    </Link>
                    <small className="post-date">{(new Date(post.timestamp)).toLocaleString()}</small>
                </div>
                <p className="post-content">
                    {post.content}
                </p>

                <small className="post-author">Posted by {post.author.username}</small>
            </li>
        });

        return (
            <div className="main">
                <h2>Posts list</h2>

                {
                    <ul className="posts-list list-group list-group-flush">
                        {posts}
                    </ul>
                }
            </div>

        )
    }


}

export const POST_QUERY = gql`
  query PostQuery {      
      posts {
        id
        author{
            id
            username
        }
        title
        content
        timestamp       
        
      }    
  }
`;

export default graphql(POST_QUERY, {
    name: 'postQuery',
    options: ownProps => {
        const id = ownProps.match.params.id !== undefined? ownProps.match.params.id: null;
        return {
            variables: {id},
        }
    }
})(Main)

