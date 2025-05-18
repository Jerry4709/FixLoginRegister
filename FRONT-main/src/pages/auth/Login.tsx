import { useState , useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link , useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';


export default function Login() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth(); // ใช้ loginWithCredentials แทน
  const {user, isAuthReady} = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await loginWithCredentials(email, password);
      setShowSuccess(true);
      // เก็บ role ไว้ใน localStorage เพื่อใช้ใน handleSuccessConfirm
      localStorage.setItem('temp_role', user.role);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
      } else {
        setError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    const role = localStorage.getItem('temp_role');
    
    if (role) {
      localStorage.removeItem('temp_role'); // ลบ temp_role ทิ้ง
      const path = `/${role.toLowerCase()}`;
      window.location.href = path;
      // ใช้ navigate และ reload แทน
      navigate(path, { replace: true });
      window.location.reload();
    }
  };

  useEffect(() => {
    
    if (isAuthReady && user && (location.pathname === '/login' )) {
      navigate(`/${user.role.toLowerCase()}`, { replace: true });
    }
  }, [user, isAuthReady, location.pathname, navigate]);

  useEffect(() => {
    if (isAuthReady && user) {
      switch (user.role) {
        case 'STUDENT':
          navigate('/student', { replace: true });
          break;
        case 'STAFF':
          navigate('/staff', { replace: true });
          break;
        case 'ADMIN':
          navigate('/admin', { replace: true });
          break;
        default:
          navigate('/unauthorized', { replace: true });
      }
    }
  }, [user, isAuthReady, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-blue-100 dark:from-neutral-900 dark:to-neutral-800 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md bg-white dark:bg-neutral-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-10"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <motion.img
              src="/logo.svg"
              alt="VolunteerHub"
              className="h-10 w-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.span
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              VolunteerHub
            </motion.span>
          </Link>

          <motion.h1
            className="text-4xl font-extrabold mb-6 text-neutral-900 dark:text-white tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Log In
          </motion.h1>

          {/* Error Message */}
          {error && (
            <motion.p
              className="text-red-500 text-sm text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants}>
                <label className="font-semibold text-neutral-700 dark:text-neutral-200">Email</label>
                <motion.input
                  type="email"
                  className="mt-2 w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="font-semibold text-neutral-700 dark:text-neutral-200">Password</label>
                <div className="relative mt-2">
                  <motion.input
                    type={showPwd ? 'text' : 'password'}
                    className="w-full rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 pr-12"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button
                    type="button"
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-violet-500 transition-colors duration-200"
                    onClick={() => setShowPwd((prev) => !prev)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {showPwd ? (
                        <motion.div
                          key="eye-off"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <EyeOff size={20} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Eye size={20} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white font-semibold tracking-wide shadow-lg transform transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? 'Logging In...' : 'Log In'}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400"
            variants={itemVariants}
          >
            Don't have an account?{' '}
            <Link
              to={ROUTES.REGISTER}
              className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </section>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-sm mx-4"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100">
                เข้าสู่ระบบสำเร็จ!
              </h3>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                ยินดีต้อนรับเข้าสู่ระบบ
              </p>
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSuccessConfirm}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 text-white font-semibold"
                >
                  ตกลง
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}