'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionId } from '@/lib/session';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const trackPageView = async () => {
      // Skip tracking for admin pages
      if (pathname.startsWith('/admin')) {
        return;
      }

      try {
        const sessionId = getSessionId();
        await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            page: pathname,
            sessionId: sessionId 
          }),
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
