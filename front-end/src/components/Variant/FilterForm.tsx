import { Button, Form, Select, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { setSelectedFilters, setPagination } from "../../redux/reducer-type/VariantReducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
export default function FilterForm() {
    const [filterForm] = Form.useForm();

    const dispatch = useAppDispatch();
    const { selectedFilters, pagination } = useAppSelector((state) => state.variant);

    const [selectedFilter, setSelectedFilter] = useState<Record<string, string | undefined>>({});

    const handleFilterChange = (changedValues: any, allValues: any) => {
        setSelectedFilter(allValues);
    };

    useEffect(() => {
        // Set initial form values when component mounts
        filterForm.setFieldsValue(selectedFilters);
        setSelectedFilter(selectedFilters);
    }, [filterForm, selectedFilters]);

    const removeFilter = (key: string) => {
        const newFilters = { ...selectedFilter };
        delete newFilters[key];
        setSelectedFilter(newFilters);
        filterForm.setFieldsValue({ [key]: undefined });
    };

    useEffect(() => {
        //set filter empty
        if (Object.keys(selectedFilter).length === 0) {
            filterForm.resetFields();
        }
    }, []);

    const filterLabels: Record<string, Record<string, string>> = {
        color: {
            black: "Black",
            white: "White",
            red: "Red",
            blue: "Blue",
            yellow: "Yellow",
            green: "Green",
            pink: "Pink",
            purple: "Purple",
            grey: "Grey",
        },
        ram: {
            "4": "4GB",
            "6": "6GB",
            "8": "8GB",
            "16": "16GB",
            "32": "32GB",
        },
        storage: {
            "64": "64GB",
            "128": "128GB",
            "256": "256GB",
            "512": "512GB",
            "1024": "1TB",
        },
        status: {
            true: "Available",
            false: "Unavailable",
        },
    };

    const handleSubmit = async (value: any) => {
        dispatch(setSelectedFilters(value));
    };
    return (
        <>
            <div className="flex gap-10 items-center p-3 pl-6">
                <Form
                    form={filterForm}
                    autoComplete="off"
                    id="filter-variant"
                    className="flex gap-5"
                    onValuesChange={handleFilterChange}
                    onFinish={handleSubmit}
                >
                    <Form.Item label="Color" name="color" style={{ marginBottom: 0 }}>
                        <Select style={{ width: 90 }}>
                            <Select.Option value="black">Black</Select.Option>
                            <Select.Option value="white">White</Select.Option>
                            <Select.Option value="red">Red</Select.Option>
                            <Select.Option value="blue">Blue</Select.Option>
                            <Select.Option value="yellow">Yellow</Select.Option>
                            <Select.Option value="green">Green</Select.Option>
                            <Select.Option value="pink">Pink</Select.Option>
                            <Select.Option value="purple">Purple</Select.Option>
                            <Select.Option value="grey">Grey</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ram" name="ram" style={{ marginBottom: 0 }}>
                        <Select style={{ width: 75 }}>
                            <Select.Option value="4">4GB</Select.Option>
                            <Select.Option value="6">6GB</Select.Option>
                            <Select.Option value="8">8GB</Select.Option>
                            <Select.Option value="16">16GB</Select.Option>
                            <Select.Option value="32">32GB</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Storage" name="storage" style={{ marginBottom: 0 }}>
                        <Select style={{ width: 85 }}>
                            <Select.Option value="64">64GB</Select.Option>
                            <Select.Option value="128">128GB</Select.Option>
                            <Select.Option value="256">256GB</Select.Option>
                            <Select.Option value="512">512GB</Select.Option>
                            <Select.Option value="1024">1TB</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Status" name="status" style={{ marginBottom: 0 }}>
                        <Select style={{ width: 120 }}>
                            <Select.Option value="true">Available</Select.Option>
                            <Select.Option value="false">Unavailable</Select.Option>
                        </Select>
                    </Form.Item>
                    <Tooltip title="search">
                        <Button shape="circle" htmlType="submit" icon={<SearchOutlined />} />
                    </Tooltip>
                </Form>
                <div className="w-fit">
                    {/* Display selected filters */}
                    {Object.entries(selectedFilter).map(
                        ([key, value]) =>
                            value && (
                                <Tag key={key} className="w-fit" closable onClose={() => removeFilter(key)}>
                                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                                        filterLabels[key][value]
                                    }`}
                                </Tag>
                            )
                    )}
                </div>
            </div>
        </>
    );
}
