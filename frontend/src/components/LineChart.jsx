import { useState } from "react";
import { Line } from "react-chartjs-2";

export default function LineChart({ realData, type, title}) {
    const data =  {
        labels: Array.from({ length: 5 }, (_, i) => 5 * i),
        datasets: [
            {
                label: title,
                data: realData.map(d => {
                    return d[type];
                }),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2
            }
        ]
    };

    return (
        <div className="w-full h-full flex justify-center flex-col">
            <h2 className="self-center">{title}</h2>
            <Line
                data={data}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: 'Đồ thị biểu diễn dữ liệu',
                        },
                        legend: {
                            position: 'top',
                            display: true
                        }
                    },
                    scales: {
                        x: {
                            type: 'category',
                        },
                        y: {
                            type: 'linear',
                            beginAtZero: true,
                        },
                    },
                }}
            />
        </div>
    )
}