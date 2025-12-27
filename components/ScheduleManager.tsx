
import React, { useState } from 'react';
import { UserData, ScheduleItem } from '../types';
import { ICONS } from '../constants';

interface ScheduleManagerProps {
  userData: UserData;
  updateUserData: (updater: (prev: UserData) => UserData) => void;
  onBack: () => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ userData, updateUserData, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [task, setTask] = useState("");

  const filteredSchedules = userData.schedules.filter(s => s.date === selectedDate);

  const handleAdd = () => {
    if (!task) return;
    const newItem: ScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      startTime,
      endTime,
      task,
      date: selectedDate
    };
    updateUserData(prev => ({
      ...prev,
      schedules: [...prev.schedules, newItem]
    }));
    setTask("");
  };

  const handleDelete = (id: string) => {
    updateUserData(prev => ({
      ...prev,
      schedules: prev.schedules.filter(s => s.id !== id)
    }));
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 text-xl">←</button>
        <h1 className="text-lg font-bold text-gray-700">我的每日日程</h1>
        <button onClick={onBack} className="text-orange-400 font-bold">完成</button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <label className="block text-xs text-gray-400 mb-2 font-bold uppercase">选择日期</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 font-bold"
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {filteredSchedules.length > 0 ? filteredSchedules.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-50 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs text-gray-400">{item.startTime} - {item.endTime}</p>
              <p className="font-bold text-gray-700">{item.task}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
              {ICONS.TRASH}
            </button>
          </div>
        )) : (
          <div className="text-center py-10">
            <p className="text-gray-300 italic">今日暂无安排</p>
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.02)] border-t border-gray-100 space-y-4">
        <h3 className="font-bold text-gray-700 flex items-center">{ICONS.PLUS} 添加新日程</h3>
        <div className="flex space-x-2">
           <input 
            type="time" 
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="flex-1 p-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-600 outline-none"
           />
           <span className="self-center text-gray-300">-</span>
           <input 
            type="time" 
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="flex-1 p-3 bg-gray-50 rounded-2xl text-xs font-bold text-gray-600 outline-none"
           />
        </div>
        <input 
          type="text" 
          placeholder="要做什么？(例如: 上课)" 
          value={task}
          onChange={e => setTask(e.target.value)}
          className="w-full p-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none placeholder:text-gray-300"
        />
        <button 
          onClick={handleAdd}
          className="w-full py-3 bg-orange-400 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-transform"
        >
          确认添加
        </button>
      </div>
    </div>
  );
};

export default ScheduleManager;
