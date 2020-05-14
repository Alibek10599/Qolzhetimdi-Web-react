import React from "react";
import {Link} from "react-router-dom";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {compose} from "redux";
import {Col, Divider, Row, Table, Input, Button, Space, Tag, Drawer, Form, InputNumber} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Item from "../Items/Item";
import Highlighter from 'react-highlight-words';
import Navbar from "../Layout/Navbar";
import {createItem, createShopItem, deleteShopItem, updateItem, updateShopItem} from "../../Store/Actions/item";
const { Column } = Table;



const ItemDrawer = ({ state, item, onClose, visible, shopId }) => {

    const onFinish = values => {
        if(state === "add") {
            createShopItem(shopId, {
                name: item.name,
                image: item.image,
                barcode: item.barcode,
                category: item.category,
                price: values.price
            }, res => {
                onClose();
                console.log(res);
            })
        } else {
            updateShopItem(shopId, item.id, {
                price: values.price,
            }, res => {
                onClose();
                console.log(res);
            });
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
                                    <Form layout="vertical" hideRequiredMark onFinish={onFinish}>
                                        <h4 className="uk-h4 uk-margin-remove">
                                            { item.name }
                                        </h4>
                                        <p className="uk-p">
                                            { item.category }
                                        </p>
                                        <div>
                                            <h4 className="uk-h4 uk-margin-remove">

                                                <Form.Item
                                                    name={["price", "value"]}
                                                    rules={[
                                                        {
                                                            type: 'number',
                                                            min: 0
                                                        },
                                                        {
                                                            required: true
                                                        }
                                                    ]}
                                                >
                                                    { state === "add" ?
                                                        <InputNumber defaultValue={item.price ? (item.price.sum/item.price.sum) : 0} placeholder="Price" />
                                                    : <InputNumber defaultValue={item.price ? item.price.value: 0} placeholder="Price" />}
                                                </Form.Item>
                                                <Form.Item
                                                    name={["price", "per"]}
                                                    rules={[
                                                        {
                                                            required: true
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder="Price per" />
                                                </Form.Item>
                                            </h4>
                                        </div>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                : null}
        </Drawer>
    );
}


class ShopItems extends React.Component {

    state = {
        visible: false,
        item: null,
        searchText: '',
        searchedColumn: '',
        itemState: "add"
    };

    showDrawer = (itemState, item) => {
        this.setState({
            visible: true,
            item: item,
            itemState: itemState
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            item: null
        });
    };

    onDelete = item => {
        deleteShopItem(this.props.shop.id, item.id, res => {
            console.log(res);
        })
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const { shop, items, categories, shopCategories, shopItems } = this.props;
        const { item, visible, searchedColumn, searchText, itemState } = this.state;

        const searching = searchedColumn==="name"&&searchText.length>0;
        let tempItems = searching ? items : shopItems;
        let tempCategories = searching ? categories : shopCategories;


        return (
            <div>
                <div>
                    <div className="uk-margin-bottom">
                        <div>
                            <h3 className="uk-h3 uk-margin-remove">
                                Shop items
                            </h3>
                            <p className="uk-text-small uk-margin-remove">
                                { tempItems.length} items | { tempCategories.length} categories
                            </p>
                        </div>
                    </div>

                    <ItemDrawer onClose={this.onClose} item={item} visible={visible} state={itemState} shopId={shop.id} />

                    <div>
                        <div>
                            <Table dataSource={tempItems}>
                                <Column width="10%" title="Image" dataIndex="image" key="image" render={(image) => (
                                    <img src={image} />
                                )} />
                                <Column width="30%" title="Name" dataIndex="name" key="name" {...this.getColumnSearchProps('name')} />
                                <Column width="25%" title="Category" dataIndex="category" key="category" filters={tempCategories} onFilter={(value, record) => record.category===value} />
                                <Column
                                    width="20%"
                                    title="Price"
                                    dataIndex={["price"]}
                                    key="price"
                                    sorter={(a, b) => searching ? a.price.sum - b.price.sum : a.price.value - b.price.value }
                                    sortDirections={['descend', 'ascend']}
                                    render={(price) => (
                                        <div>
                                            <h5 className="uk-text-success uk-h5">
                                                { searching&&price&&price.sum ?
                                                    (price.sum/price.count) + "₸"
                                                : (price ? price.value + "₸ / " + price.per : "")}
                                            </h5>
                                        </div>
                                    )} />
                                <Column width="15%" title="Action" render={(item) => (
                                    <div>
                                        { searching ?
                                            <Button dataIndex={"id"} onClick={() => this.showDrawer("add", item)} size="small" type="default">
                                                Add
                                            </Button>
                                            :
                                            <div>
                                                <Button dataIndex={"id"} onClick={() => this.showDrawer("edit", item)} size="small" type="default">
                                                    Edit
                                                </Button>
                                                <Button dataIndex={"id"} onClick={() => this.onDelete(item)} size="small" danger type="default">
                                                    Delete
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                )} />
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {

    let items = [];
    let categories = [];
    let shopItems = [];
    let shopCategories = [];
    console.log(state.firestore.ordered)
    if(state.firestore.ordered.shopItems) {
        shopItems = state.firestore.ordered.shopItems.map(item => {
            if(!shopCategories.includes(item.category)){
                shopCategories.push(item.category);
            }
            return {
                key: item.id,
                ...item
            }
        })
    }

    if(state.firestore.ordered.items) {
        items = state.firestore.ordered.items.map(item => {
            if(!categories.includes(item.category)){
                categories.push(item.category);
            }
            const includes = shopItems.find(shopItem => shopItem.id === item.id);
            return {
                key: item.id,
                includes: includes,
                price: includes ? includes.price : item.price,
                ...item
            }
        })
    }



    return {
        auth: state.firebase.auth,
        items: items,
        categories: categories.map(category => {
            return {
                text: category,
                value: category
            }
        }),
        shopItems: shopItems,
        shopCategories: shopCategories.map(category => {
            return {
                text: category,
                value: category
            }
        })
    }
}

const enhance = compose(
    firestoreConnect(props => [
        { collection: "shops/" + props.shop.id + "/items", storeAs: "shopItems" },
        { collection: "items", type: "once" }
    ]),
    connect(mapStateToProps)
);
export default enhance(ShopItems);
