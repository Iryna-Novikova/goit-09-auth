'use client';
import { useRouter } from 'next/router';
import css from './EditProfilePage.module.css';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUserAuthStore } from '@/lib/store/authStore';
import { getUserProfile, UpdateUserProfile } from '@/lib/api/clientApi';
import { UpdateUser, User } from '@/types/user';
import { ApiError } from '@/app/api/api';
import Loading from '@/app/loading';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useUserAuthStore();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (!user) {
      getUserProfile()
        .then((data: User) => {
          setUser(data);
          setUserName(data.username);
        })
        .catch(error => setError(error));
    } else {
      setUserName(user.username);
    }
  }, [user, setUser]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const userCng: UpdateUser = {
        name: formData.get('username') as string,
      };

      if (user && userCng.name !== user.username) {
        const updUser = await UpdateUserProfile(userCng);
        setUser(updUser);
        router.push('/profile');
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Something went wrong. Try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      {isLoading && <Loading />}

      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user ? user.avatar : ''}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form action={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username: {userName}</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={userName}
              onChange={ev => setUserName(ev.target.value)}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {error && <p className={css.error}>{error}</p>}
    </main>
  );
}
