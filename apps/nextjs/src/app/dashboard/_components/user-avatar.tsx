import * as React from 'react';

import { Button } from '@acme/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@acme/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/avatar';

import Link from 'next/link';

import { CreditCardIcon, LogOutIcon, UserIcon } from 'lucide-react';
import { signOut } from '~/app/auth/actions';

import type { UserResponse } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: UserResponse;
}

export default function UserAvatar({ user }: UserAvatarProps) {
  if (user.error ?? !user.data.user) return null;
  const session = user.data;

  async function handleSignOut() {
    await signOut();
  }

  function getInitials(name: string) {
    const names = name.split(' ');
    const initials = names.map(x => x.charAt(0).toUpperCase());
    if (initials.length > 1) {
      return `${initials[0]}${initials[initials.length - 1]}`;
    }
    return initials[0];
  }

  const userFullName = (session.user.user_metadata.full_name as string | undefined) ?? 'User';
  const userAvatarUrl = (session.user.user_metadata.avatar_url as string | undefined) ?? '';
  const userEmail = session.user.email ?? 'user@example.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatarUrl} alt="User Avatar" />
            <AvatarFallback>{getInitials(userFullName)}</AvatarFallback>
          </Avatar>
          <span className="sr-only">Profile options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount className="w-56 min-w-32">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userFullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={'/dashboard/settings/profile'}>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            {/* TODO: Build this XD */}
            <Link href={'/dashboard/settings/billing'}>
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}