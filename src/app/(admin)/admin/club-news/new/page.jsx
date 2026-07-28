'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldClubNewsNewRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/clubs/news/new');
  }, [router]);

  return null;
}
