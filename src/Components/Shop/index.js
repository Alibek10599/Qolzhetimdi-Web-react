import React from "react";
import Navbar from "../Layout/Navbar";
import {Typography, Col, Row} from "antd";
import {compose} from "redux";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {Link} from "react-router-dom";



class Shops extends React.Component {


    render() {
        const { shops } = this.props;

        return (
            <div>
                <div>
                    <Navbar current="shops"/>

                    <div className="uk-container">
                        <div className="uk-margin-top uk-margin-bottom">
                            <Row className={"uk-width-1-1"}>
                                <Col span={20}>
                                    <div>
                                        <h3 className="uk-h3 uk-margin-remove">
                                            Shops
                                        </h3>
                                        <p className="uk-text-small uk-margin-remove">
                                            categories
                                        </p>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <div className="uk-text-right">

                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div>
                            <div className="uk-grid-match uk-grid-small uk-child-width-1-1@s uk-child-width-1-3@m" uk-grid="true">
                                { shops.map(shop => (
                                    <div>
                                        <div className="uk-card uk-card-default">
                                            <div className="uk-card-media-top">
                                                <img src={shop.background} alt=""  />
                                            </div>
                                            <div className="uk-card-body uk-padding-small">
                                                <div className="uk-grid-small uk-flex-middle uk-margin-small-bottom" uk-grid="true">
                                                    <div className="uk-width-auto">
                                                        <img className="uk-border-circle" width="40" height="40"
                                                             src={shop.logo} />
                                                    </div>
                                                    <div className="uk-width-expand">
                                                        <h3 className="uk-card-title uk-margin-remove-bottom">
                                                            <Link to={"shops/" + shop.id}>
                                                                {shop.title}
                                                            </Link>
                                                        </h3>
                                                        <p className="uk-text-meta uk-margin-remove-top">
                                                            <time dateTime="2016-04-01T19:00">April 01, 2016</time>
                                                        </p>
                                                    </div>
                                                </div>
                                                <Typography.Paragraph ellipsis={{ rows: 4, expandable: true }}>
                                                    { shop.about }
                                                </Typography.Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        shops: state.firestore.ordered.shops ? state.firestore.ordered.shops : []
    }
}

const enhance = compose(
    firestoreConnect([
        { collection: "shops" }
    ]),
    connect(mapStateToProps)
);
export default enhance(Shops);
