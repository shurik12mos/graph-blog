import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import {Link} from 'react-router-dom'

import { Pager, FormGroup, FormControl } from 'react-bootstrap'

import Loading from '../../components/loading/loading'
import {validateString} from "../../utils/validator";


class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            limit: 20,
            search: '',
            searchInput: '',
            loadMore: true
        }

        this.getMorePosts = this.getMorePosts.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.searchPosts = this.searchPosts.bind(this);
    }

    getMorePosts(page, limit, search) {
        let self = this,
            skip = (page - 1)*limit;

        this.props.postQuery.fetchMore({
            variables: {
                skip: skip,
                first: limit,
                search: search
            },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                if(fetchMoreResult.posts.length < self.state.limit) {
                    self.setState({
                        loadMore: false
                    })
                }else {
                    self.setState({
                        loadMore: true
                    })
                }

                let posts;


                if (page === 1) {
                    posts = fetchMoreResult.posts;
                }else {
                    posts = [...previousResult.posts, ...fetchMoreResult.posts]
                }

                return {
                    ...previousResult,
                    // Add the new feed data to the end of the old feed data.
                    posts: posts,
                };
            },
        });
    }

    nextPage(e) {
        e.preventDefault();

        let {page, limit, search} = this.state;

        this.getMorePosts(page + 1, limit, search);

        this.setState({
            page: page + 1
        })
    }

    searchPosts(e) {
        e.preventDefault();
        let searchInput = this.state.searchInput;

        if(typeof searchInput !== 'string') return;

        this.setState({
            search: searchInput
        });

        this.getMorePosts(1, this.state.limit, searchInput);
    }

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
                <div className="main-header">
                    <h2>Posts list</h2>

                    <div className="search">
                        <form onSubmit={this.searchPosts}>

                            <div>
                                <FormGroup
                                    controlId="search"
                                    validationState={validateString(this.state.searchInput, {min: 1})}
                                >
                                    <FormControl
                                        type="text"
                                        value={this.state.searchInput}
                                        placeholder="Search..."
                                        onChange={(e) => this.setState({searchInput: e.target.value})}
                                    />
                                    <FormControl.Feedback/>
                                </FormGroup>
                            </div>
                        </form>
                    </div>
                </div>


                {
                    <ul className="posts-list list-group list-group-flush">
                        {posts}
                    </ul>
                }

                {
                    this.state.loadMore?
                        <Pager>
                            <Pager.Item href="#" onClick={this.nextPage}>Load More</Pager.Item>
                        </Pager>: null
                }

            </div>

        )
    }

}

export const POST_QUERY = gql`
  query PostQuery($first: Int!, $skip: Int!, $search: String) {      
      posts(first: $first, skip: $skip, search: $search) {
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
    options: (ownProps)=>{
        let first = ownProps.limit || 20,
            skip = ownProps.page?(ownProps.page - 1)*first: 0;

        return {
            variables: {
                skip: skip,
                first: first
        }}
    }

})(Main);

