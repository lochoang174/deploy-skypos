import React, { Key, useEffect, useState } from "react";
import { Space, Table, Tag, Avatar, Switch, TableProps, message, Pagination, Button } from "antd";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAccounts, setAccountLock, setAccountSelected, setPagination } from "../../redux/reducer-type/AccountReducer";
import { FaUser } from "react-icons/fa";
import { IAccount } from "../../types";
import { TablePaginationConfig, TableRowSelection } from "antd/es/table/interface";
import CreateAccount from "../../components/Account/CreateAccount";
import { current } from "@reduxjs/toolkit";
import { GrMail, GrView } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const { accounts, totalStaff, pagination } = useAppSelector((state) => state.account);
  const [displayData, setDisplayData] = useState<IAccount[]>([]);
  const dispatch = useAppDispatch();
  const axios = usePrivateAxios();
  const [_id, setId] = useState<string>("")

  //   const [pagination, setPagination] = useState<TablePaginationConfig>({
  //     current: 1,
  //     pageSize: 2,
  // });
  useEffect(() => {
    dispatch(fetchAccounts({ axiosInstance: axios, limit: pagination.pageSize!, page: pagination.current! })); // Pass axios instance to thunk
    console.log(accounts)
  }, []);
  const handleChangePage = (page: number, pageSize: number) => {
    dispatch(setPagination({ page, pageSize }))

    dispatch(fetchAccounts({ axiosInstance: axios, limit: pageSize, page: page })); // Pass axios instance to thunk

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

  const handleViewHistory = (staffId: string) => {
    console.log(staffId)
    navigate(`/home/staff/${staffId}/transactions`);
  }

  const rowSelection: TableProps<IAccount>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IAccount[]) => {

      dispatch(setAccountSelected(selectedRows))
    },
  };
  const handleResend = async (id: string) => {

    await axios.post("/account/resend", {
      id
    }).then((res) => {
      console.log(res.data.data)

    }).catch((err) => {
      message.error(err.response.data.message);

    })
  }
  const handleUpdateStatus = async (id: string, status: boolean) => {
    dispatch(setAccountLock({ id, isLock: status }))
    await axios.put("/account/status", { id, status })
      .then((res) => {
        message.success(`Successfully! Account ${status ? "lock" : "unlock"} successfully`);
      }).catch((err) => {
        message.error(err.response.data.message);

      })
  }
  return (
    <>
      <div className="h-full p-2 flex flex-col justify-between">
        <div className="overflow-auto">
          <Table<IAccount>
            dataSource={displayData}
            rowSelection={{ type: "checkbox", ...rowSelection }}
            pagination={false}
          >
            <Column align="center" title="Name" dataIndex="name" key="name" />
            <Column align="center" title="Email" dataIndex="email" key="email" />
            <Column align="center" title="Username" dataIndex="username" key="username" />
            <Column
              title="Role"
              dataIndex="role"
              key="role"
              align="center"
              render={(role: number) => (role === 0 ? "Admin" : "Staff")}
            />
            <Column
              title="Avatar"
              dataIndex="avatar"
              key="avatar"
              align="center"
              render={(avatar: string | undefined) => (
                <Avatar src={`${base_url + "/" + avatar}`} icon={<FaUser />} />
              )}
            />
            <Column
              title="Lock"
              dataIndex="isLock"
              key="isLock"
              align="center"
              render={(isLock: boolean, record: IAccount) => <Switch checked={isLock} onChange={(checked) => { handleUpdateStatus(record._id, checked) }} />}
            />
            <Column
              title="Created"
              align="center"
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
              align="center"
              render={(_: any, record: IAccount) => (
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                  <Button
                    // color="default"
                    style={{
                      backgroundColor: record.isCreated ? undefined : "#1890ff",
                      borderColor: record.isCreated ? undefined : "#1890ff",
                      color: record.isCreated ? undefined : "white", 
                      opacity: record.isCreated ? 0.6 : 1,
                      // cursor: record.isCreated ? "not-allowed" : "pointer",
                    }}
                    size="large"
                    disabled={record.isCreated} // Disable button if account is created
                    onClick={() => handleResend(record._id)}
                  >
                    <GrMail />
                    Resend Email
                  </Button>

                  <Button
                    color="default"
                    variant="solid"
                    size="large"
                    onClick={() => handleViewHistory(record._id)}
                  >
                    <GrView />
                    View
                  </Button>
                </div>
              )}
            />



          </Table>
        </div>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={totalStaff}
          align="end"
          showQuickJumper
          showSizeChanger
          pageSizeOptions={["5", "10", "20"]}
          onChange={handleChangePage}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} staffs`}
        />
      </div>
    </>
  );
};

export default Account;
