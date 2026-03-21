"use client";

import Link from '@/compat/next-link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NoticeBanner } from '@/components/ui/notice-banner';
import { SurfaceCard } from '@/components/ui/surface-card';
import { setPendingInvite, startAuthFlow } from '@/lib/auth/auth-client';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [studioName, setStudioName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        if (!inviteCode.trim()) {
          throw new Error('Invite code is required to provision operator access.');
        }

        setPendingInvite({ inviteCode: inviteCode.trim(), studioName: studioName.trim() || undefined });
        await startAuthFlow('signup');
      } else {
        setPendingInvite(null);
        await startAuthFlow('login');
      }
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not start Auth0 authentication',
      );
      setLoading(false);
    }
  };

  return (
    <SurfaceCard className="auth-card">
      <div className="auth-copy">
        <span className="eyebrow">{isRegister ? 'Create operator access' : 'Operator login'}</span>
        <h1>{isRegister ? 'Register a studio operator' : 'Sign in to manage bookings'}</h1>
        <p>
          Authentication now uses Auth0 Universal Login. The backend verifies bearer
          tokens and the invite code gates operator provisioning.
        </p>
      </div>

      <div className="form-stack">
        {isRegister ? (
          <>
            <label className="field">
              <span>Invite code</span>
              <input
                className="input"
                value={inviteCode}
                onChange={(event) => setInviteCode(event.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Studio name (optional)</span>
              <input
                className="input"
                value={studioName}
                onChange={(event) => setStudioName(event.target.value)}
                placeholder="WAV CAVE Atlanta"
              />
            </label>
          </>
        ) : null}

        {error ? (
          <NoticeBanner title="Authentication error">
            <p>{error}</p>
          </NoticeBanner>
        ) : null}

        <Button type="button" disabled={loading} onClick={handleContinue}>
          {loading
            ? 'Redirecting...'
            : isRegister
              ? 'Continue with Auth0 signup'
              : 'Continue with Auth0 login'}
        </Button>

        <p className="muted-copy">
          {isRegister ? 'Already have access?' : 'Need an invite?'}{' '}
          <Link href={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Log in' : 'Register here'}
          </Link>
        </p>
      </div>
    </SurfaceCard>
  );
}
