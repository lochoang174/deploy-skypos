import React, { useEffect } from "react";
import { EModal } from "../../pages/product/Product";
import { IProduct, IVariant } from "../../types";
import { Button, Carousel, message, Modal, UploadFile } from "antd";
import { BsArrowLeftCircle, BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { BiSolidMemoryCard } from "react-icons/bi";
import { FaBarcode, FaMemory } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineStock } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/cartSlice";

type TProps = {
    isModalOpen: EModal;
    handleCancel: () => void;
    currentVariant: IVariant | undefined;
    currentProduct: IProduct;
};
export default function DetailForm(props: TProps) {
    const dispatch = useDispatch();
    const [imagesToShow, setImagesToShow] = React.useState<string[]>([]);
    useEffect(() => {
        console.log(props.currentVariant);
        if (!props.currentVariant) return;
        if (props.isModalOpen == EModal.NONE) {
            return;
        }
        const { images = [] } = props.currentVariant || {};

        const convertImage = [] as UploadFile[];
        const updateImages = [] as string[];
        const productId = props.currentVariant?.Product._id ?? props.currentVariant?.Product;
        for (const image of images) {
            const newImage =
                import.meta.env.VITE_BE_URL +
                "/public/images/" +
                productId +
                "/" +
                props.currentVariant?._id +
                "/" +
                image;

            updateImages.push(newImage);

            convertImage.push({
                uid: image || `${Date.now()}-${Math.random()}`,
                name: image,
                status: "done",
                url: newImage,
            });
        }

        setImagesToShow(updateImages);
    }, [props.currentVariant, props.isModalOpen]);

    const handleAddToCart = () => {
        if (!props.currentVariant) return;
        dispatch(addItem(props.currentVariant));
        message.success("Added to cart successfully");
    };

    return (
        <>
            <Modal
                className="scrollbar-vanish !w-fit"
                open={props.isModalOpen == EModal.DETAIL}
                centered
                onCancel={props.handleCancel}
                footer={[
                    <Button
                        key="add-to-cart"
                        type="primary"
                        onClick={handleAddToCart}
                        // disabled={!props.currentVariant?.status || props.currentVariant?.quantityInStock === 0}
                    >
                        Add to Cart
                    </Button>,
                    <Button key="back" onClick={props.handleCancel}>
                        Close
                    </Button>,
                ]}
            >
                <div className="flex justify-center gap-5  w-fit p-5">
                    <div>
                        <div className="font-semibold text-lg ">
                            {props.currentProduct.productName} ({props.currentVariant?.ram}GB |{" "}
                            {props.currentVariant?.storage}GB | {props.currentVariant?.color})
                        </div>
                        <div>
                            <div className="text-sm mb-6">
                                Status :{" "}
                                <span className="text-primary-red ">
                                    {props.currentVariant?.status ? "Avaiable" : "Unavailable"}
                                </span>
                            </div>
                        </div>
                        <Carousel
                            arrows
                            autoplay
                            autoplaySpeed={1500}
                            customPaging={(i) => (
                                <div className="w-5 scale-125">
                                    <img
                                        src={imagesToShow[i]}
                                        alt={`thumbnail-${i}`}
                                        className="object-cover aspect-square border border-black rounded w-full h-full"
                                    />
                                </div>
                            )}
                            draggable
                            prevArrow={<BsArrowLeftCircleFill color="#000000" />}
                            nextArrow={<BsArrowRightCircleFill color="#000000" />}
                            dots={{ className: "custom-dots" }}
                            className="w-[400px] h-[300px] flex justify-center items-center"
                        >
                            {imagesToShow.map((image, index) => (
                                <div key={index} className="flex justify-center items-center">
                                    <img
                                        src={image}
                                        className="w-[400px] h-[300px] object-cover rounded-lg shadow-lg"
                                        alt={`Product variant ${index}`}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                    <div className="flex flex-col items-start gap-4">
                        <div className="bg-[#f5f5f5] py-1 px-3 shadow-sm rounded-md w-64 border-b-2">
                            <div className=" font-semibold text-base">
                                Import Price :{" "}
                                <span className="text-lg font-semibold text-gray-500">
                                    ${props.currentVariant?.importPrice}
                                </span>
                            </div>

                            <div className="text-primary-red font-semibold text-base">
                                Retail Price :{" "}
                                <span className="text-lg font-semibold text-primary-red">
                                    ${props.currentVariant?.retailPrice}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div>
                                <div className="text-base flex items-center gap-1">
                                    <BiSolidMemoryCard />
                                    Ram :
                                    <span className="font-semibold"> {props.currentVariant?.ram}GB </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-base flex items-center gap-1">
                                    <FaMemory />
                                    Storage :
                                    <span className="font-semibold ">{props.currentVariant?.storage}GB</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-base flex items-center gap-1">
                                    <IoIosColorPalette />
                                    Color :{" "}
                                    <span className="font-semibold ">{props.currentVariant?.color}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-base flex items-center gap-1">
                                    <FaBarcode />
                                    Barcode :{" "}
                                    <span className="font-semibold ">{props.currentVariant?.barcode}</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-base flex items-center gap-1">
                                    <AiOutlineStock />
                                    Quantity In Stock :{" "}
                                    <span className="font-semibold ">
                                        {props.currentVariant?.quantityInStock}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="text-base flex items-center gap-1">
                                    <img src="/sold.png" alt="stock" className="w-4 h-4" />
                                    Quantity In Sold :{" "}
                                    <span className="font-semibold ">
                                        {props.currentVariant?.quantitySold}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
