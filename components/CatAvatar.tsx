
import React from 'react';
import { CatBreed } from '../types';

interface CatAvatarProps {
  status: 'idle' | 'dropping' | 'chewing' | 'swallowing' | 'happy';
  weight: number;
  breed?: CatBreed;
  size?: 'sm' | 'md' | 'lg';
}

const CatAvatar: React.FC<CatAvatarProps> = ({ status, weight, breed = 'orange', size = 'md' }) => {
  const isFat = weight > 7.0;
  const scale = size === 'sm' ? 0.7 : size === 'lg' ? 1.3 : 1;

  const colors = {
    orange: { main: '#FFB347', stroke: '#E67E22', patch: '#FFFFFF', secondary: '#FFD700' },
    calico: { main: '#FFFFFF', stroke: '#D2D2D2', patch: '#FFB347', secondary: '#4A3C31' },
    tuxedo: { main: '#4A3C31', stroke: '#2C231B', patch: '#FFFFFF', secondary: '#FFFFFF' },
    siamese: { main: '#F5F5DC', stroke: '#D2B48C', patch: '#4A3C31', secondary: '#8B4513' }
  }[breed];

  return (
    <div className={`relative transition-all duration-500 ${status === 'idle' ? 'animate-bounce-gentle' : ''}`} style={{ transform: `scale(${scale})` }}>
      {/* 满足感特效 */}
      {status === 'happy' && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex space-x-3 pointer-events-none">
          <span className="animate-heart text-2xl">🍗</span>
          <span className="animate-heart text-2xl" style={{ animationDelay: '0.2s' }}>🧡</span>
          <span className="animate-heart text-2xl" style={{ animationDelay: '0.4s' }}>✨</span>
        </div>
      )}

      <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-lg">
        {/* 底部阴影 */}
        <ellipse cx="100" cy="185" rx="55" ry="10" fill="rgba(0,0,0,0.05)" />
        
        {/* 身体容器 - 应用吞咽波浪效果 */}
        <g className={status === 'swallowing' ? 'animate-swallow' : ''}>
          {/* 猫咪身体 */}
          <path 
            d={isFat 
              ? "M40 160 Q40 85 100 85 Q160 85 160 160 Q160 195 100 195 Q40 195 40 160" 
              : "M55 160 Q55 95 100 95 Q145 95 145 160 Q145 190 100 190 Q55 190 55 160"
            }
            fill={colors.main} 
            stroke={colors.stroke} 
            strokeWidth="3.5"
            className="transition-all duration-700"
          />
          
          {/* 品种特定花纹 */}
          {breed === 'orange' && (
            <path d={isFat ? "M60 160 Q60 115 100 115 Q140 115 140 160" : "M70 160 Q70 125 100 125 Q130 125 130 160"} fill={colors.patch} opacity="0.9" />
          )}
          {breed === 'tuxedo' && (
            <path d="M100 95 Q80 140 100 195 Q120 140 100 95" fill="#FFFFFF" stroke="#D2D2D2" strokeWidth="1" />
          )}
          {breed === 'calico' && (
            <>
              <circle cx="140" cy="140" r="22" fill={colors.patch} />
              <circle cx="65" cy="165" r="18" fill={colors.secondary} />
            </>
          )}
          {breed === 'siamese' && (
             <path d="M70 180 Q100 165 130 180" stroke={colors.patch} strokeWidth="8" fill="none" opacity="0.3" />
          )}
        </g>

        {/* 头部区域 - 咀嚼时轻微晃动 */}
        <g transform={`translate(0, ${status === 'chewing' ? -3 : 0})`}>
          {/* 耳朵 */}
          <g className={status === 'happy' ? 'animate-pulse' : ''}>
            <path d="M60 55 L32 8 L85 42 Z" fill={breed === 'siamese' ? colors.patch : colors.main} stroke={colors.stroke} strokeWidth="2" />
            <path d="M140 55 L168 8 L115 42 Z" fill={breed === 'siamese' ? colors.patch : colors.main} stroke={colors.stroke} strokeWidth="2" />
            {/* 耳窝 */}
            <path d="M62 50 L45 25 L78 42 Z" fill="#FFC0CB" opacity="0.7" />
            <path d="M138 50 L155 25 L122 42 Z" fill="#FFC0CB" opacity="0.7" />
          </g>

          {/* 圆滚滚的头 */}
          <circle cx="100" cy="78" r="55" fill={colors.main} stroke={colors.stroke} strokeWidth="3.5" />
          
          {/* 暹罗猫面罩/奶牛猫花纹 */}
          {breed === 'siamese' && (
            <ellipse cx="100" cy="85" rx="38" ry="32" fill={colors.patch} />
          )}
          {breed === 'tuxedo' && (
            <path d="M65 35 Q100 65 135 35 L155 85 L45 85 Z" fill={colors.main} />
          )}

          {/* 灵动的眼睛 */}
          <g className={status === 'happy' ? 'opacity-0' : 'animate-blink'}>
            <circle cx="75" cy="75" r="8" fill={breed === 'siamese' ? '#87CEEB' : '#4A3C31'} />
            <circle cx="125" cy="75" r="8" fill={breed === 'siamese' ? '#87CEEB' : '#4A3C31'} />
            <circle cx="73" cy="72" r="3" fill="white" />
            <circle cx="123" cy="72" r="3" fill="white" />
          </g>
          {/* 开心时的眯眯眼 */}
          {status === 'happy' && (
            <>
              <path d="M65 78 Q75 88 85 78" fill="none" stroke="#4A3C31" strokeWidth="4" strokeLinecap="round" />
              <path d="M115 78 Q125 88 135 78" fill="none" stroke="#4A3C31" strokeWidth="4" strokeLinecap="round" />
            </>
          )}

          {/* 粉嫩的小鼻子 */}
          <path d="M96 90 L104 90 L100 96 Z" fill="#FF8C94" />
          
          {/* 嘴巴与面颊 */}
          <path d="M80 96 Q100 115 120 96" fill="none" stroke={colors.stroke} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          
          {/* 动态进食嘴巴 */}
          <g transform="translate(100, 108)">
            {status === 'dropping' || status === 'chewing' ? (
              <ellipse 
                cx="0" cy="6" rx="12" ry={status === 'chewing' ? "8" : "15"} 
                fill="#802020" 
                className={status === 'chewing' ? 'animate-chew' : ''} 
              />
            ) : (
              <path d="M-10 -4 Q0 6 10 -4" fill="none" stroke="#4A3C31" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </g>

          {/* 胡须 */}
          <g stroke={colors.stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
            <line x1="55" y1="85" x2="25" y2="80" />
            <line x1="55" y1="95" x2="22" y2="95" />
            <line x1="145" y1="85" x2="175" y2="80" />
            <line x1="145" y1="95" x2="178" y2="95" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CatAvatar;
