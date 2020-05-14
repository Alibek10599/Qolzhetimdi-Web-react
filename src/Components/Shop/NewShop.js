import React from "react";
import Navbar from "../Layout/Navbar";
import {Form, Button, Col, Row, Input, Select, DatePicker, Upload, Steps, TimePicker} from 'antd';
import {createShop} from "../../Store/Actions/shop";
import Map from "../Map/Map";
import "./shop.css"
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Step } = Steps;
const { Option } = Select;

const timeFormat = 'HH:mm';
const { RangePicker } = TimePicker;
const rules = [{ required: true }];

class NewShop extends React.Component {

    state = {
        logoUrl: null,
        backgroundUrl: null,
        logoList: [],
        backgroundList: [],
        uploading: false,
        current: 0,
    };

    onChange = current => {
        this.setState({ current });
    };

    readFile(file) {
        if(file) {
            return new Promise(resolve => {
                const reader = new FileReader()
                reader.addEventListener('load', () => resolve(reader.result), false)
                reader.readAsDataURL(file)
            })
        } else {
            return "https://i0.wp.com/www.charitycomms.org.uk/wp-content/uploads/2019/02/placeholder-image.jpg?ssl=1"
        }
    }


    firstFinish = values => {
        if(this.state.logoUrl && this.state.backgroundUrl) {
            this.setState({
                values: {...this.state.values, ... values},
                current: 1
            });
        } else {

        }
    };

    secondFinish = values => {
        this.setState({
            values: {...this.state.values, ... values},
            current: 2
        })
    };

    onFinish = values => {
        const { logoList, backgroundList } = this.state;
        this.setState({
            uploading: true
        });
        let hours = {};
        Object.entries(values.working_hours).forEach(day => {
            if(day[1]){
                hours[day[0]] = {
                    start: new Date(day[1][0]).getHours()*3600 + new Date(day[1][0]).getMinutes()*60,
                    end: new Date(day[1][1]).getHours()*3600 + new Date(day[1][1]).getMinutes()*60
                }
            } else {
                hours[day[0]] = {
                    start: 0,
                    end: 0
                }
            }
        });
        createShop({
            ...this.state.values,
            social_media: values.social_media,
            working_hours: hours
        }, [logoList[0], backgroundList[0]], res => {
            this.setState({
                uploading: false
            });
        })
    };

    render() {

        const { uploading, logoList, backgroundList, backgroundUrl, logoUrl, current } = this.state;
        const logoProps = {
            onRemove: file => {
                this.setState(state => {
                    return {
                        logoList: [],
                    };
                });
            },
            beforeUpload: async (file) => {
                let self = this;
                let image = new Image();
                image.src = await this.readFile(file);
                image.onload = function(imageUrl){
                    self.setState({
                        logoUrl: imageUrl.target.src,
                        logoList: [file]
                    });
                };
                return false;
            },
            fileList: logoList,
            showUploadList:false,
            listType: "picture-card"
        };
        const backgroundProps = {
            onRemove: file => {
                this.setState(state => {
                    return {
                        backgroundList: [],
                    };
                });
            },
            beforeUpload: async (file) => {
                let self = this;
                let image = new Image();
                image.src = await this.readFile(file);
                image.onload = function(imageUrl){
                    self.setState({
                        backgroundUrl: imageUrl.target.src,
                        backgroundList: [file]
                    });
                };
                return false;
            },
            fileList: backgroundList,
            showUploadList:false,
            listType: "picture-card"
        };
        const FirstView = (
            <Row gutter={8}>
                <Col span={12}>
                    <div>
                        <h3 className="uk-h2 uk-text-bold">
                            Register your shop
                        </h3>

                        <div>
                            <Form initialValues={this.state.values} onFinish={this.firstFinish} layout="vertical" hideRequiredMark>
                                <Form.Item
                                    name="title"
                                    label={
                                        <h3 className="uk-h4 uk-margin-remove">
                                            Shop name
                                        </h3>
                                    }
                                    rules={[{ required: true, message: 'Please enter shop name' }]}
                                >
                                    <Input size="large" placeholder="Please enter shop name" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col>
                                        <Form.Item rules={rules}>
                                            <div>
                                                <Upload {...logoProps}>
                                                    { logoUrl ? <img src={logoUrl} alt="avatar" style={{ width: '100%' }} /> :
                                                        <span>
                                                                                <i uk-icon="camera" /><br/>
                                                                                Upload logo
                                                                            </span>
                                                    }
                                                </Upload>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item rules={rules}>
                                            <div>
                                                <Upload {...backgroundProps} className="background">
                                                    { backgroundUrl ? <img src={backgroundUrl} alt="avatar" style={{ width: '100%' }} /> :
                                                        <span>
                                                                                <i uk-icon="camera" /><br/>
                                                                                Upload background
                                                                            </span>
                                                    }
                                                </Upload>
                                            </div>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="about"
                                    label={
                                        <h3 className="uk-h4 uk-margin-remove">
                                            About the shop
                                        </h3>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please write about the shop',
                                        },
                                    ]}
                                >
                                    <Input.TextArea size="large" rows={4} placeholder="About the shop" />
                                </Form.Item>

