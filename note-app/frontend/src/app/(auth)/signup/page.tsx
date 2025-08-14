import type { Metadata } from 'next';
import SignUpForm from './SignUpForm'; 

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up to access your notes.',
};

export default function SignUpPage() {
  return <SignUpForm />;
}