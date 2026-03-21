"use client";

import { useEffect, useState } from 'react';
import { useRouter } from '@/compat/next-navigation';
import { NoticeBanner } from '@/components/ui/notice-banner';
import { SurfaceCard } from '@/components/ui/surface-card';
import { authApi } from '@/lib/api/endpoints/auth-api';
import { completeAuthFlow, getPendingInvite, setPendingInvite } from '@/lib/auth/auth-client';

export function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      try {
        const token = await completeAuthFlow();
        const pendingInvite = getPendingInvite();

        if (pendingInvite) {
          await authApi.register(
            {
              inviteCode: pendingInvite.inviteCode,
              studioName: pendingInvite.studioName,
            },
            token,
          );
          setPendingInvite(null);
        }

        if (!active) return;
        router.push('/app');
        router.refresh();
      } catch (callbackError: unknown) {
        if (!active) return;
        setError(
          callbackError instanceof Error
            ? callbackError.message
            : 'Could not complete Auth0 sign-in.',
        );
      }
    });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <SurfaceCard className="auth-card">
      <div className="auth-copy">
        <span className="eyebrow">Auth0 callback</span>
        <h1>Finishing sign-in…</h1>
        <p>We are verifying your Auth0 session and syncing your operator access.</p>
      </div>

      {error ? (
        <NoticeBanner title="Could not finish sign-in">
          <p>{error}</p>
        </NoticeBanner>
      ) : null}
    </SurfaceCard>
  );
}