                                <Form.Item>
                                    <Button size="large" type="primary" htmlType="submit">
                                        Contacts and branches <i uk-icon="arrow-right" />
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div className="uk-padding">
                        <img className="uk-width-1-1" src={require("../Media/images/undraw_business_shop_qw5t.svg")} />
                    </div>
                </Col>
            </Row>
        );
        const SecondView = (
            <div>
                <h3 className="uk-h2 uk-text-bold">
                    Shop contacts and branches
                </h3>

                <Form initialValues={this.state.values} onFinish={this.secondFinish} layout="vertical" hideRequiredMark>
                    <div>
                        <div>
                            <h3 className="uk-h4">
                                Branches
                            </h3>

                            <Form.List name="branches">
                                {(fields, { add, remove }) => {
                                    return (
                                        <div>
                                            {fields.map((field, index) => (
                                                <Row gutter={8} key={field.key} className="uk-margin-bottom">
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name={[field.name, "city"]}
                                                            fieldKey={[field.fieldKey, "city"]}
                                                            rules={rules}
                                                            noStyle
                                                        >
                                                            <Input size="large" placeholder="City" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={16}>
                                                        <Form.Item
                                                            name={[field.name, "address"]}
                                                            fieldKey={[field.fieldKey, "address"]}
                                                            rules={rules}
                                                            noStyle
                                                        >
                                                            <Input size="large" placeholder="Address" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex="none">
                                                        <div className="uk-text-center">
                                                            <MinusCircleOutlined
                                                                className="dynamic-delete-button"
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                >
                                                    <PlusOutlined /> Add field
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    );
                                }}
                            </Form.List>
                        </div>
                        <div>
                            <h3 className="uk-h4">
                                Contacts
                            </h3>
                            <Form.List name="contacts">
                                {(fields, { add, remove }) => {
                                    return (
                                        <div>
                                            {fields.map((field, index) => (
                                                <Row gutter={8} key={field.key} className="uk-margin-bottom">
                                                    <Col span={6}>
                                                        <Form.Item
                                                            name={[field.name, "phone"]}
                                                            fieldKey={[field.fieldKey, "phone"]}
                                                            rules={rules}
                                                            noStyle
                                                        >
                                                            <Input size="large" placeholder="Phone number" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={16}>
                                                        <Form.Item
                                                            name={[field.name, "details"]}
                                                            fieldKey={[field.fieldKey, "details"]}
                                                            rules={rules}
                                                            noStyle
                                                        >
                                                            <Input size="large" placeholder="Contact details" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex="none">
                                                        <MinusCircleOutlined
                                                            className="dynamic-delete-button"
                                                            onClick={() => {
                                                                remove(field.name);
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                >
                                                    <PlusOutlined /> Add field
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    );
                                }}
                            </Form.List>
                        </div>

                        <Row gutter={8}>
                            <Col>
                                <div>
                                    <Form.Item>
                                        <Button disabled={uploading} onClick={() => this.setState({ current:  0})} type="default" size="large" htmlType="button">
                                            <i uk-icon="arrow-left"/> Back
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col>
                                <div>
                                    <Form.Item>
                                        <Button size="large" type="primary" htmlType="submit">
                                            Working hours and social media <i uk-icon="arrow-right" />
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
        const ThirdView = (
            <div>
                <h3 className="uk-h2 uk-text-bold">
                    Shop working hours and social media
                </h3>

                <Form onFinish={this.onFinish} layout="vertical" hideRequiredMark>
                    <div>
                        <Row className="uk-width-1-1">
                            <Col span={12}>
                                <div>
                                    <h3 className="uk-h4">
                                        Working hours
                                    </h3>
                                    <div>
                                        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                                            <Row>
                                                <Col span={6}>
                                                    <div>
                                                        <h6 className="uk-text-uppercase uk-margin-remove">
                                                            {day}
                                                        </h6>
                                                    </div>
                                                </Col>
                                                <Col span={18}>
                                                    <div>
                                                        <Form.Item name={["working_hours", day.substring(0, 3)]}>
                                                            <RangePicker format={timeFormat} />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ))}
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div>
                                    <h3 className="uk-h4">
                                        Social media
                                    </h3>
                                    <Form.List name="social_media">
                                        {(fields, { add, remove }) => {
                                            return (
                                                <div>
                                                    {fields.map((field, index) => (
                                                        <Row gutter={8} key={field.key} className="uk-margin-bottom">
                                                            <Col span={6}>
                                                                <Form.Item
                                                                    name={[field.name, "type"]}
                                                                    fieldKey={[field.fieldKey, "type"]}
                                                                    rules={rules}
                                                                    noStyle
                                                                >
                                                                    <Input size="large" placeholder="Media type" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={16}>
                                                                <Form.Item
                                                                    name={[field.name, "data"]}
                                                                    fieldKey={[field.fieldKey, "data"]}
                                                                    rules={rules}
                                                                    noStyle
                                                                >
                                                                    <Input size="large" placeholder="Social media" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col flex="none">
                                                                <div className="uk-text-center">
                                                                    <MinusCircleOutlined
                                                                        className="dynamic-delete-button"
                                                                        onClick={() => {
                                                                            remove(field.name);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                    <Form.Item>
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => {
                                                                add();
                                                            }}
                                                        >
                                                            <PlusOutlined /> Add field
                                                        </Button>
                                                    </Form.Item>
                                                </div>
                                            );
                                        }}
                                    </Form.List>
                                </div>
                            </Col>
                        </Row>


                        <Row gutter={8}>
                            <Col>
                                <div>
                                    <Form.Item>
                                        <Button disabled={uploading} onClick={() => this.setState({ current:  1})} type="default" size="large" htmlType="button">
                                            <i uk-icon="arrow-left"/> Back
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col>
                                <div>
                                    <Form.Item>
                                        <Button disabled={uploading} loading={uploading} type="primary" size="large" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </div>
        );
        const steps = [ FirstView, SecondView, ThirdView ];

        return (
            <div className="new-shop-background" style={{ minHeight: "calc(100vh)"}}>
                <div>
                    <Navbar current="newShop"/>

                    <div className="uk-container">
                        <div className="uk-margin-large-top uk-margin-large-bottom uk-background-default uk-border-rounded"  style={{ minHeight: "calc(75vh)"}}>
                            <Steps
                                type="navigation"
                                size="small"
                                current={current}
                                className="site-navigation-steps"
                            >
                                <Step
                                    title="Step 1"
                                    status={current === 0 ? "process" : "finish"}
                                    description="Register your shop"
                                />
                                <Step
                                    title="Step 2"
                                    status={current > 1 ? "finish" : "wait"}
                                    description="Branches"
                                />
                                <Step
                                    title="Step 3"
                                    status="wait"
                                    description="Working hours"
                                />
                            </Steps>
                            <div className="uk-padding">
                                { steps[current] }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default NewShop;
