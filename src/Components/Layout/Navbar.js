import React from "react";
import {Layout, Menu} from 'antd';
import {NavLink} from "react-router-dom";
const { SubMenu } = Menu;


const Navbar = ({ current }) => {

    return (
        <div>
            <Menu selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="auth">
                    <NavLink to={"auth"}>
                        Authenticate
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="home">
                    <NavLink to={"home"}>
                        Home
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="contacts">
                    <NavLink to={"contacts"}>
                        Contacts
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="terms">
                    <NavLink to={"terms"}>
                        Terms and Conditions
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="about us">
                    <NavLink to={"about us"}>
                        About us
                    </NavLink>
                </Menu.Item>
                <Menu.Item key ="language">
                    <NavLink to={"language"}>
                        Language
                    </NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to={"home"}>
                        Home
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="items">
                    <NavLink to={"/items"}>
                        Items
                    </NavLink>
                </Menu.Item>
                <SubMenu title="Shops">
                    <Menu.Item key="shops">
                        <NavLink to={"/shops"}>
                            Shops
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="newShop">
                        <NavLink to={"/shops/new"}>
                            New shop
                        </NavLink>
                    </Menu.Item>
                </SubMenu>
            </Menu>

        </div>
    )
};

export default Navbar;
