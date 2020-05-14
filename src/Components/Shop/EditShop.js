import React from "react";
import {Col, Row, Button, Form, TimePicker,Upload, message} from "antd";
import moment from "moment";
import {updateImage, updateWorkingHours} from "../../Store/Actions/shop";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import "./shop.css"
const timeFormat = 'HH:mm';
const { RangePicker } = TimePicker;



class EditShop extends React.Component {

    state = {
        fileList: [],
        uploading: false,
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


    handleUpload = () => {
        const { fileList } = this.state;

        this.setState({
            uploading: true,
        });

        updateImage(this.props.shop.id,"logo", fileList[0], res => {
            this.setState({
                uploading: false,
                fileList: [],
                imageUrl: null
            })
        });
    };

    updateWorkingHours = values => {
        const { shop } = this.props;
        let hours = {};
        Object.entries(values).forEach(day => {
            if(day[1]){
                hours[day[0]] = {
                    start: new Date(day[1][0]).getHours()*3600 + new Date(day[1][0]).getMinutes()*60,
                    end: new Date(day[1][1]).getHours()*3600 + new Date(day[1][1]).getMinutes()*60
                }
            } else {
                hours[day[0]] = {
                    start: shop.working_hours&&shop.working_hours[day[0]] ? shop.working_hours[day[0]].start : 0,
                    end: shop.working_hours&&shop.working_hours[day[0]] ? shop.working_hours[day[0]].end : 0
                }
            }
        });
        updateWorkingHours(shop.id, hours, () => {

        });
    };


    render() {
        const { uploading, fileList, imageUrl } = this.state;
        const { shop } = this.props;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    return {
                        fileList: [],
                    };
                });
            },
            beforeUpload: async (file) => {
                let self = this;
                let image = new Image();
                image.src = await this.readFile(file);
                image.onload = function(imageUrl){
                    console.log(imageUrl)
                    self.setState({
                        imageUrl: imageUrl.target.src,
                        fileList: [file],
                        loading: false,
                    });
                };
                return false;
            },
            fileList,
            showUploadList:false,
            listType: "picture-card"
        };
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return(
            <div>
                <div>
                    <div className="uk-margin-bottom">
                        <div>
                            <h3 className="uk-h3 uk-margin-remove">
                                Update logo
                            </h3>
                        </div>
                        <div>
                            <Upload {...props}>
                                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton }
                            </Upload>
                            <Button
                                type="primary"
                                onClick={this.handleUpload}
                                disabled={fileList.length === 0}
                                loading={uploading}
                                style={{ marginTop: 4 }}
                            >
                                {uploading ? 'Uploading' : 'Start Upload'}
                            </Button>
                        </div>
                    </div>

                    <div className="uk-margin-bottom">
                        <div>
                            <h3 className="uk-h3 uk-margin-remove">
                                Working hours
                            </h3>
                            <p className="uk-text-small uk-margin-bottom">
                                { moment(new Date()).format("dddd, MMM Do")}
                            </p>
                            <Form className="uk-padding-large uk-padding-remove-vertical" layout="vertical" hideRequiredMark onFinish={this.updateWorkingHours}>
                                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                                    <Row>
                                        <Col span={4}>
                                            <div>
                                                <h6 className="uk-text-uppercase uk-margin-remove">
                                                    {day}
                                                </h6>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            <div>
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
                        </div>
                        <hr />
                    </div>
                </div>
            </div>
        )
    }
}


export default EditShop;
