import { Button } from "antd";
import React, { useState } from "react";
import CreateAccount from "../Account/CreateAccount";
import DeleteAccount from "../Account/DeleteAccount";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchAccounts } from "../../redux/reducer-type/AccountReducer";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { FaRedo, FaTrashAlt, FaPlus } from "react-icons/fa";

export function AccountHeader() {
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const { pagination } = useAppSelector((state) => state.account)
  const axios = usePrivateAxios()
  const handleReload = async () => {
    dispatch(fetchAccounts({ axiosInstance: axios, limit: pagination.pageSize!, page: pagination.current! })); // Pass axios instance to thunk

  }
  return (
    <>
      <div className="flex gap-2 mr-5">
        <Button
          color="default"
          variant="solid"
          size="small"
          onClick={handleReload}
        >
          <FaRedo />
          Reload
        </Button>

        <Button
          color="default"
          variant="solid"
          size="small"
          onClick={() => {
            setOpenDeleteModal(true);
          }}
        >
          <FaTrashAlt />
          Delete
        </Button>

        <Button
          color="default"
          variant="solid"
          size="small"
          onClick={() => {
            setOpenCreateModal(true);
          }}
        >
          <FaPlus />
          Add
        </Button>
      </div>
      <DeleteAccount
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      ></DeleteAccount>
      <CreateAccount
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />
    </>
  );
}
