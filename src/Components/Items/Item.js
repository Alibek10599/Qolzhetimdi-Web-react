import React from "react";
import {Drawer, Form, Button, Col, Row, Input, Select, DatePicker, InputNumber} from 'antd';
import {createItem, updateItem} from "../../Store/Actions/item";


const Item = ({ item, onClose, visible }) => {


    const onFinish = values => {
        if(item) {
            updateItem(item.id, {
                ...values,
                barcode: values.barcode ? values.barcode : null,
                price: values.price ? {
                    sum: (item.price ? item.price.sum: 0) + values.price,
                    count: item.price ? item.price.count + 1 : 1
                } : item.price
            }, res => {
                onClose();
            })
        } else {
            createItem({
                ...values,
                barcode: values.barcode ? values.barcode : null,
                price: values.price ? {
                    sum: values.price,
                    count: 1
                } : null
            }, res => {
                onClose();
            })
        }
    };

    return (
        <Drawer
            title={ item ? item.name : "Create new item" }
            width={720}
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
        >
            { item ?
                <div className="uk-padding-small uk-background-muted uk-border-rounded uk-margin-bottom">
                    <Row gutter={[16, 16]}>
                        <Col span={6}>
                            <div>
                                <img src={item.image} className="uk-height-small uk-width-small"/>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div>
                                <div>
                                    <h4 className="uk-h4 uk-margin-remove">
                                        { item.name }
                                    </h4>
                                    <p className="uk-p">
                                        { item.category }
                                    </p>
                                    <div>
                                        <h4 className="uk-h4 uk-margin-remove">
                                            ~{ item.price ? (item.price.sum/item.price.count) : "Not defined" }₸
                                        </h4>
                                        <p className="uk-text-small uk-margin-remove">
                                            { item.price ? item.price.count : "0" } times
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            : null}

            <Form layout="vertical" hideRequiredMark onFinish={onFinish}>
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

                <Form.Item
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
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image URL"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};


export default Item;
