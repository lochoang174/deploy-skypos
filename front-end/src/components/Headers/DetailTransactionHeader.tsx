import React from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { useLocation } from "react-router-dom";

export default function DetailTransactionHeader() {
    const location = useLocation();
    const date = location.state?.date;
    return (
        <div className="flex items-center gap-5">
            <IoArrowBackCircle
                size={32}
                className="cursor-pointer transition-all transform  hover:opacity-70 "
                onClick={() => window.history.back()}
            />

            <div className="text-white bg-primary-black rounded-lg p-2 py-1 text-sm w-fit flex items-center gap-2">
                <div>Purchase Date</div>
                <span className="text-2xl">{date}</span>
            </div>
        </div>
    );
}
