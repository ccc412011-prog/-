
import React, { useState } from 'react';
import CatAvatar from './CatAvatar';
import { CatBreed } from '../types';

interface WelcomeProps {
  onAdopt: (name: string, breed: CatBreed) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onAdopt }) => {
  const [step, setStep] = useState<'login' | 'breed' | 'name'>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [selectedBreed, setSelectedBreed] = useState<CatBreed>('orange');
  const [catName, setCatName] = useState('小橘');

  const breeds: { id: CatBreed; label: string; desc: string }[] = [
    { id: 'orange', label: '橘白猫', desc: '活泼贪吃，容易长胖' },
    { id: 'calico', label: '三花猫', desc: '古灵精怪，性格多变' },
    { id: 'tuxedo', label: '奶牛猫', desc: '精力无限，小小绅士' },
    { id: 'siamese', label: '暹罗猫', desc: '聪明粘人，忠诚伴侣' }
  ];

  const handleLogin = () => {
    if (phone.length === 11) {
      setStep('breed');
    } else {
      alert('请输入正确的11位手机号');
    }
  };

  if (step === 'login') {
    return (
      <div className="h-screen w-full flex flex-col p-8 text-center animate-fade-in justify-between py-16">
        <div>
            <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl shadow-inner animate-bounce-gentle">🐾</div>
            </div>
            <h1 className="text-3xl font-cartoon text-gray-700 mb-2">喵动空间</h1>
            <p className="text-gray-400 mb-12 text-sm px-4 leading-relaxed">陪伴你的每一场户外运动<br/>用汗水换取猫粮，养大心爱的小猫</p>
            
            <div className="space-y-4 w-full text-left">
                <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-orange-50">
                    <label className="text-[10px] text-gray-300 font-bold uppercase ml-2 tracking-widest">手机号码</label>
                    <input 
                        type="tel" 
                        placeholder="请输入手机号"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="w-full bg-transparent p-2 text-xl font-bold text-gray-700 outline-none placeholder:text-gray-100"
                    />
                </div>
                <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-orange-50 flex items-center">
                    <div className="flex-1">
                        <label className="text-[10px] text-gray-300 font-bold uppercase ml-2 tracking-widest">验证码</label>
                        <input 
                            type="text" 
                            placeholder="0000"
                            value={code}
                            onChange={e => setCode(e.target.value.slice(0, 4))}
                            className="w-full bg-transparent p-2 text-xl font-bold text-gray-700 outline-none placeholder:text-gray-100"
                        />
                    </div>
                    <button className="text-xs text-orange-400 font-bold px-5 py-3 bg-orange-50 rounded-2xl btn-squish">获取验证码</button>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <button 
                onClick={handleLogin}
                className="w-full py-5 bg-orange-400 text-white rounded-[2.5rem] text-xl font-bold shadow-lg shadow-orange-100 btn-squish transition-all"
            >
                立即登录 / 注册
            </button>
            <p className="text-[10px] text-gray-300">点击登录即代表同意《用户协议》与《隐私政策》</p>
        </div>
      </div>
    );
  }

  if (step === 'breed') {
    return (
      <div className="h-screen w-full flex flex-col p-8 animate-fade-in">
        <h1 className="text-2xl font-cartoon text-gray-700 mt-8 mb-2 text-center">选择心仪的小猫</h1>
        <p className="text-gray-400 text-xs text-center mb-10">你将负责它的一生，请谨慎选择哦</p>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-14 h-64 flex items-center">
            <CatAvatar status="idle" weight={4.0} breed={selectedBreed} size="lg" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            {breeds.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedBreed(b.id)}
                className={`p-5 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden ${
                  selectedBreed === b.id 
                  ? 'border-orange-400 bg-orange-50 shadow-md scale-105' 
                  : 'border-transparent bg-white shadow-sm opacity-60'
                }`}
              >
                <p className={`font-bold text-lg ${selectedBreed === b.id ? 'text-orange-600' : 'text-gray-500'}`}>{b.label}</p>
                <p className="text-[10px] text-gray-400 mt-1">{b.desc}</p>
                {selectedBreed === b.id && <span className="absolute top-3 right-4 text-orange-400">✨</span>}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setStep('name')}
          className="w-full py-5 bg-orange-400 text-white rounded-[2.5rem] text-xl font-bold shadow-lg shadow-orange-100 mt-10 btn-squish"
        >
          确定领养它 ✨
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col p-8 animate-fade-