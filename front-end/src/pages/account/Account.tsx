import React, { Key, useEffect, useState } from "react";
import { Space, Table, Tag, Avatar, Switch, TableProps, message } from "antd";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAccounts, setAccountLock, setAccountSelected, setPagination } from "../../redux/reducer-type/AccountReducer";
import { FaUser } from "react-icons/fa";
import { IAccount } from "../../types";
import { TablePaginationConfig, TableRowSelection } from "antd/es/table/interface";
import CreateAccount from "../../components/Account/CreateAccount";
import { current } from "@reduxjs/toolkit";

const { Column } = Table;

interface DataType {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: number;
  avatar?: string;
  isLock: boolean;
  isCreated: boolean;
}


const Account = () => {
  const base_url = import.meta.env.VITE_BE_URL;

  const { accounts,totalStaff,pagination } = useAppSelector((state) => state.account);
  const [displayData, setDisplayData] = useState<IAccount[]>([]);
  const dispatch = useAppDispatch();
  const axios = usePrivateAxios();
//   const [pagination, setPagination] = useState<TablePaginationConfig>({
//     current: 1,
//     pageSize: 2,
// });
  useEffect(() => {
    dispatch(fetchAccounts({axiosInstance:axios,limit:pagination.pageSize!,page:pagination.current!})); // Pass axios instance to thunk
    console.log(accounts)
  }, []);
  const handleChangePage = (page:number,pageSize:number)=>{
    dispatch(fetchAccounts({axiosInstance:axios,limit:pageSize,page:page})); // Pass axios instance to thunk

  }
  useEffect(() => {
    if (accounts.length !== 0) {
      const dataSource = accounts.map<IAccount>((element, i) => {
        return {
          ...element,
          key: i,
        };
      });
      setDisplayData(dataSource);
    } else {
      setDisplayData([]);
    }
  }, [accounts]);
  const rowSelection: TableProps<IAccount>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IAccount[]) => {
    
      dispatch(setAccountSelected(selectedRows))
    },
  };
  const handleResend = async(id:string)=>{

    await axios.post("/account/resend", {
      id
    }).then((res)=>{
      console.log(res.data.data)
     
    }).catch((err)=>{
      message.error(err.response.data.message);

    })
  }
  const handleUpdateStatus = async(id:string,status:boolean)=>{
    dispatch(setAccountLock({id,isLock:status}))
    await axios.put("/account/status",{id,status})
    .then((res)=>{
      message.success(`Successfully! Account ${status?"lock":"unlock"} successfully`);
    }).catch((err)=>{
      message.error(err.response.data.message);

    })
  }
  return (
    <Table<IAccount>
      dataSource={displayData}
      rowSelection={{ type: "checkbox", ...rowSelection }}
      pagination={{
        pageSize: pagination.pageSize,
        showQuickJumper: true,
        showSizeChanger: true,
        total:totalStaff,

        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: ["2", "4", "5"],
        onChange: (page, pageSize) => {
            // setPagination({
            //     current: page,
            //     pageSize,
            // });
            dispatch(setPagination({page,pageSize}))
            handleChangePage(page,pageSize)
        },
      }}
    >
      <Column title="Name" dataIndex="name" key="name" />
      <Column title="Email" dataIndex="email" key="email" />
      <Column title="Username" dataIndex="username" key="username" />
      <Column
        title="Role"
        dataIndex="role"
        key="role"
        render={(role: number) => (role === 0 ? "Admin" : "Staff")}
      />
      <Column
        title="Avatar"
        dataIndex="avatar"
        key="avatar"
        render={(avatar: string | undefined) => (
          <Avatar src={`${base_url + "/" +avatar}`} icon={<FaUser />} />
        )}
      />
      <Column
        title="Lock"
        dataIndex="isLock"
        key="isLock"
        render={(isLock: boolean,record:IAccount) => <Switch checked={isLock} onChange={(checked)=>{handleUpdateStatus(record._id,checked)}}/>}
      />
      <Column
        title="Created"
        dataIndex="isCreated"
        key="isCreated"
        render={(isCreated: boolean) =>
          isCreated ? (
            <Tag color="green">Created</Tag>
          ) : (
            <Tag color="volcano">Not Created</Tag>
          )
        }
      />
      <Column
        title="Action"
        key="action"
        render={(_: any, record: IAccount) => (
          <Space size="middle">
            <span className="cursor-pointer" onClick={()=>{handleResend(record._id)}}>Resend Email</span>
          </Space>
        )}
      />
     
    </Table>
  );
};

export default Account;
