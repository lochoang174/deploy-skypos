import React, { useEffect, useState, useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { IoPhonePortrait } from "react-icons/io5";
import { MdManageAccounts, MdOutlineLeaderboard } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { FaInbox } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

type Item = {
    to: string;
    text: string;
    icon: React.ReactNode;
    disabled?: boolean;
};

const items: Item[] = [
    { to: "/home/dashboard", text: "Dashboard", icon: <MdOutlineLeaderboard /> },
    { to: "/home/account", text: "Account", icon: <MdManageAccounts /> },
    { to: "/home/customer", text: "Customer", icon: <AiOutlineUser /> },
    { to: "/home/product", text: "Product", icon: <IoPhonePortrait /> },
    { to: "/home/transaction", text: "Transaction", icon: <GrMoney /> },
];

const Sidebar = () => {
    const location = useLocation();
    const sidebarRef = useRef(null);
    const { auth } = useAuth();

    // Khởi tạo `filteredItems` dựa trên vai trò
    const [filteredItems, setFilteredItems] = useState<Item[]>(() => {
        if (auth?.role === 1) {
            // Role 1: Show Dashboard, Product, Transaction
            return items.filter((item) =>
                ["Dashboard", "Product", "Transaction"].includes(item.text)
            );
        }
        // Admin: Show all items
        return items;
    });

    const [indicatorStyle, setIndicatorStyle] = useState({});

    useEffect(() => {
        // Lọc lại `filteredItems` khi `auth.role` thay đổi
        const updatedItems =
            auth?.role === 1
                ? items.filter((item) =>
                      ["Dashboard", "Product", "Transaction"].includes(item.text)
                  )
                : items;
        setFilteredItems(updatedItems);
    }, [auth]);

    useEffect(() => {
        const activeIndex = filteredItems.findIndex((item) => item.to === location.pathname);

        if (sidebarRef.current && activeIndex !== -1) {
            const sidebarElement = sidebarRef.current as HTMLElement;
            const activeItem = sidebarElement.children[activeIndex] as HTMLElement;
            setIndicatorStyle({
                top: activeItem.offsetTop,
                height: activeItem.offsetHeight,
            });
        }

        // Logic cho các tuyến đặc biệt
        if (location.pathname.startsWith("/home/variant")) {
            // const variantItem = {
            //     to: "/home/variant",
            //     text: "Variant",
            //     icon: <FaInbox />,
            //     disabled: true,
            // };
            // setFilteredItems((prevItems) => {
            //     const updatedItems = [...prevItems];

            //     const index = auth?.role === 1 ? 1 : 3;
            //     updatedItems[index] = variantItem; // Update the Product item (index 3)
            //     return updatedItems;
            // });
        } else if (location.pathname.startsWith("/home/detail-transaction")) {
            const detailTransactionItem = {
                to: "/home/detail-transaction",
                text: "Dashboard",
                icon: <MdOutlineLeaderboard />,
                disabled: true,
            };
            setFilteredItems((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[0] = detailTransactionItem; // Update the Dashboard item (index 0)
                return updatedItems;
            });
        } else if (location.pathname.startsWith("/home/staff")) {
            const detailTransactionItem = {
                to: "/home/staff",
                text: "Account",
                icon: <MdManageAccounts />,
                disabled: true,
            };
            setFilteredItems((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[1] = detailTransactionItem; // Update the Dashboard item (index 0)
                return updatedItems;
            });
        }
    }, [location, filteredItems]);

    return (
        <div className="relative h-full flex flex-col w-[8-%] gap-5 items-center text-black">
            <img src="/logo.png" alt="Logo" className="h-20 w-20 mt-4" />
            <div className="border-t border-solid border-gray-300 w-[90%] my-4"></div>
            {/* Sliding Indicator */}
            <div
                className="absolute left-1/2 transform -translate-x-1/2 w-11/12 bg-[#081225] rounded-lg transition-all duration-300"
                style={{
                    ...indicatorStyle,
                    transition: "top 0.3s ease, height 0.3s ease",
                }}
            />
            <div ref={sidebarRef} className="px-4 w-full text-[13px] flex flex-col gap-3">
                {filteredItems.map((item, index) => (
                    <NavLink
                        to={item.to}
                        key={index}
                        style={({ isActive }) => ({
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            textDecoration: "none",
                            color: isActive ? "white" : "black",
                            padding: "10px",
                            width: "100%",
                            letterSpacing: "2px",
                            height: "48px",
                            position: "relative",
                            pointerEvents: item.disabled ? "none" : "auto",
                        })}
                        className={({ isActive }) =>
                            `transition-colors duration-300 ease-in-out ${
                                isActive ? "text-white bg-[#081225]" : "text-black"
                            }`
                        }
                    >
                        <div className="text-xl">{item.icon}</div>
                        <span className="ml-3">{item.text}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
