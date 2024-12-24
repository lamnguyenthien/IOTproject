import { CategoryScale, Chart, LinearScale, LineElement, PointElement } from "chart.js";
import { Data } from "../utils/fakeData";
import LineChart from "./LineChart";
import { useState } from "react";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

export default function DashBoard({realData}) {
    return (
        <div className="h-full w-full flex p-4">
            <div className="grid grid-cols-2 gap-4 w-full">
                <div><LineChart realData={realData} title={"Nhiệt độ"} type={"temperature"}/></div>
                <div><LineChart realData={realData} title={"Độ ẩm"} type={"humidity"}/></div>
                <div><LineChart realData={realData} title={"Độ ẩm đất"} type={"moisture"}/></div>
                <div><LineChart realData={realData} title={"Nước"} type={"water"}/></div>
            </div>
        </div>
    )
}