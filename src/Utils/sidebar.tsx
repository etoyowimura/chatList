import { MenuProps } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import {
  DesktopOutlined,
} from "@ant-design/icons";
import ContactList from "../Components/ContactList/ContactList";
import Login from "../Components/ContactList/Login";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const allMenu: MenuItem[] = [
  getItem(<Link to="/">Device</Link>, "/", <DesktopOutlined />),
  getItem(
    <Link to="/login">Location</Link>,
    "/login",
  ),
];

export const items: Array<any> = [
  {
    path: "/",
    component: <ContactList />,
    key: "/",
  },
  {
    path: "/login",
    component: <Login />,
    key: "/login",
  },
];
