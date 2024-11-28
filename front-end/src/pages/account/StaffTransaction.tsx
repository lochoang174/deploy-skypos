import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchStaffTransactions } from '../../redux/reducer-type/StaffTransactionReducer';
import { useParams } from 'react-router-dom';
import { Button, Pagination, Space, Table, TableColumnsType, TablePaginationConfig } from 'antd';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import { ITransaction } from '../../types';
import { setPagination } from '../../redux/reducer-type/StaffTransactionReducer';
import { GrView } from 'react-icons/gr';
import DetailTransactionModal from "../../components/Dashboard/DetailTransactionModal";

const StaffTransaction = () => {
    const dispatch = useAppDispatch();
    // const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Quản lý modal
    const [selectedTransactionId, setSelectedTransactionId] = useState<string>(""); // Lưu transaction ID

    const { staffId } = useParams();
    const { transactions, totalTransactions, pagination, searchTerm } = useAppSelector(
        (state) => state.staffTransaction
    );
    const axios = usePrivateAxios();

    useEffect(() => {
        if (searchTerm) {
            setLoading(true);
        }
        if (staffId) {
            dispatch(
                fetchStaffTransactions({
                    staffId,
                    axiosInstance: axios,
                    page: pagination.current!,
                    limit: pagination.pageSize!,
                    customerName: searchTerm,
                })
            )
                .unwrap()
                .then(() => {
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("error fetching transaction of customer", err);
                    setLoading(false);
                });
        }
    }, [staffId, dispatch, axios, searchTerm, pagination]);

    const handleViewDetailTransaction = (transactionId: string) => {
        setSelectedTransactionId(transactionId); // Lưu ID của giao dịch cần xem chi tiết
        setIsModalOpen(true); // Mở modal
    };

    const handlePageChange = (page: number, pageSize: number) => {
        dispatch(setPagination({ page, pageSize }));
        dispatch(
            fetchStaffTransactions({
                axiosInstance: axios,
                limit: pageSize,
                page: page,
                customerName: searchTerm,
                staffId: staffId!,
            })
        );
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        dispatch(setPagination({ page: 1, pageSize: pagination.pageSize || 5 }));
    };

    const dataSourceTransactions = transactions.map((t) => ({ ...t, key: t._id }));

    const columns: TableColumnsType<ITransaction> = [
        {
            title: "Customer",
            dataIndex: "customerName",
            key: "customerName",
            width: 300,
        },
        {
            title: "Staff",
            dataIndex: "staffName",
            key: "staffName",
            width: 300,
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            width: 300,
        },
        {
            title: "Purchase Date",
            dataIndex: "purchaseDate",
            key: "purchaseDate",
            width: 300,
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
                            handleViewDetailTransaction(record._id);
                            console.log("cc"+ record._id

                            )
                        }}
                    >
                        <Button color="default" variant="solid" size="large">
                            <GrView />
                            View
                        </Button>
                    </div>
                </Space>
            ),
        },
    ];

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
                        onChange={handleTableChange}
                    />
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
            <DetailTransactionModal
                isModalOpen={isModalOpen}
                handleCancel={() => setIsModalOpen(false)}
                transactionId={selectedTransactionId}
            />
        </>
    );
};

export default StaffTransaction;