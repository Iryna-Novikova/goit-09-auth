'use client';

interface AuthNavigationProps {
  children: React.ReactNode;
}

const AuthNavigationLayout = ({ children }: AuthNavigationProps) => {
  return <section>{children}</section>;
};

export default AuthNavigationLayout;
