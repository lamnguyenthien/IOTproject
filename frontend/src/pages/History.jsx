import React, { useState } from 'react';
import Header from '../components/Header';
import { useAppContext } from '../AppProvider';
import useData from '../utils/useData';

export default function Dashboard() {
    const { isNavActive } = useAppContext();
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);
    const [data, setData] = useState([]);
    const [size, setSize] = useState(10);

    useData(async () => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
        const request = await fetch(`http://localhost:8000/device/data?page=${page}&size=${size}`, options);
        const response = await request.json();
        const result = response.result;
        setData(result.data);
        setLastPage(result.total_page);
        console.log(result.total_page);
    }, []);

    const onPageChange = async (type) => { 
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
        var request;
        if (type === "next") {
            if (page === lastPage) return;
            request = await fetch(`http://localhost:8000/device/data?page=${page + 1}&size=${size}`, options);
            setPage(pre => pre + 1);
        }
        else if(type === "last") {
            if(page === lastPage) return;
            request = await fetch(`http://localhost:8000/device/data?page=${lastPage}&size=${size}`, options);
            setPage(lastPage);
        }
        else if(type === "prev") {
            if (page === 0) return;
            request = await fetch(`http://localhost:8000/device/data?page=${page - 1}&size=${size}`, options);
            setPage(pre => pre - 1);
        }
        else {
            if (page === 0) return;
            request = await fetch(`http://localhost:8000/device/data?page=0&size=${size}`, options);
            setPage(0);
        }
        const response = await request.json();
        const result = response.result
        setData(result.data);
    }

    const onSizeChange = async (e) => {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
        const request = await fetch(`http://localhost:8000/device/data?page=0&size=${e.target.value}`, options);
        const response = await request.json();
        const result = response.result;
        setData(result.data);
        setLastPage(result.total_page);
        setSize(e.target.value);
    }

    return (
        <div className={`min-h-screen w-full bg-[#DFDFDF] flex flex-col ${isNavActive ? `ml-20` : `ml-48`}`}>
            <Header />
            <div className="px-[10px]">
                <table className="border-collapse my-[25px] text-[1.2em] min-w-[400px] w-full bg-white">
                    <thead>
                        <tr className="bg-[#009879] text-white text-center font-bold">
                            <th className="p-[12px_15px]">Nhiệt độ</th>
                            <th className="p-[12px_15px]">Độ ẩm</th>
                            <th className="p-[12px_15px]">Độ ẩm đất</th>
                            <th className="p-[12px_15px]">LED</th>
                            <th className="p-[12px_15px]">Nước</th>
                            <th className="p-[12px_15px]">Thời gian tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((_, index) => (
                            <tr key={index} className="border-b border-[#dddddd] text-center last:border-b-2 last:border-[#009879]">
                                <td className="p-[12px_15px]">{_.temperature}°C</td>
                                <td className="p-[12px_15px]">{_.humidity}%</td>
                                <td className="p-[12px_15px]">{_.moisture}%</td>
                                <td className="p-[12px_15px]">{_.light}</td>
                                <td className="p-[12px_15px]">{_.water}cm</td>
                                <td className="p-[12px_15px]">{new Date(_.measure_time*1000).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: 'Asia/Ho_Chi_Minh'
                                })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination flex justify-center items-center space-x-4 mt-4">
                <button
                    className={`px-4 py-2 ${page != 0 ? `bg-[#287bff] hover:bg-[#1c5fc7]` : `bg-gray-400`} text-white rounded`}
                    onClick={() => onPageChange("first")}
                >Trang đầu</button>
                <button
                    className={`px-4 py-2 ${page != 0 ? `bg-[#287bff] hover:bg-[#1c5fc7]` : `bg-gray-400`} text-white rounded`}
                    onClick={() => onPageChange("prev")}
                >Trước</button>
                <span id="page-number">Page: {page + 1}</span>
                <button
                    className={`px-4 py-2 text-white rounded ${page != lastPage ? `bg-[#287bff] hover:bg-[#1c5fc7]` : `bg-gray-400`}`}
                    onClick={() => onPageChange("next")}
                >Tiếp</button>
                <button
                    className={`px-4 py-2 text-white rounded ${page != lastPage ? `bg-[#287bff] hover:bg-[#1c5fc7]` : `bg-gray-400`}`}
                    onClick={() => onPageChange("last")}
                >Trang cuối</button>
                <select onChange={onSizeChange}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
}