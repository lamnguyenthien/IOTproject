import React, { useEffect, useState } from 'react';
import Switch from '../components/Switch';
import Card from '../components/Card';
import clsx from 'clsx';
import { FaGasPump, FaLightbulb, FaTemperatureLow } from 'react-icons/fa6';
import { WiHumidity } from 'react-icons/wi';
import { BsMoisture } from 'react-icons/bs';
import { LiaRulerVerticalSolid } from 'react-icons/lia';
import { FaExchangeAlt } from 'react-icons/fa';
import { useAppContext } from '../AppProvider';
import Header from '../components/Header';
import DashBoard from '../components/DashBoard';
import { CiCloudSun } from 'react-icons/ci';
import useData from '../utils/useData';
import { toast } from 'react-toastify';

const Home = () => {
  const {isNavActive} = useAppContext();
  const [clientData, setClientData] = useState(null);
  const [data, setData] = useState(new Array(5).fill(0).map(() => {
    return {
      temperature: 0,
      humidity: 0,
      moisture: 0,
      water: 0,
      light: 0,
      measure_time: new Date(0).toLocaleDateString()
  }}));
  const [clientStatus, setClientStatus] = useState(null);
  const [status, setStatus] = useState({
    manual: false,
    pump: false,
    led: false
  });
  const {user} = useAppContext();
  useEffect(() => {
    const client = new WebSocket('ws://localhost:8000/ws/data');
    setClientData(client);
    client.onopen = () => {
      console.log('Connected to server');
    };
    client.onmessage = onMessageData;
    return () => {
      client.close();
    }
  }, []);

  useEffect(() => {
    const client = new WebSocket('ws://localhost:8000/ws/status');
    setClientStatus(client);
    client.onopen = () => {
      console.log('Connected to server');
    };
    client.onmessage = onMessageStatus;
    return () => {
      client.close();
    }
  }, [])

  useData(async () => {
    if(user == null) return;
    const request = await fetch('http://localhost:8000/device/data/latest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }});
    const response = await request.json();
    if(response != null)
    {
      const d = response.result;
      for(let i = 0; i < 5 - response.length; i++)
        d.push({
          temperature: 0,
          humidity: 0,
          moisture: 0,
          water: 0,
          light: 0,
          measure_time: 0
        });
      d.map(item => {
        item.measure_time = new Date(item.measure_time + 7*60*60*1000).toLocaleString();
        return item
      });
      setData(pre => d);
    }
    else 
      toast.error('Failed to fetch data');
  }, [])

  const onMessageData = async (message) => {
    setData(pre => {
      const d = JSON.parse(message.data);
      d.measure_time = new Date(d.measure_time + 7*60*60*1000).toLocaleString();
      pre.pop();
      pre.unshift(d);
      return pre;
    })
  }

  const onMessageStatus = async (message) => {
    setStatus(JSON.parse(message.data));
    console.log(JSON.parse(message.data))
  }

  const setToggle = async (type) => {
    switch(type) {
      case "MANUAL":
        await fetch('http://localhost:8000/device/change-mode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }})
        setStatus(pre => ({...pre, manual: !pre.manual}));
        if (data[0].water < 2) {
          toast.warning('Mực nước thấp, không thể bật bơm');
        }
        break;
      case "PUMP":
        if (status.manual && data[0].water >= 2) {
          await fetch('http://localhost:8000/device/water-pump', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          setStatus(pre => ({ ...pre, pump: !pre.pump }));
        } else if (data[0].water < 2) {
          toast.warning('Mực nước thấp, không thể bật bơm');
        }
        break;
      case "LED":
        if(status.manual)
        {
          await fetch('http://localhost:8000/device/light', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }})
          setStatus(pre => ({...pre, led: !pre.led}));
        }
        break;
      default:
        break;
    }
    console.log(type);
  };

  useEffect(() => {
    console.log(data)
  }, [])

  

  return (
    <div className={clsx(`transition-all duration-500 flex flex-col w-full h-full`, isNavActive ? 'ml-20' : 'ml-48')}>
      <Header/>
      <div className="grid grid-cols-5 gap-8 p-8">
        <Card title="Nhiệt độ" value={data[0].temperature} icon={<FaTemperatureLow size={50} />} />
        <Card title="Độ ẩm không khí" value={`${data[0].humidity}%`} icon={<WiHumidity size={50} />} />
        <Card title="Độ ẩm đất" value={`${data[0].moisture}%`} icon={<BsMoisture size={50} />} />
        <Card title="Mức nước" value={`${data[0].water}cm`} icon={<LiaRulerVerticalSolid size={50}/>} />
        <Card title="Ánh sáng" value={`${data[0].light}`} icon={<CiCloudSun size={50}/>} />
      </div>

      <div className="flex justify-around gap-8 p-8 flex-1">
        <div className="bg-white p-6 shadow-lg rounded-lg flex-1">
          <div className="h-full flex w-full">
            <DashBoard realData={data}/>
          </div>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg space-y-4 w-fit flex flex-col h-1/4">
          <Switch title="LED" icon={<FaLightbulb size={50} color='gray' />} handleToggle={async() => await setToggle("LED")} toggleState={status.led}/>
          <Switch 
            title="BƠM" 
            icon={<FaGasPump size={50} color='gray' />} 
            handleToggle={async () => await setToggle("PUMP")} 
            toggleState={status.pump} 
          />
          <Switch title="MANUAL" icon={<FaExchangeAlt size={50} color='gray' />} handleToggle={async() => await setToggle("MANUAL")} toggleState={status.manual}/>
        </div>
      </div>
    </div>);
};

export default Home;