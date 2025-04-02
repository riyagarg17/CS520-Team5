import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Image, Layout, Menu, Typography } from "antd";
import Logo from "../assets/logo.png";

const { Header } = Layout;
const { Title } = Typography;

const items1 = [
    { key: "1", label: "Home", to: "/patient" },
    { key: "2", label: "Appointments", to: "/Appointments" },
    { key: "3", label: "Chat", to: "/chatassist" },
    // { key: "4", label: "Doctor", to: "/doctor" },
].map((item) => ({
    key: item.key,
    label: item.label,
    to: item.to,
}));

const Navbar = ({ selectedKey }) => {
    const location = useLocation();

    const currentItem = items1.find((item) => item.to === location.pathname);
    const isRegisterPage = location.pathname === "/register";
    const isLoginPage = location.pathname === "/login";
    const isMFAPage = location.pathname === "/mfa/register";

    selectedKey = currentItem ? currentItem.key : "1";

    if (isRegisterPage || isLoginPage || isMFAPage) {
        return (
            <Header style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Image src={Logo} width={50} preview={false} />
                <Title level={4} style={{ color: "white", margin: 0 }}>
                    CareCompass
                </Title>
            </Header>
        );
    }

    return (
        <Header style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Image src={Logo} width={50} preview={false} />
            <Title level={4} style={{ color: "white", margin: 0 }}>
                CareCompass
            </Title>
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
