import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchTransactionById } from "../../redux/reducer-type/TransactionReducer";

type TProps = {
    isModalOpen: boolean;
    handleCancel: () => void;
    transactionId: string;
};

export default function DetailTransactionModal({ isModalOpen, handleCancel, transactionId }: TProps) {
    const axios = usePrivateAxios();
    const dispatch = useAppDispatch();
    const { selectedTransaction } = useAppSelector((state) => state.transaction);

    useEffect(() => {
        dispatch(fetchTransactionById({ axiosInstance: axios, id: transactionId }));
    }, [dispatch, axios, transactionId]);

    return (
        <Modal
            className="scrollbar-vanish !w-fit"
            open={isModalOpen}
            centered
            onCancel={handleCancel}
            footer={[
                <Button key="close" onClick={handleCancel}>
                    Close
                </Button>,
            ]}
        >
            <div className="p-4">
                <h1 className="text-lg font-semibold mb-4">Transaction Details</h1>

                <div className="space-y-2">
                    <p>
                        <strong>Transaction ID:</strong> {selectedTransaction?._id || "N/A"}
                    </p>
                    <p>
                        <strong>Customer:</strong>{" "}
                        {selectedTransaction?.Customer?.name || "No customer data available"}
                    </p>
                    <p>
                        <strong>Total Amount:</strong> {selectedTransaction?.totalAmount || "N/A"}
                    </p>
                    <p>
                        <strong>Amount Paid:</strong> {selectedTransaction?.amountPaid || "N/A"}
                    </p>
                    <p>
                        <strong>Refund:</strong> {selectedTransaction?.refund || "N/A"}
                    </p>
                    <p>
                        <strong>Staff:</strong> {selectedTransaction?.staffName || "N/A"}
                    </p>
                    <p>
                        <strong>Status:</strong> {selectedTransaction?.status || "N/A"}
                    </p>
                    <p>
                        <strong>Created At:</strong>{" "}
                        {selectedTransaction?.createdAt &&
                            new Date(selectedTransaction?.createdAt).toLocaleString()}
                    </p>
                    <p>
                        <strong>Updated At:</strong>{" "}
                        {selectedTransaction?.updatedAt &&
                            new Date(selectedTransaction?.updatedAt).toLocaleString()}
                    </p>
                </div>

                <div className="mt-6">
                    <h2 className="text-md font-semibold mb-2">Products</h2>
                    <table className="table-auto w-full border-collapse border border-gray-300 text-left text-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="px-4 py-2">Product</th>
                                <th className="px-4 py-2">Barcode</th>

                                <th className="px-4 py-2">Price</th>
                                <th className="px-4 py-2">Color</th>
                                <th className="px-4 py-2">RAM</th>
                                <th className="px-4 py-2">Storage</th>
                                <th className="px-4 py-2">Quantity</th>
                                <th className="px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedTransaction?.products?.length ? (
                                selectedTransaction.products.map((product) => (
                                    <tr key={`${product.productDetails._id}`} className="border-b border-gray-300">
                                        <td className="px-4 py-2">
                                            {product.productDetails.Product.productName || "N/A"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {product.productDetails.barcode || "N/A"}
                                        </td>
                                        <td className="px-4 py-2">
                                            {product.productDetails.retailPrice || "N/A"}
                                        </td>
                                        <td className="px-4 py-2">{product.productDetails.color || "N/A"}</td>
                                        <td className="px-4 py-2">{product.productDetails.ram || "N/A"}</td>
                                        <td className="px-4 py-2">
                                            {product.productDetails.storage || "N/A"}
                                        </td>
                                        <td className="px-4 py-2">{product.quantity || "N/A"}</td>
                                        <td className="px-4 py-2">{product.total || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">
                                        No products available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}
