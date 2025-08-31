'use client';
import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { useUserAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/api/clientApi';

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user } = useUserAuthStore();
  const clearIsAuth = useUserAuthStore(state => state.clearIsAuthenticated);

  const handleLogout = async () => {
    await logoutUser();
    clearIsAuth();
    router.push('/sign-in');
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button onClick={handleLogout} className={css.logoutButton}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
