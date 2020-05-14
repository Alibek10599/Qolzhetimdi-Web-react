import { Comment, Form, List, Input, Button, Rate } from 'antd';
import moment from 'moment';
import React from "react";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {createReply} from "../../Store/Actions/shop";
const { TextArea } = Input;

const Editor = ({ onSubmit }) => (
    <div>
        <Form onFinish={onSubmit}>
            <Form.Item name="body" rules={[{ required: true }]}>
                <TextArea rows={3} />
            </Form.Item>
            <Form.Item>
                <Button size="small" htmlType="submit" onClick={onSubmit} type="primary">
                    Reply
                </Button>
            </Form.Item>
        </Form>

    </div>
);

class ShopReviews extends React.Component {


    state = {
        id: null
    };

    onSubmit = values => {
        if(values.body){
            createReply(this.props.shop.id, this.state.id, values.body, res => {
                this.setState({ id: null })
            });
        }
    };

    render() {
        const { id } = this.state;
        const { reviews, shop } = this.props;
        const data = reviews.map(review => {
            return {
                actions: !review.reply ? [
                    <span
                        onClick={ () => this.setState({ id: review.id===id ? null :review.id })}
                        key="comment-list-reply-to-0">
                        {review.id===id ? "Cancel reply" : "Reply"}
                    </span>
                ] : [],
                author: <span className="uk-text-emphasis">{review.author.name} <Rate className="small-rate" disabled defaultValue={review.rating} /></span>,
                avatar: review.author.avatar,
                content: (
                    <div>
                        <div>
                            <p>
                                { review.body }
                            </p>
                        </div>
                        { id === review.id ?
                            <Editor onSubmit={this.onSubmit} />
                        : null }
                    </div>
                ),
                datetime: (
                    <span>
                      { moment(review.date.seconds*1000).fromNow() }
                    </span>
                ),
                reply: review.reply ? <Comment
                    avatar={shop.logo}
                    author={<span className="uk-text-emphasis">{ shop.title } <span className="fas fa-check-circle uk-text-primary" /> </span> }
                    content={<p>{ review.reply.body }</p>}
                    datetime={<span>{ moment(review.reply.date.seconds*1000).fromNow() }</span>}
                /> : null
            }
        })

        return (
            <div>
                <div className="uk-margin-bottom">
                    <div>
                        <h3 className="uk-h3 uk-margin-remove">
                            Shop review
                        </h3>
                        <p className="uk-text-small uk-margin-remove">
                            { reviews.length} reviews
                        </p>
                    </div>
                </div>
                <List
                    className="comment-list"
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <li>
                            <Comment
                                actions={item.actions}
                                author={item.author}
                                avatar={item.avatar}
                                content={item.content}
                                datetime={item.datetime}
                            >
                                { item.reply }
                            </Comment>
                        </li>
                    )}
                />
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {

    return {
        auth: state.firebase.auth,
        reviews: state.firestore.ordered.reviews ? state.firestore.ordered.reviews : [],
        ...props
    }
}

const enhance = compose(
    firestoreConnect(props => [
        { collection: "shops/" + props.shop.id + "/reviews", storeAs: "reviews" }
    ]),
    connect(mapStateToProps)
);
export default enhance(ShopReviews);
