import { Space, Spin, Table, TableProps, Tag } from "antd";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IOrder, TTransaction } from "../../types";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchOrders } from "../../redux/reducer-type/OrderReducer";
import { formatDate } from "../product/Product";
export default function DetailTransaction() {
    const location = useLocation();
    const date = location.state?.date;
    const axios = usePrivateAxios();
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchOrders({ axiosInstance: axios, date }));
    }, [dispatch, axios]);


    const columns: TableProps<IOrder>["columns"] = [
        {
            title: "ID",
            key: "_id",
            dataIndex: "_id",
        },
        {
            title: "Staff",
            key: "staff",
            dataIndex: ["Staff", "name"],
        },
        {
            title: "Customer",
            key: "customer",
            dataIndex: ["Customer", "name"],
        },
        {
            title: "Total Amount",
            key: "totalAmount",
            dataIndex: "totalAmount",
        },
        {
            title: "Amount Paid",
            key: "amountPaid",
            dataIndex: "amountPaid",
        },
        {
            title: "Refund",
            key: "refund",
            dataIndex: "refund",
        },
        {
            title: "Created At",
            key: "createdAt",
            dataIndex: "createdAt",
            render: (text) => formatDate(text),
        },
        {
            title: "Updated At",
            key: "updatedAt",
            dataIndex: "updatedAt",
            render: (text) => formatDate(text),
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (_, { status }) => (
                <>
                    <Tag color={status === "PAID" ? "green" : "red"} key={status}>
                        {status}
                    </Tag>
                </>
            ),
        },
    ];
    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <Table<IOrder> columns={columns} dataSource={orders} pagination={false} />
            )}
        </div>
    );
}
