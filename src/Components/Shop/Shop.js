import React from "react";
import Navbar from "../Layout/Navbar";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Col, Row, Spin, Button, Drawer, Form, TimePicker, List, Tabs, Affix} from "antd";
import moment from "moment";
import {updateWorkingHours} from "../../Store/Actions/shop";
import "./shop.css"
import ShopItems from "./ShopItems";
import ShopReviews from "./ShopReviews";
import EditShop from "./EditShop";
const timeFormat = 'HH:mm';
const { RangePicker } = TimePicker;
const { TabPane } = Tabs;

class Shop extends React.Component {

    state = {
        hoursVisible: false,
        branchesVisible: false,
        contactsVisible: false
    };



    onClose = () => {
        this.setState({
            hoursVisible: false
        })
    };

    updateWorkingHours = values => {
        let hours = {};
        Object.entries(values).forEach(day => {
            if(day[1]){
                hours[day[0]] = {
                    start: new Date(day[1][0]).getHours()*3600 + new Date(day[1][0]).getMinutes()*60,
                    end: new Date(day[1][1]).getHours()*3600 + new Date(day[1][1]).getMinutes()*60
                }
            }
        });
        updateWorkingHours(this.props.shop.id, hours, () => {
            this.setState({
                hoursVisible: false
            })
        });
    };



    render() {
        const { shop } = this.props;
        const { hoursVisible } = this.state;
        const today = ["sunday","monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][new Date().getDay()];

        if(!shop) {
            return <Spin />
        }
        return(
            <div>
                <div>
                    <Navbar current={"shops"}/>
                    <div className="uk-container uk-margin-top">
                        <Row gutter={12}>
                            <Col span={6}>
                                <div>
                                    <div className="uk-inline uk-width-1-1">
                                        <div>
                                            <img className={"uk-width-1-1 uk-border-rounded"} src={shop.logo} alt=""/>
                                        </div>
                                    </div>
                                    <div className="uk-padding-small uk-padding-remove-horizontal">
                                        <h3 className="uk-h3 uk-margin-remove">
                                            { shop.title }
                                        </h3>
                                        <small className="uk-text-small">
                                            { moment(new Date()).format("dddd, MMM Do")},
                                            <span> { shop.working_hours && shop.working_hours[today.substring(0, 3)] ?
                                                <span>
                                                    { moment(shop.working_hours[today.substring(0, 3)].start*1000).zone("-06:00").format(timeFormat) } - { moment(shop.working_hours[today.substring(0, 3)].end*1000).zone("-06:00").format(timeFormat) }
                                                </span>
                                                : "00:00 - 00:00"}
                                            </span>

                                        </small>
                                    </div>
                                    <div>
                                        <div>
                                            <hr />
                                            <Row className="uk-margin-bottom">
                                                <Col span={12}>
                                                    <h5 className="uk-header-bold uk-margin-remove">
                                                        BRANCHES
                                                    </h5>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="uk-align-right uk-margin-remove">
                                                        <Button onClick={() => this.setState({ hoursVisible: true })} uk-tooltip="title: Edit working hours" size="small" type="default" htmlType="button" tabIndex="-1">
                                                            <span uk-icon="pencil" />
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Drawer
                                                title="Edit working hours"
                                                width={500}
                                                onClose={this.onClose}
                                                visible={hoursVisible}
                                                bodyStyle={{ paddingBottom: 80 }}
                                            >
                                                <Form layout="vertical" hideRequiredMark onFinish={this.updateWorkingHours}>
                                                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                                                        <Row>
                                                            <Col span={12}>
                                                                <div>
                                                                    <h6 className="uk-text-uppercase uk-margin-remove">
                                                                        {day}
                                                                    </h6>
                                                                </div>
                                                            </Col>
                                                            <Col span={12}>
                                                                <div className="uk-align-right">
                                                                    <Form.Item name={day.substring(0, 3)}>
                                                                        <RangePicker format={timeFormat} />
                                                                    </Form.Item>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                    <Form.Item>
                                                        <Button type="primary" htmlType="submit">
                                                            Submit
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </Drawer>


                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={18}>
                                <img className={"uk-width-1-1 uk-border-rounded"} src={shop.background} />

                                <div className="shop-container uk-margin-top">
                                    <Tabs type="card">
                                        <TabPane tab="ShopItems" key="1">
                                            <div className="donations uk-padding-small">
                                                <ShopItems shop={shop} />
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Reviews" key="2">
                                            <div className="donations uk-padding-small">
                                                <ShopReviews shop={shop} />
                                            </div>
                                        </TabPane>
                                        <TabPane tab="Edit" key="3">
                                            <div className="donations uk-padding-small">
                                                <h3 className="uk-h3">
                                                    <EditShop shop={shop} />
                                                </h3>
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state, props) => {


    return {
        auth: state.firebase.auth,
        shop: state.firestore.ordered.shops ? state.firestore.ordered.shops[0] : null
    }
}

const enhance = compose(
    firestoreConnect((props) => [
        { collection: "shops", doc: props.match.params.id }
    ]),
    connect(mapStateToProps)
);
export default enhance(Shop);
