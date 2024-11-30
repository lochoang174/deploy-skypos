import React, { Key, useEffect, useMemo, useState } from "react";
import { Button, Flex, Space, Table, Tag, Switch, Pagination } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
// import { ICustomer } from '../../types/customer';
// import useAxios from '../../hooks/useAxios'; 
import { TableRowSelection } from "antd/es/table/interface";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchCustomers } from "../../redux/reducer-type/CustomerReducer";
import { useNavigate } from 'react-router-dom';
import { ICustomer } from "../../types";
import { setPagination } from "../../redux/reducer-type/CustomerReducer";
import { GrView } from "react-icons/gr";

const Customer = () => {
    const navigate = useNavigate();
    // const { customers } = useAppSelector((state) => state.customer);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(true);
    const axios = usePrivateAxios()
    const { customers, totalCustomers, pagination, searchTerm } = useAppSelector(
        (state) => state.customer
    )
    const [_id, setId] = useState<string>("")
    const currentCustomer = useMemo(() => {
        return customers.find((customer) => customer._id === _id);
    }, [customers, _id])
    useEffect(() => {
        if (searchTerm) {
            setLoading(true)
        }
        dispatch(
            fetchCustomers({
                axiosInstance: axios,
                page: pagination.current!,
                limit: pagination.pageSize!,
                customerName: searchTerm
            })
        ).unwrap()
            .then(() => {
                setLoading(false)
            })
            .catch((error) => {
                console.error("error fetching customer", error)
                setLoading(false)
            })
    }, [dispatch, axios, searchTerm, pagination])

    useEffect(() => {
        console.log("search: ", searchTerm)
    }, [pagination])
    const handleViewHistory = (customerId: string) => {
        console.log(customerId)
        navigate(`/home/customer/${customerId}/transactions`);
    }
    const handlePageChange = (page: number, pageSize: number) => {
        dispatch(setPagination({ page, pageSize }))
        dispatch(
            fetchCustomers({
                axiosInstance: axios,
                limit: pageSize,
                page: page,
                customerName: searchTerm
            })
        )
    }

    const handleTableChange = (pagination: TablePaginationConfig) => {
        dispatch(setPagination({ page:1, pageSize: pagination.pageSize || 5}))
    }

    const dataSourceCustomers = customers.map((c) => ({
        ...c,
        key: c._id
    }))

    const columns: TableColumnsType<ICustomer> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 300
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "View Orders History",
            key: "history",
            align: "center",
            render: (_, record: ICustomer) => (
                <Space size="middle">
                    <div
                        className="cursor-pointer text-[#207C96] hover:text-[#40A0B2] hover:scale-110 transition-transform duration-300 p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setId(record._id);
                            // showModal(EModal.UPDATE);
                        }}
                    >
                        <Button color="default" variant="solid" size="large" onClick={() => handleViewHistory(record._id)}>
                            <GrView />
                            View
                        </Button>
                    </div>
                </Space>
            ),
        }
    ]
    return (
       <>
        <div className="h-full p-2 flex flex-col justify-between">
            <div className="overflow-auto">
                <Table<ICustomer>
                    size="small"
                    columns={columns}
                    dataSource={dataSourceCustomers}
                    pagination={false}
                    loading={loading}
                    rowClassName={(record, idx) => 
                        "cursor-pointer transition-all duration-200 ease-in-out  active:bg-gray-300 !h-4"
                    }
                    onChange={handleTableChange} />
            </div>
            <Pagination
                    pageSize={pagination.pageSize}
                    current={pagination.current}
                    total={totalCustomers}
                    showQuickJumper
                    align="end"
                    showSizeChanger
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} customers`}
                    pageSizeOptions={["5", "10", "20"]}
                    onChange={(page, pageSize) => {
                        handlePageChange(page, pageSize);
                    }}
                />
        </div>
       </>
    );
};

export default Customer;
