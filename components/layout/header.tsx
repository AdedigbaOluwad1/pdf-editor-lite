/* eslint-disable @next/next/no-img-element */
import Avatar from '@/components/common/avatar';
import Tooltip from '@/components/common/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import React from 'react';

export default function Header() {
  return (
    <div className="h-[64px] md:h-[56px] px-2 py-1 flex items-center justify-between">
      <div className="flex gap-3 px-1.5 md:px-3 items-center">
        <img src="/logo.svg" alt="" className="w-8" />

        <p
          className="text-xl md:text-2xl font-semibold leading-normal"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          pdf editor lite
        </p>
      </div>

      <div className="px-3 flex items-center  gap-4">
        <Button className="w-32 hidden md:block text-base" size={'lg'}>
          Share
        </Button>

        <Separator
          orientation="vertical"
          className="w-10 h-10 min-h-[15px] bg-[#000] hidden md:block"
        />
        <Tooltip content="Notification">
          <button className="cursor-pointer">
            <Bell size={'1.5rem'} />
          </button>
        </Tooltip>
        <Avatar
          className="w-10 h-10"
          src="https://github.com/shadcn.png"
          alt="@shadcn"
          fallback="CN"
        />
      </div>
    </div>
  );
}
