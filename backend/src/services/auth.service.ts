import { MembershipRole } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import { HttpError } from '../lib/http.js';

const mapMembershipRole = (value?: string): MembershipRole => {
  if (value === env.AUTH0_OWNER_ROLE) return MembershipRole.owner;
  if (value === env.AUTH0_MANAGER_ROLE) return MembershipRole.manager;
  return MembershipRole.staff;
};

export const authService = {
  async syncUser(params: { auth0UserId: string; email: string; inviteCode?: string; roleHint?: string }) {
    const existing = await prisma.userProfile.findUnique({ where: { auth0UserId: params.auth0UserId } });

    if (existing) {
      return existing;
    }

    const isPlatformAdmin = params.inviteCode === env.ADMIN_INVITE_CODE;

    return prisma.userProfile.create({
      data: {
        auth0UserId: params.auth0UserId,
        email: params.email,
        isPlatformAdmin,
      },
    });
  },

  async registerOperator(params: {
    auth0UserId: string;
    email: string;
    inviteCode: string;
    studioName?: string;
    roleHint?: string;
  }) {
    if (params.inviteCode !== env.ADMIN_INVITE_CODE) {
      throw new HttpError(403, 'Invite code is invalid');
    }

    const user = await prisma.userProfile.upsert({
      where: { auth0UserId: params.auth0UserId },
      update: { email: params.email, isPlatformAdmin: true },
      create: {
        auth0UserId: params.auth0UserId,
        email: params.email,
        isPlatformAdmin: true,
      },
    });

    if (params.studioName) {
      const slug = params.studioName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 50);

      const studio = await prisma.studio.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          name: params.studioName,
          publicDisplayName: params.studioName,
          timezone: 'America/New_York',
          email: params.email,
          phone: '',
          address: '',
          serviceArea: '',
          about: '',
          bookingPolicy: 'Bookings are confirmed after payment is processed.',
        },
      });

      await prisma.studioMembership.upsert({
        where: { studioId_userProfileId: { studioId: studio.id, userProfileId: user.id } },
        update: { role: mapMembershipRole(params.roleHint) },
        create: {
          studioId: studio.id,
          userProfileId: user.id,
          role: mapMembershipRole(params.roleHint),
        },
      });
    }

    return user;
  },

  async getMe(auth0UserId: string, email?: string) {
    const user = await prisma.userProfile.upsert({
      where: { auth0UserId },
      update: email ? { email } : {},
      create: {
        auth0UserId,
        email: email ?? `${auth0UserId}@unknown.local`,
      },
      include: {
        memberships: {
          include: { studio: true },
        },
      },
    });

    const accessibleStudios = user.memberships.map((membership) => ({
      id: membership.studio.id,
      name: membership.studio.name,
      slug: membership.studio.slug,
      timezone: membership.studio.timezone,
      membership_role: membership.role,
    }));

    return {
      id: user.id,
      user_id: user.auth0UserId,
      email: user.email,
      studio_id: accessibleStudios[0]?.id ?? null,
      legacy_studio_id: accessibleStudios[0]?.id ?? null,
      current_studio: accessibleStudios[0] ?? null,
      accessible_studios: accessibleStudios,
      created_at: user.createdAt.toISOString(),
    };
  },
};
