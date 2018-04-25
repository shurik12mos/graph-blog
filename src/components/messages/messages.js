import React, {Component} from 'react'
import PropTypes from 'prop-types';

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: true,
            interval: null
        };

        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount(){
        this.addMessage();
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.message) {
            this.addMessage();
        }
    }

    addMessage() {
        let interval = setTimeout(()=>{
            clearTimeout(this.state.interval)
            this.setState({
                show: false,
                interval: null
            })
        }, 5000);

        this.setState({
            show: true,
            interval: interval
        });
    }

    handleClose() {
        let { interval } = this.state;

        clearTimeout(interval);
        this.setState({
            show: false,
            interval: null
        });
    }

    render() {
        if(!this.state.show) {
            return null;
        }

        let {type, message}  = this.props;

        return (
            <div className="messages-container">
                <div className={type === "error" ? 'alert alert-danger' : 'alert alert-success'}>
                    {message}
                    <button type="button" className="close" aria-label="Close" onClick={() => this.handleClose()}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        )
    }
}

Message.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string
};



export default Message;

