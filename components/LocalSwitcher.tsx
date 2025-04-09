'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const options = [
    {
        value: "en",
        label: "English",
        icon: (<svg className='rounded' xmlns="http://www.w3.org/2000/svg" width="42.67" height="32" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z" /><path fill="#FFF" d="m75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301L81 480H0v-60l239-178L0 64V0z" /><path fill="#C8102E" d="m424 281l216 159v40L369 281zm-184 20l6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" /><path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" /><path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" /></svg>),
    },
    {
        value: "vi",
        label: "Vietnamese",
        icon: (<svg className='rounded' xmlns="http://www.w3.org/2000/svg" width="42.67" height="32" viewBox="0 0 640 480"><defs><clipPath id="flagVn4x30"><path fillOpacity=".7" d="M-85.3 0h682.6v512H-85.3z" /></clipPath></defs><g fillRule="evenodd" clipPath="url(#flagVn4x30)" transform="translate(80)scale(.9375)"><path fill="#da251d" d="M-128 0h768v512h-768z" /><path fill="#ff0" d="M349.6 381L260 314.3l-89 67.3L204 272l-89-67.7l110.1-1l34.2-109.4L294 203l110.1.1l-88.5 68.4l33.9 109.6z" /></g></svg>),
    },
];

export default function LocalSwitcher() {
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();
    const [open, setOpen] = useState(false);

    const handleLocaleChange = (locale: string) => {
        if (locale !== currentLocale) { startTransition(() => { router.replace(pathname, { locale }); }); }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" aria-expanded={open} className="icon px-3 gap-1.5 flex justify-start">
                    {options.find((option) => option.value === currentLocale)?.icon}
                    <span className="text-sm font-medium">{options.find((option) => option.value === currentLocale)?.label}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" className="w-full p-0 rounded-md">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    className="flex w-full items-center gap-1.5 whitespace-nowrap cursor-pointer"
                                    onSelect={() => {
                                        handleLocaleChange(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    {option.icon}
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
