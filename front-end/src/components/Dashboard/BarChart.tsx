import React, { useEffect } from "react";
import { Column } from "@ant-design/plots";
import NoData from "../Variant/NoData";
import { useNavigate } from "react-router-dom";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    fetchStatisticsToday,
    fetchStatisticsYesterday,
    fetchStatisticsWithinSevenDays,
    fetchStatisticsThisMonth,
    setDetailData,
    fetchStatisticsByDate,
} from "../../redux/reducer-type/StatisticReducer";
import { Spin, Table, TableProps } from "antd";
import { IDetail } from "../../types";
import { set } from "@ant-design/plots/es/core/utils";

type TProps = {
    selectedDate: string;
    selectDateRange: [string, string] | null; // Custom date range [startDate, endDate]
};
export default function BarChart(props: TProps) {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const axios = usePrivateAxios();

    // const [detail, setDetail] = React.useState<IDetail[]>([]);
    const { loading, detailData, detail } = useAppSelector((state) => state.statistic);

    const dataSource = detail.map((item) => {
        return {
            ...item,
            key: item.date,
        };
    });

    useEffect(() => {
        if (props.selectDateRange?.[0] !== "" && props.selectDateRange?.[1] !== "") {
            dispatch(
                fetchStatisticsByDate({
                    axiosInstance: axios,
                    startDate: props.selectDateRange?.[0],
                    endDate: props.selectDateRange?.[1],
                })
            );
            return;
        } else {
            switch (props.selectedDate) {
                case "today":
                    dispatch(fetchStatisticsToday({ axiosInstance: axios }));
                    break;
                case "yesterday":
                    dispatch(fetchStatisticsYesterday({ axiosInstance: axios }));
                    break;
                case "within-7-days":
                    dispatch(fetchStatisticsWithinSevenDays({ axiosInstance: axios }));
                    break;
                case "this-month":
                    dispatch(fetchStatisticsThisMonth({ axiosInstance: axios }));
                    break;
            }

            return () => {
                dispatch(setDetailData([]));
            };
        }
    }, [props.selectedDate, dispatch, axios, props.selectDateRange]);

    const config = {
        data: detailData,

        xField: "date",
        yField: "total",
        colorField: "name",
        group: true,
        style: {
            inset: 5,
            cursor: "pointer",
        },
        onReady: ({ chart }: { chart: any }) => {
            try {
                chart.on("element:click", (evt: any) => {
                    const { data } = evt;
                    navigate("/home/detail-transaction", { state: { date: data?.data.date } });
                });
                chart.on("afterrender", () => {
                    chart.emit("legend:filter", {
                        data: { channel: "color", values: ["Number Of Orders", "Number Of Products Sold"] },
                    });
                });
            } catch (e) {
                console.error(e);
            }
        },
    };

    const columns: TableProps<IDetail>["columns"] = [
        {
            title: "Number Of Orders",
            key: "numOfTransaction",
            dataIndex: "numOfTransaction",
        },
        {
            title: "Number Of Products Sold",
            key: "numOfProduct",
            dataIndex: "numOfProduct",
        },
        {
            title: "Date",
            key: "date",
            dataIndex: "date",
        },
    ];

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <div>
                    {config.data.length > 0 && props.selectedDate !== "this-month" ? (
                        <Column {...config} />
                    ) : props.selectedDate === "this-month" ||
                      (props.selectDateRange?.[0] !== "" && props.selectDateRange?.[1] !== "") ? (
                        <Table<IDetail>
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        navigate("/home/detail-transaction", {
                                            state: { date: record.date },
                                        });
                                    },
                                };
                            }}
                        />
                    ) : (
                        <NoData />
                    )}
                </div>
            )}
        </>
    );
}
