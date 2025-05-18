import { useAuth as useAuthContext } from '@/context/AuthProvider';
import * as authService from '@/services/auth.service';

// เพิ่มฟังก์ชันใหม่เพื่อทำให้การ login ง่ายขึ้นสำหรับ component
export function useAuth() {
  const auth = useAuthContext();
  
  // เพิ่มฟังก์ชัน loginWithCredentials ที่จะจัดการกับ authService
  async function loginWithCredentials(email: string, password: string) {
    const { accessToken, user } = await authService.login(email, password);
    auth.login(accessToken);
    localStorage.setItem('accessToken', accessToken);
    return { accessToken, user };
  }
  async function signUp(payload: authService.RegisterPayload) {
    return auth.signUp(payload)
  }


  
  return {
    ...auth,
    loginWithCredentials,
    signUp, // เพิ่มเข้าไปในผลลัพธ์
  };
}