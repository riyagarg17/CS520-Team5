import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Image, Layout, Menu } from "antd";
import SchedulCareLogo from "../images/logo.svg";

const { Header } = Layout;

const items1 = [
    { key: "1", label: "Home", to: "/patient" },
    { key: "2", label: "MapView", to: "/MapView" },
    {
        key: "3",
        label: "Chat",
        to: "/chatassist",
    },
    { key: "4", label: "Doctor", to: "/doctor" },
].map((item) => ({
    key: item.key,
    label: item.label,
    to: item.to,
    heading: item.heading,
}));

const Navbar = ({ selectedKey }) => {
    const location = useLocation(); // Use location to get the current path

    const currentItem = items1.find((item) => item.to === location.pathname);
    const isRegisterPage = location.pathname === '/register';
    const isLoginPage = location.pathname === '/login';
    const isMFAPage = location.pathname === '/mfa/register';

    selectedKey = currentItem ? currentItem.key : "1";

    // Only render the tabs if the current page is not /register or /login
    if (isRegisterPage || isLoginPage || isMFAPage) {
        return (
            <Header style={{ display: "flex", alignItems: "center" }}>
                <Image src={SchedulCareLogo} width={55} />
            </Header>
        );
    }

    return (
        <Header style={{ display: "flex", alignItems: "center" }}>
            <Image src={SchedulCareLogo} width={55} />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[selectedKey]}
                style={{ flex: 1, minWidth: 0 }}
            >
                {items1.map((item) => (
                    <Menu.Item key={item.key}>
                        <Link to={item.to}>{item.label}</Link>
                    </Menu.Item>
                ))}
            </Menu>
        </Header>
    );
};

export default Navbar;