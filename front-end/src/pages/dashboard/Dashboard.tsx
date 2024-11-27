import { DatePicker, Select } from "antd";
import type { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import BarChart from "../../components/Dashboard/BarChart";
const { RangePicker } = DatePicker;
import { setSelectedDate, setSelectedDateRange } from "../../redux/reducer-type/StatisticReducer";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const Dashboard = () => {
    const { selectedDate, selectedDateRange } = useAppSelector((state) => state.statistic);
    const dispatch = useAppDispatch();

    const [rangePicket, setRangePicker] = React.useState<
        [start: Dayjs | null | undefined, end: Dayjs | null | undefined]
    >([null, null]);

    return (
        <div>
            <div className="flex justify-between px-5 pt-3">
                <RangePicker
                    value={rangePicket}
                    onChange={(value, dateString) => {
                        dispatch(setSelectedDateRange(dateString));
                        dispatch(setSelectedDate(""));
                        setRangePicker(
                            value as [start: Dayjs | null | undefined, end: Dayjs | null | undefined]
                        );
                    }}
                />
                <Select
                    style={{ width: 200 }}
                    onSelect={(value) => {
                        dispatch(setSelectedDate(value as string));
                        dispatch(setSelectedDateRange(["", ""]));
                        setRangePicker([null, null]);
                    }}
                    value={selectedDate || undefined}
                    placeholder="Select date range"
                >
                    <Select.Option value="within-7-days">Within the last 7 days</Select.Option>
                    <Select.Option value="yesterday">Yesterday</Select.Option>
                    <Select.Option value="today">Today</Select.Option>
                    <Select.Option value="this-month">This month</Select.Option>
                </Select> 
            </div>

            <BarChart selectedDate={selectedDate} selectDateRange={selectedDateRange} />
        </div>
    );
};

export default Dashboard;
