import React from "react";
import "./layout.style.css";
import Sidebar from "../../components/Layout/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../../components/Layout/Header";
const Layout = () => {
    return (
        <div id="container">
            <div id="side">
                <Sidebar></Sidebar>
            </div>
            <div id="head">
                <Header></Header>
            </div>
            <div id="main" className="overflow-y-auto">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Layout;
