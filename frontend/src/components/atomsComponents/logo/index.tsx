import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { Agbalumo } from 'next/font/google'
import React from 'react'
import Icon from '@/app/favicon.ico';
import BambooLoader from './BambooLoader';
const agbalumo = Agbalumo({ subsets: ['latin'], weight: '400' })
interface LogoProps {
    logo?: {
        url: string;
        src: string | StaticImageData;
        alt: string;
        title: string;
    };
}
export function Logo({ logo = {
    url: "/",
    src: Icon,
    alt: "Bamboo",
    title: "Bamboo",
}, }: LogoProps) {
    return (
        <Link href={logo.url} className="flex items-center md:gap-1 transition-all delay-75">
            <div className={`${agbalumo.className} select-none cursor-pointer gap-1 md:gap-2 text-primary h-9 inline-flex w-max items-center justify-center rounded-md p-2 text-sm font-medium  disabled:opacity-50 transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 pointer `}>
                <BambooLoader variant='sway' size={34} className='text-foreground dark:text-[#c8beae]' />
                {/* <Image src={logo.src} alt={logo.alt} className='w-8 max-h-8 dark:invert-[75%]' /> */}
                <h1 className="text-xl pb-1 font-normal text-[#374151] dark:invert tracking-tighter">{logo.title}</h1>
            </div>
        </Link>
    )
}
