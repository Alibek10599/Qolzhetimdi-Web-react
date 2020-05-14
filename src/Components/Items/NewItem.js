import React from "react";
import {Link} from "react-router-dom";
import { Form, Input, InputNumber, Button } from 'antd';
import {createItem} from "../../Store/Actions/item";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

class NewItem extends React.Component {



    onFinish = values => {
        createItem({
            ...values,
            barcode: values.barcode ? values.barcode : null
        }, res => {
            console.log(res);
        })
    };

    render() {
        return (
            <div>
                <div>
                    <h1>
                        Create new item
                    </h1>
                </div>


                <div>
                    <div>
                        <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="barcode"
                                label="Bar code"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="category"
                                label="Category"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Items
                                name="price"
                                label="Price"
                                rules={[
                                    {
                                        type: 'number',
                                        min: 0
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Items>
                            <Form.Item name="image" label="Image URL">
                                <Input />
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}


export default NewItem;
