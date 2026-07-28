'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OldClubNewsListRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/clubs/news/list');
  }, [router]);

  return null;
}
