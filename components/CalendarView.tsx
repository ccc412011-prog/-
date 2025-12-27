
import React, { useState } from 'react';
import { UserData } from '../types';
import { ICONS } from '../constants';

interface CalendarViewProps {
  userData: UserData;
  onBack: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ userData, onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => i);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getCheckInForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return userData.checkIns.find(c => c.date === dateStr);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-gray-400 text-xl">←</button>
        <h1 className="text-lg font-bold text-gray-700">我的运动打卡日历</h1>
        <div className="w-8"></div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-50">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="text-orange-300 p-2">◀</button>
          <span className="font-bold text-gray-700 text-lg">{year}年 {month + 1}月</span>
          <button onClick={nextMonth} className="text-orange-300 p-2">▶</button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-xs text-gray-400 font-bold mb-2">{d}</div>
          ))}
          {emptyDays.map(d => <div key={`empty-${d}`} />)}
          {days.map(d => {
            const checkIn = getCheckInForDay(d);
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            return (
              <div 
                key={d} 
                onClick={() => checkIn && alert(`${year}-${month + 1}-${d}\n运动类型: ${checkIn.type}`)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all relative ${
                  checkIn ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'
                } ${isToday ? 'ring-2 ring-orange-400 ring-inset' : ''}`}
              >
                {d}
                {checkIn && <span className="text-[10px] absolute bottom-1 leading-none">{ICONS.FOOTPRINT}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100">
        <div className="flex justify-around items-center text-center">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">累计打卡</p>
            <p className="text-2xl font-cartoon text-orange-600">{userData.cat.totalCheckIns} 天</p>
          </div>
          <div className="w-px h-10 bg-orange-200"></div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">连续打卡</p>
            <p className="text-2xl font-cartoon text-orange-600">{userData.cat.streakDays} 天</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1">
         <h3 className="text-sm font-bold text-gray-500 mb-3 px-2">最近动态</h3>
         <div className="space-y-3">
           {userData.checkIns.slice(-5).reverse().map((c, i) => (
             <div key={i} className="flex items-center space-x-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
               <div className="bg-orange-50 w-10 h-10 rounded-full flex items-center justify-center text-orange-400">{ICONS.FOOTPRINT}</div>
               <div>
                 <p className="text-sm font-bold text-gray-700">{c.type}</p>
                 <p className="text-[10px] text-gray-400">{c.date}</p>
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};

export default CalendarView;
