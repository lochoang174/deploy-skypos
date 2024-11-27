import React, { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";

export function DashboardHeader({ role }: { role: number }) {
    const { statistics, detailData } = useAppSelector((state) => state.statistic);

    useEffect(() => {
        console.log("Detail Data", detailData);
        console.log("Statistics", statistics);
    }, [statistics, detailData]);
    return (
        <div className="flex gap-3 px-5">
            <div className="text-primary-green bg-primary-bg-green rounded-lg p-2 py-1 text-sm w-fit flex items-center gap-2">
                <div>Total Amount Received</div>
                <span className="text-2xl">{statistics.totalAmountReceived}</span>
            </div>
            {role === 0 && (
                <div className="text-primary-blue bg-primary-bg-blue rounded-lg p-2 py-1 text-sm w-fit flex items-center gap-2">
                    <div>Total Profit</div>
                    <span className="text-2xl">{statistics.profit}</span>
                </div>
            )}
        </div>
    );
}
