import { useAuth as useAuthContext } from '@/context/AuthProvider';
import * as authService from '@/services/auth.service';

export function useAuth() {
  const auth = useAuthContext();
  
  async function loginWithCredentials(email: string, password: string) {
    // เรียก login service
    const response = await authService.login(email, password);
    
    // เซ็ต token ก่อน
    localStorage.setItem('volunteerhub_token', response.accessToken);
    
    // เรียก auth.login เพื่ออัพเดท context
    await auth.login(response.accessToken);
    
    return response;
  }

  async function signUp(payload: authService.RegisterPayload) {
    return auth.signUp(payload)
  }

  return {
    ...auth,
    loginWithCredentials,
    signUp,
  };
}