import type { Metadata } from 'next';
import SignInForm from './SignInForm'; 

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to access your notes.',
};

export default function LoginPage() {
  return <SignInForm />;
}