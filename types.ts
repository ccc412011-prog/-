
export enum AppTab {
  HOME = 'home',
  CALENDAR = 'calendar',
  PROFILE = 'profile',
  SCHEDULE = 'schedule',
  GROWTH = 'growth'
}

export type CatBreed = 'orange' | 'calico' | 'tuxedo' | 'siamese';

export enum SportType {
  WALK = '散步',
  JOGGING = '慢跑',
  CYCLING = '骑行',
  BADMINTON = '打羽毛球',
  RUNNING = '跑步',
  ROPE_JUMPING = '跳绳',
  HIKING = '爬山',
  YOGA = '户外瑜伽',
  FRISBEE = '飞盘',
  FAST_WALK = '快走',
  NIGHT_RUN = '晨跑/夜跑',
  STRETCH = '公园拉伸',
  OTHER = '其他'
}

export interface ScheduleItem {
  id: string;
  startTime: string; 
  endTime: string;   
  task: string;
  date: string;      
}

export interface CheckIn {
  date: string;      
  type: SportType;
}

export interface CatState {
  name: string;
  breed: CatBreed;
  weight: number;
  foodCount: number;
  canCount: number;
  stripCount: number;
  unlockedToys: string[];
  streakDays: number;
  lastCheckInDate: string | null;
  lastFeedingDate: string | null;
  totalCheckIns: number;
}

export interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'overcast' | 'rainy';
  wind: string;
  location: string;
}

export interface UserData {
  schedules: ScheduleItem[];
  checkIns: CheckIn[];
  cat: CatState;
}
