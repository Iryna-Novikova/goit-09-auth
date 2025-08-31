'use client';
import { useRouter } from 'next/navigation';
import css from './EditProfilePage.module.css';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useUserAuthStore } from '@/lib/store/authStore';
import { getUserProfile, UpdateUserProfile } from '@/lib/api/clientApi';
import { UpdateUser, User } from '@/types/user';
// import { ApiError } from '@/app/api/api';
import Loading from '@/app/loading';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, setUser } = useUserAuthStore();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  console.log(userName);
  console.log(user);

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
      // const userCng: UpdateUser = {
      //   name: formData.get('username') as string,
      //   email: formData.get('email') as string,
      // };

      const newName = formData.get('username') as string;

      if (newName.trim() === '') {
        setError('Input not NULL name please.');
        return;
      }

      console.log(`user: ${user}`);
      // console.log(`user: ${userCng}`);
      console.log(formData);

      if (user && newName !== user.username) {
        const userCng: UpdateUser = {
          email: user.email,
          username: newName,
        };
        const updUser = await UpdateUserProfile(userCng);
        setUser(updUser);
        router.push('/profile');
      }
    } catch (error) {
      setError(
        // (error as ApiError).response?.data?.error ??
        //   (error as ApiError).message ??
        `Something went wrong. Try again.
          ERR: ${error}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      {isLoading && <Loading />}
      {error && <p className={css.error}>{error}</p>}

      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user ? user.avatar : '/default-avatar.svg'}
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
    </main>
  );
}
