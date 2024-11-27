import React, { useEffect, useState, useRef } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { IoPhonePortrait } from "react-icons/io5";
import { MdManageAccounts, MdOutlineLeaderboard } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { FaInbox } from "react-icons/fa";

type Item = {
    to: string;
    text: string;
    icon: React.ReactNode;
    disabled?: boolean; // Optional disabled property
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
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const sidebarRef = useRef(null);
    const [activeItem, setActiveItem] = useState(items);
    useEffect(() => {
        const activeIndex = items.findIndex((item) => item.to === location.pathname);
        if (sidebarRef.current && activeIndex !== -1) {
            const sidebarElement = sidebarRef.current as HTMLElement;
            const activeItem = sidebarElement.children[activeIndex] as HTMLElement;
            setIndicatorStyle({
                top: activeItem.offsetTop,
                height: activeItem.offsetHeight,
            });
        }
        // Change icon and text for the Variant route
        if (location.pathname.startsWith("/home/variant")) {
            const variantItem = {
                to: "/home/variant", // Adjust based on your route logic
                text: "Variant", // New text for the variant route
                icon: <FaInbox />, // New icon for the variant route (choose an appropriate one)
                disabled: true, // Add a disable property if needed
            };
            setActiveItem((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[3] = variantItem; // Update the Product item (index 3)
                return updatedItems;
            });
        } else if (location.pathname.startsWith("/home/detail-transaction")) {
            const detailTransactionItem = {
                to: "/home/detail-transaction", // Adjust based on your route logic
                text: "Dashboard", // New text for the variant route
                icon: <MdOutlineLeaderboard />, // New icon for the variant route (choose an appropriate one)
                disabled: true, // Add a disable property if needed
            };
            setActiveItem((prevItems) => {
                const updatedItems = [...prevItems];
                updatedItems[0] = detailTransactionItem; // Update the Product item (index 3)
                return updatedItems;
            });
        } else {
            // Reset to original items when not on Variant route
            setActiveItem(items);
        }
    }, [location]);

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
                {activeItem.map((item, index) => (
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
                                isActive ? "text-white" : "text-black"
                            }`
                        }
                        aria-hidden="false"
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
