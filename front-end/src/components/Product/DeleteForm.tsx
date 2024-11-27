import { Modal } from "antd";
import React, { useEffect } from "react";
import { IProduct } from "../../types";
import { EModal } from "../../pages/product/Product";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { deleteProduct, fetchProducts } from "../../redux/reducer-type/ProductReducer";
import { setPagination } from "../../redux/reducer-type/AccountReducer";
type TProps = {
    isModalOpen: EModal;
    handleCancel: () => void;
    currentProduct: IProduct | undefined;
};

export default function DeleteForm(props: TProps) {
    const dispatch = useAppDispatch();
    const axios = usePrivateAxios();
    const { pagination, totalProducts } = useAppSelector((state) => state.product);
    const handleSubmit = async () => {
        await axios.delete(`/product/${props.currentProduct?._id}`).then(() => {
            dispatch(deleteProduct(props.currentProduct?._id));

            const isLastPage = Math.ceil(totalProducts / pagination.pageSize!) === pagination.current;
            if (!isLastPage) {
                dispatch(
                    fetchProducts({
                        axiosInstance: axios,
                        page: pagination.current!,
                        limit: pagination.pageSize!,
                        productName: "",
                        categories: [],
                    })
                );
            } else if (isLastPage && pagination.current !== 1) {
                dispatch(
                    fetchProducts({
                        axiosInstance: axios,
                        page: pagination.current! - 1,
                        limit: pagination.pageSize!,
                        productName: "",
                        categories: [],
                    })
                );
                dispatch(
                    setPagination({
                        page: pagination.current! - 1,
                        pageSize: pagination.pageSize!,
                    })
                );
            }
            props.handleCancel();
        });
    };
    return (
        <>
            <Modal
                className="scrollbar-vanish"
                open={props.isModalOpen === EModal.DELETE}
                onCancel={props.handleCancel}
                okButtonProps={{
                    color: "default",
                    variant: "outlined",
                    form: "update-product",
                    onClick: handleSubmit,
                }}
                cancelButtonProps={{
                    color: "default",
                    variant: "outlined",
                }}
                width={400}
            >
                <p>
                    Are you sure you want to delete this
                    <span className="text-[#DC6691] font-semibold"> {props.currentProduct?.productName}</span>
                </p>
            </Modal>
        </>
    );
}
