import { Avatar, Dropdown, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductHeader, AccountHeader, DashboardHeader, TransactionHeader, CustomerHeader, CustomerTransactionHeader, StaffTransactionHeader } from "../Headers";
import VariantHeader from "../Headers/VariantHeader";
import DetailTransactionHeader from "../Headers/DetailTransactionHeader";
import usePrivateAxios from "../../hooks/usePrivateAxios";
const items: MenuProps["items"] = [
    {
        label: "Profile",
        key: "0",
    },

    {
        label: "Logout",
        key: "3",
    },
];
const Header = () => {
    const base_url = import.meta.env.VITE_BE_URL;
    const { auth, setAuth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const axios = usePrivateAxios()
    useEffect(() => {
        console.log(`${base_url + "/" + auth?.avatar}`);
    }, []);
    const handleMenuClick: MenuProps["onClick"] = (e) => {
        if (e.key === "0") {
            navigate("/profile");
        } else if (e.key === "3") {
            axios.post("/auth/logout")
            localStorage.clear();
            setAuth(null);
            window.location.reload();
        }
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const getHeaderTitle = () => {
        switch (location.pathname) {
            case "/home/dashboard":
                return <DashboardHeader role={auth!.role} />;
            case "/home/account":
                return <AccountHeader />;
            case "/home/product":
                return <ProductHeader />;
            case "/home/transaction":
                return <TransactionHeader />;
            case "/home/customer":
                return <CustomerHeader />;
            default:
                if (/^\/home\/customer\/[a-fA-F0-9]{24}\/transactions$/.test(location.pathname)) {
                    // Matches URLs like /home/customer/672066db483c290febafd03d/transactions
                    return <CustomerTransactionHeader />;
                } else if (/^\/home\/staff\/[a-fA-F0-9]{24}\/transactions$/.test(location.pathname)) {
                    // Matches URLs like /home/customer/672066db483c290febafd03d/transactions
                    return <StaffTransactionHeader />;
                } else if (/^\/home\/variant\/product\/[a-fA-F0-9]{24}$/.test(location.pathname)) {
                    // Matches URLs like /home/variant/product/670d3e7b80c9f77da834c55c
                    return <VariantHeader />;
                } else if (location.pathname.startsWith("/home/detail-transaction")) {
                    return <DetailTransactionHeader />;
                } else {
                    return "Welcome";
                }
        }
    };

    return (
        <div className="flex h-full py-3 px-5 items-center">
            <div className="flex-1">{getHeaderTitle()}</div>
            <div className="flex h-full justify-end">
                <Dropdown menu={menuProps} trigger={["click"]}>
                    <Avatar
                        size={44}
                        icon={<FaUser />}
                        style={{
                            alignSelf: "center",
                            cursor: "pointer",
                        }}
                        src={`${base_url + "/" + auth?.avatar}`}
                    />
                </Dropdown>
            </div>

            {/* <img src="http://localhost:3000/public/avatar-default.jpg" alt="Avatar" /> */}
        </div>
    );
};

export default Header;
