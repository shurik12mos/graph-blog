import React, {Component} from 'react'
import PropTypes from 'prop-types';

class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        };

        this.addMessage(this.props.message);

        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.message && !nextProps.message.interval) {
           this.addMessage(nextProps.message);
        }
    }

    addMessage(message){
        if (!message) return;

        let messages = [...this.state.messages];

        this.setState = {
            messages: [...messages, message]
        };

        message.interval = setTimeout(()=> {
            let messages = [...this.state.messages];

            if (messages.length) {
                messages.shift();
                this.setState({messages: messages});
            }
        }, 5000);
    }


    handleClose(index) {
        let messages = [...this.state.messages];

        if (messages.length) {
            clearTimeout(messages[index].interval);
            messages.splice(index, 1);
            this.setState({messages: messages});
        }
    }

    render() {

        let messages = this.state.messages.map((message, index) => {
            return (
                <div className={message.type === "error" ? 'alert alert-danger' : 'alert alert-success'} key={index}>
                    {message.text}
                    <button type="button" className="close" aria-label="Close" onClick={() => this.handleClose(index)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            );
        });


        return (
            <div className="messages-container">
                {messages}
            </div>
        )
    }
}



export default Messages;

