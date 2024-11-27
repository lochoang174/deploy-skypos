import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCustomerTransactions } from '../../redux/reducer-type/CustomerTransactionsReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Pagination, Space, Table, TableColumnsType, TablePaginationConfig } from 'antd';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import { ITransaction } from '../../types';
import { setPagination } from '../../redux/reducer-type/CustomerTransactionsReducer';
import { GrView } from 'react-icons/gr';

const { Column } = Table;

const CustomerTransaction = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    // const  { }
    // @ts-ignore
    const [_id, setId] = useState<string>("")

    const { customerId } = useParams();
    // @ts-ignore
    const { transactions, totalTransactions, pagination, searchTerm } = useAppSelector((state) => state.customerTransactions);
    const axios = usePrivateAxios();

    useEffect(() => {
        if (searchTerm) {
            setLoading(true)
        }
        if (customerId) {
            dispatch(fetchCustomerTransactions(
                {   customerId, 
                    axiosInstance: axios, 
                    page: pagination.current!, 
                    limit: pagination.pageSize!,
                    staffName: searchTerm
                })
        ).unwrap()
        .then(() =>  {
            setLoading(false)
        })
        .catch((err) => {
            console.error("error fetching transaction of  customer", err)
            setLoading(false)
        });
        }
    }, [customerId, dispatch, axios, searchTerm, pagination]);

    useEffect(()=>  {
        console.log("search:  ", searchTerm)
    }, [pagination]);

    const handleViewDetailTransaction = (transactionId: string) => {
        navigate(`home/transaction/${transactionId}`)
    }
    const handlePageChange = (page: number, pageSize: number) => {
        dispatch(setPagination({ page, pageSize }));
        dispatch(
            fetchCustomerTransactions({
                axiosInstance: axios, limit: pageSize, page: page, staffName: searchTerm,
                customerId: customerId!
            })
        )
    }
    const handleTableChange = (pagination: TablePaginationConfig) => {
        dispatch(setPagination({ page:1, pageSize: pagination.pageSize || 5}))
    }
    // @ts-ignore
    const dataSourceTransactions = transactions.map((t) => ({...t, key: t._id}))
    const columns: TableColumnsType<ITransaction> = [
        {
            title: "Staff",
            dataIndex: "staffName",
            key: "staffName",
            width: 300
        },
        {
            title: "Customer",
            dataIndex: "customerName",
            key: "customerName",
            width: 300

        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 300

        },
        {
            title: "Purchase Date",
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            width: 300

        },
        {
            title: "View Order Details",
            key: "detail",
            align: "center",
            render: (_, record: ITransaction) => (
                <Space size="middle">
                    <div
                        className="cursor-pointer text-[#207C96] hover:text-[#40A0B2] hover:scale-110 transition-transform duration-300 p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setId(record._id);
                        }}
                    >
                        <Button color="default" variant="solid" size="large" onClick={() => handleViewDetailTransaction(record._id)}>
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
                <Table<ITransaction>
                    size="small"
                    columns={columns}
                    dataSource={dataSourceTransactions}
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
                    total={totalTransactions}
                    showQuickJumper
                    align="end"
                    showSizeChanger
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} transactions`}
                    pageSizeOptions={["5", "10", "20"]}
                    onChange={(page, pageSize) => {
                        handlePageChange(page, pageSize);
                    }}
                />
        </div>
       </>
    );
};

export default CustomerTransaction;
