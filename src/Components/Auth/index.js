import React from "react";
import firebase from "../../Config/fbConfig"
import { Steps, Input, Form, Button } from 'antd';
import { connect } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import {signInWithPhoneNumber, verifyCode} from "../../Store/Actions/auth";
const { Step } = Steps;

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const FirstStep = ({ signInWithPhoneNumber, onChange }) => {

    return (
        <div className="uk-form-width-large">
            <Form
                {...layout}
                name="basic"
            >
                <Form.Item
                    label="Phone number"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input id="phone" onChange={onChange} size="large" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item>
                    <Button onClick={signInWithPhoneNumber} type="primary">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
};
const SecondStep = ({ verifyCode, onChange }) => {

    return (
        <div className="uk-form-width-large">
            <Form
                {...layout}
                name="basic"
            >
                <Form.Item
                    label="Code number"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input id="code" onChange={onChange} size="large" prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item>
                    <Button onClick={verifyCode} type="primary">
                        Submit
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
};
const ThirdStep = ({ user }) => {
    return (
        <div>
            { user ? user.displayName : "User not found" }
            { user ? user.phoneNumber : "User not found" }
        </div>
    )
};

class Auth extends React.Component {

    state = {
        current: 0,
        confirmationResult: null,
        phone: "",
        code: ""
    }


    onChange = e => {
        console.log(e.target.id, e.target.value);
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    componentDidMount() {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
        {
            size:"invisible",
            "callback": function(response) {
                signInWithPhoneNumber();
            }
        });
    }

    signInWithPhoneNumber = () => {
        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = this.state.phone;
        signInWithPhoneNumber({ phoneNumber, appVerifier }, (res) => {
            this.setState({
                confirmationResult: res,
                current: res ? 1 : 0
            })
        });
    };

    verifyCode = () => {
        const { confirmationResult, code } = this.state;
        if (confirmationResult) {
            verifyCode({ confirmationResult, code}, (res) => {
                this.setState({
                    current: res ? 2 : 1
                })
            })
        }
    }

    render() {
        const { auth } = this.props;
        const { current } = this.state;
        console.log(auth);
        const steps = [
            <FirstStep onChange={this.onChange} signInWithPhoneNumber={this.signInWithPhoneNumber} />,
            <SecondStep onChange={this.onChange} verifyCode={this.verifyCode} />,
            <ThirdStep user={auth} />
        ]

        return (
            <div className="uk-margin-large-top">
                <div className="uk-container">
                    <div>
                        <Steps current={auth.uid ? 2 : current}>
                            <Step title="Finished" description="This is a description." />
                            <Step title="In Progress" subTitle="Left 00:00:08" description="This is a description." />
                            <Step title="Waiting" description="This is a description." />
                        </Steps>
                    </div>

                    <div id="recaptcha-container"></div>
                    <div className="uk-margin-auto">
                        { steps[auth.uid ? 2 : current] }
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

export default connect(mapStateToProps)(Auth);
