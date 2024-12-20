import { create } from 'zustand';
import { User, Badge } from '../types';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  addExperience: (points: number) => void;
  addBadge: (badge: Badge) => void;
}

const calculateLevel = (exp: number) => Math.floor(Math.sqrt(exp / 100)) + 1;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (user) => set({ 
    user: { 
      ...user, 
      experience: user.experience || 0,
      level: calculateLevel(user.experience || 0),
      badges: user.badges || []
    } 
  }),
  logout: () => set({ user: null }),
  addExperience: (points) => 
    set((state) => {
      if (!state.user) return state;
      const newExperience = (state.user.experience || 0) + points;
      const newLevel = calculateLevel(newExperience);
      
      return {
        user: {
          ...state.user,
          experience: newExperience,
          level: newLevel
        }
      };
    }),
  addBadge: (badge) =>
    set((state) => {
      if (!state.user) return state;
      const badges = [...(state.user.badges || [])];
      if (!badges.some(b => b.id === badge.id)) {
        badges.push(badge);
      }
      return {
        user: {
          ...state.user,
          badges
        }
      };
    })
}));