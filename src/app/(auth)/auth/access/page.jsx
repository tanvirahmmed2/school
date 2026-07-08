import { redirect } from 'next/navigation';

export default function AccessPage() {
  redirect('/auth/access/login');
}
