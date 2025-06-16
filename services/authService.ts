
export const authService = {
    
    async login(email: string, password: string) {
      
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiBaseUrl; 
  
      try {
        
        const response = await fetch(`${apiUrl}/auth/jwt/create/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }) 
        });
  
        
        if (!response.ok) {
          throw new Error('Login inválido! Verifique suas credenciais.');
        }
  
        
        return await response.json();
      } catch (error: any) {
        
        throw new Error(error.message);
      }
    },
  
    
    async fetchUserData(token: string, email: string) {
      
      const config = useRuntimeConfig();
      const apiUrl = config.public.apiBaseUrl;
  
      try {
        
        const response = await fetch(`${apiUrl}/usuario/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });
  
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário.');
        }
  
        
        const userData = await response.json();
  
        
        return userData.results.find((u: any) => u.email === email) || null;
      } catch (error: any) {
        
        throw new Error(error.message);
      }
    }
  };
  