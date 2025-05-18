import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';
// import Spinner from '../ui/Spinner'; // อย่าลืม import Spinner

export interface ProtectedRouteProps {
  allow: Array<'STUDENT'|'STAFF'|'ADMIN'>;
  children?: ReactNode;
}

const ProtectedRoute = ({ allow, children }: ProtectedRouteProps) => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('volunteerhub_token');

  // แสดง loading state ระหว่างตรวจสอบ auth
  if (!isAuthReady) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  // ถ้ามี token และ user แล้วพยายามเข้าหน้า login
  if (token && user && location.pathname === '/login') {
    const redirectPath = `/${user.role.toLowerCase()}`;
    return <Navigate to={redirectPath} replace />;
  }

  // ถ้าไม่มี user หรือ token
  if (!user || !token) {
    // แต่ถ้าเป็นหน้า login ให้แสดงหน้า login ได้
    if (location.pathname === '/login') {
      return children ? <>{children}</> : <Outlet/>;
    }
    // ถ้าไม่ใช่หน้า login ให้ redirect ไปหน้า login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ตรวจสอบสิทธิ์การเข้าถึง
  if (!allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet/>;
};

export default ProtectedRoute;
