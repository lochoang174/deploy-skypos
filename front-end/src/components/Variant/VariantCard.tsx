import { useState } from "react";
import { BiSolidMemoryCard } from "react-icons/bi";
import { FaMemory } from "react-icons/fa";
import { FaBarcode } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { Avatar, Badge, Dropdown, MenuProps, Progress } from "antd";
import { IoIosColorPalette } from "react-icons/io";
import { IProduct, IVariant } from "../../types";
import UpdateForm from "./UpdateForm";
import { EModal } from "../../pages/product/Product";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import DetailForm from "./DetailForm";
import { useAuth } from "../../hooks/useAuth";

type VariantCardProps = {
    currentProduct: IProduct;
    _id: string;
    variant: IVariant;
    onDelete?: () => void;
    setIsModalOpen: (value: EModal) => void;
    setId: (value: string) => void;
};

const VariantCard: React.FC<VariantCardProps> = (props: VariantCardProps) => {
    const [isVisible, setIsVisible] = useState(true);
    // const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);
    const { auth } = useAuth();
    // Handle delete with animation
    // const handleDelete = () => {
    //     // Start the delete animation and remove after it's done
    //     setIsVisible(false);
    //     setTimeout(() => {
    //         props.onDelete();
    //     }, 300); // Matches animation duration
    // };

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: <span>Update</span>,
            icon: <FiEdit />,
            onClick: () => {
                props.setId(props._id);
                props.setIsModalOpen(EModal.UPDATE);
            },
        },
        {
            key: "2",
            label: <span>Delete</span>,
            icon: <FiTrash2 />,
            onClick: () => {
                props.setId(props._id);
                props.setIsModalOpen(EModal.DELETE);
            },
        },
    ];
    return (
        <>
            <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                <div
                    className={`max-w-xs rounded-2xl cursor-pointer  relative border border-gray-300  shadow-lg bg-white transform transition duration-300 ease-in-out aspect-[2/3] hover:shadow-2xl ${
                        isVisible ? "animate-fade-in" : "animate-fade-out"
                    }`}
                    onContextMenu={(e) => {
                        e.preventDefault();
                    }}
                    onClick={(e) => {
                        e.preventDefault();
                        props.setId(props._id);
                        props.setIsModalOpen(EModal.DETAIL);
                    }}
                >
                    <div className="overflow-hidden h-3/5">
                        <img
                            className="w-full h-full p-3 object-cover transform hover:scale-105 transition duration-300 ease-in-out rounded-3xl"
                            src={
                                import.meta.env.VITE_BE_URL +
                                "/public/images/" +
                                props.currentProduct._id +
                                "/" +
                                props._id +
                                "/" +
                                props.variant.images[0]
                            }
                            // alt={props.title}
                        />
                    </div>
                    <div className="xl:scale-110 xl:mx-6 xl:py-4  ">
                        <div className="flex pt-2  items-center justify-between border-t">
                            <div className="font-bold text-sm">{props.currentProduct.productName}</div>
                            <Badge dot={props.variant.status}>
                                <div className="p-1 bg-slate-400 text-white rounded-lg text-xs">
                                    {props.variant.status ? "Available" : "Unavailable"}
                                </div>
                            </Badge>
                        </div>
                        <div className="pb-1 flex gap-2 items-center">
                            <span className="font-bold text-base text-primary-red">
                                {props.variant.retailPrice}
                            </span>
                            <span className="font-bold text-xs text-gray-400">
                                {auth?.role === 0 ? props.variant.importPrice : "N/A"}
                            </span>
                        </div>
                        <div className="flex pb-4">
                            <div className="flex flex-col justify-between items-start w-3/5 gap-1">
                                <div className="flex items-center gap-1">
                                    <BiSolidMemoryCard />
                                    <span className="font-bold text-xs">{props.variant.ram}GB</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <AiOutlineStock />
                                    <span className="font-bold text-xs">{props.variant.quantityInStock}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaBarcode />
                                    <span className="font-bold text-xs">{props.variant.barcode}</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-start ">
                                <div className="flex items-center gap-1">
                                    <FaMemory />
                                    <span className="font-bold text-xs">{props.variant.storage}GB</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <img src="/sold.png" alt="stock" className="w-4 h-4" />
                                    <span className="font-bold text-xs leading-none">
                                        {props.variant.quantitySold}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <IoIosColorPalette />
                                    <span
                                        className="w-4 h-4 rounded-full border-2 shadow-xl"
                                        style={{ backgroundColor: props.variant.color }}
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dropdown>
        </>
    );
};

export default VariantCard;
