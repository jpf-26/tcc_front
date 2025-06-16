
import { defineStore } from 'pinia';


import { authService } from '@/services/authService';


export const useAuthStore = defineStore('auth', {
  
  state: () => ({
    
    user: process.client ? JSON.parse(localStorage.getItem('user') || 'null') : null,

    
    accessToken: process.client ? localStorage.getItem('accessToken') : null,

    
    errorMessage: ''
  }),

  
  actions: {
    
    async login(email: string, password: string, router: any) {
      try {
        
        const data = await authService.login(email, password);

        
        this.accessToken = data.access;

        
        if (process.client) {
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
        }

        
        const user = await authService.fetchUserData(data.access, email);

        
        if (!user) {
          throw new Error('Usuário não encontrado.');
        }

        
        this.user = user;

        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        
        router.push(user.role === 'admin' ? '/admin/' : '/users/');
      } catch (error: any) {
        
        this.errorMessage = error.message;
      }
    },

    
    logout() {
      this.user = null;
      this.accessToken = null;
      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }
});
