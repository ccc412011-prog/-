
import React from 'react';
import { UserData, AppTab } from '../types';
import { ICONS } from '../constants';

interface ProfileViewProps {
  userData: UserData;
  updateUserData: (updater: (prev: UserData) => UserData) => void;
  onNavigate: (tab: AppTab) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData, updateUserData, onNavigate }) => {
  return (
    <div className="p-6 h-full flex flex-col space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        <div className="w-24 h-24 bg-orange-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
           <span className="text-5xl">👤</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700">铲屎官大人</h2>
          <p className="text-sm text-gray-400">努力让 {userData.cat.name} 变得圆润</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#E2F3E1] p-5 rounded-3xl text-center shadow-sm">
          <p className="text-[10px] text-green-700 opacity-60 font-bold uppercase">累计打卡</p>
          <p className="text-2xl font-cartoon text-green-800">{userData.cat.totalCheckIns}次</p>
        </div>
        <div className="bg-pink-50 p-5 rounded-3xl text-center shadow-sm">
          <p className="text-[10px] text-pink-700 opacity-60 font-bold uppercase">拥有猫粮</p>
          <p className="text-2xl font-cartoon text-pink-800">{userData.cat.foodCount}份</p>
        </div>
      </div>

      {/* Action Menu */}
      <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100 divide-y divide-gray-50">
        <MenuItem 
          icon={ICONS.CALENDAR} 
          label="日程管理" 
          onClick={() => onNavigate(AppTab.SCHEDULE)} 
        />
        <MenuItem 
          icon={ICONS.FOOTPRINT} 
          label="运动记录" 
          onClick={() => onNavigate(AppTab.CALENDAR)} 
        />
        <MenuItem 
          icon={ICONS.CAT} 
          label="小猫成长" 
          onClick={() => onNavigate(AppTab.GROWTH)} 
        />
        <MenuItem 
          icon="🛡️" 
          label="关于 MiaoMotion" 
          onClick={() => alert("MiaoMotion v1.0.0\n治愈系运动打卡平台")} 
        />
      </div>

      {/* Reset Data Button (Developer/User testing) */}
      <button 
        onClick={() => {
          if(confirm("确定要清空所有数据并重新领养小猫吗？")) {
             localStorage.clear();
             window.location.reload();
          }
        }}
        className="mt-auto py-3 text-xs text-gray-300 font-bold hover:text-red-300 transition-colors"
      >
        重置应用数据
      </button>
      
      <p className="text-center text-[10px] text-gray-300 pb-4">Version 1.0.0 (Build 20231027)</p>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors rounded-2xl"
  >
    <div className="flex items-center space-x-4">
      <span className="text-xl bg-orange-50 w-10 h-10 flex items-center justify-center rounded-xl">{icon}</span>
      <span className="font-bold text-gray-600">{label}</span>
    </div>
    <span className="text-gray-300">›</span>
  </button>
);

export default ProfileView;
