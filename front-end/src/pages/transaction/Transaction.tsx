
import  { useEffect } from "react";
import {  Space, Table } from "antd";
// import { ICustomer } from '../../types/customer';
// import useAxios from '../../hooks/useAxios'; 
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTransactions } from "../../redux/reducer-type/TransactionReducer";

const { Column } = Table
type DataType = {
  _id: string;
  staffName: string;
  customerName:string;
  totalAmount: number; 
  purchaseDate:Date
}

const Customer = () => {
    const { transactions } = useAppSelector((state) => state.transaction);
    const dispatch = useAppDispatch();
    const axios = usePrivateAxios()
    useEffect(() => {
        dispatch(fetchTransactions(axios)); // Pass axios instance to thunk

    }, [])
    useEffect(() => {
        console.log(transactions)
    }, [transactions])

    return (
        // @ts-ignore
        <Table<DataType> dataSource={transactions}
            pagination={{
                pageSize: 5, // Số bản ghi mỗi trang
                showSizeChanger: true, // Hiển thị lựa chọn thay đổi số lượng bản ghi mỗi trang
                pageSizeOptions: ['5', '10'], // Các tùy chọn số lượng bản ghi mỗi trang
            }}
        >
            <Column title="Customer Name" dataIndex="customerName" key="customerName" />
            <Column title="Staff Name" dataIndex="staffName" key="staffName" />
            <Column title="Total Amount" dataIndex="totalAmount" key="totalAmount" />
            <Column title="Purchase Date" dataIndex="purchaseDate" key="purchaseDate" />

            
            <Column
                title="Order Details"
                key="history"
                // @ts-ignore
                render={(_: any, record: DataType) => (
                    <Space size="middle">
                        <span className="cursor-pointer">View</span>
                    </Space>
                )}
            />
        </Table>
    );
};

export default Customer;
