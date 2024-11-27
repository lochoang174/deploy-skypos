import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoArrowBackCircle, IoSearchOutline } from "react-icons/io5";
import useDebounce from "../../hooks/useDebounce";
import { EModal } from "../../pages/product/Product";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setPagination, setSearchTerm } from "../../redux/reducer-type/VariantReducer";
import CreateForm from "../Variant/CreateForm";

export default function VariantHeader() {
    const [isModalOpen, setIsModalOpen] = useState<EModal>(EModal.NONE);
    const { searchTerm } = useAppSelector((state) => state.variant);
    const dispatch = useAppDispatch();
    const [search, setSearch] = useState(searchTerm);

    useDebounce(
        () => {
            dispatch(setSearchTerm(search));
        },
        500,
        [search]
    );

    const showModal = () => {
        setIsModalOpen(EModal.CREATE);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
    };

    return (
        <div>
            <div className="pr-5  flex items-center justify-between">
                <div className="flex flex-1 gap-2">
                    <IoArrowBackCircle
                        size={32}
                        className="cursor-pointer transition-all transform  hover:opacity-70 "
                        onClick={() => window.history.back()}
                    />
                    <Input
                        placeholder="Search variant by barcode"
                        prefix={<IoSearchOutline />}
                        className="w-2/3"
                        onChange={handleSearchChange}
                        value={search}
                    />
                </div>

                <Button color="default" variant="solid" size="large" onClick={showModal}>
                    <FaCirclePlus />
                    Add Variant
                </Button>
                <CreateForm isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>
        </div>
    );
}
