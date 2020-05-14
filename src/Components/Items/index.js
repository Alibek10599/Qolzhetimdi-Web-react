import React from "react";
import {Link} from "react-router-dom";
import {firestoreConnect} from "react-redux-firebase";
import {connect} from "react-redux";
import {compose} from "redux";
import {Col, Divider, Row, Table, Input, Button, Space, Tag} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Item from "./Item";
import Highlighter from 'react-highlight-words';
import Navbar from "../Layout/Navbar";
const { Column } = Table;

class Items extends React.Component {

    state = {
        visible: false,
        item: null,
        searchText: '',
        searchedColumn: '',
    };

    showDrawer = item => {
        this.setState({
            visible: true,
            item: item
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
            item: null
        });
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
        const { auth, items, categories } = this.props;
        const { item, visible } = this.state;

        return (
            <div>
                <Navbar current="items" />
                <div className="uk-container">
                    <div className="uk-margin-top uk-margin-bottom">
                        <Row className={"uk-width-1-1"}>
                            <Col span={20}>
                                <div>
                                    <h3 className="uk-h3 uk-margin-remove">
                                        Items
                                    </h3>
                                    <p className="uk-text-small uk-margin-remove">
                                        { items.length} items | { categories.length} categories
                                    </p>
                                </div>
                            </Col>
                            <Col span={4}>
                                <div className="uk-text-right">
                                    <Button onClick={() => this.showDrawer(null)} type="primary">
                                        New item
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Item onClose={this.onClose} item={item} visible={visible} />

                    <div>
                        <div>
                            <Table dataSource={items}>
                                <Column width="10%" title="Image" dataIndex="image" key="image" render={(image) => (
                                    <img src={image} />
                                )} />
                                <Column width="30%" title="Name" dataIndex="name" key="name" {...this.getColumnSearchProps('name')} />
                                <Column width="20%" title="Category" dataIndex="category" key="category" filters={categories} onFilter={(value, record) => record.category===value} />
                                <Column width="10%" title="Priority" dataIndex="priority" key="priority" sorter={(a, b) => a - b} sortDirections={['descend', 'ascend']} {...this.getColumnSearchProps('priority')} />
                                <Column
                                    width="20%"
                                    title="Price"
                                    dataIndex={["price", "id"]}
                                    key="price"
                                    sorter={(a, b) => a.sum - b.sum}
                                    sortDirections={['descend', 'ascend']}
                                    {...this.getColumnSearchProps('price')}
                                    render={(price, item) => (
                                        <div>
                                            { console.log(price)}
                                            { item.price ? (
                                                <Tag color="green">
                                                    {item.price.sum/item.price.count}₸
                                                </Tag>
                                            ) : null}
                                            { item.price ? (
                                                <Tag color="blue">
                                                    {item.price.count} time(s)
                                                </Tag>
                                            ) : null}
                                            <Button onClick={() => this.showDrawer(item)} size="small" type="default">
                                                Edit
                                            </Button>
                                        </div>
                                    )} />
                                <Column width="10%" title="Bar code" dataIndex="barcode" key="barcode" {...this.getColumnSearchProps('barcode')} />
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
    if(state.firestore.ordered.items) {
        items = state.firestore.ordered.items.map(item => {
            if(!categories.includes(item.category)){
                categories.push(item.category);
            }
            return {
                key: item.id,
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
        })
    }
}

const enhance = compose(
    firestoreConnect([
        { collection: "items" }
    ]),
    connect(mapStateToProps)
);
export default enhance(Items);
