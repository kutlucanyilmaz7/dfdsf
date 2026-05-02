import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
            <Globe className="w-5 h-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="bg-white border-zinc-200 text-zinc-900">
        <DropdownMenuItem onClick={() => i18n.changeLanguage('tr')} className="gap-2 cursor-pointer hover:bg-zinc-50">
          <span className="text-lg">🇹🇷</span> Türkçe
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage('en')} className="gap-2 cursor-pointer hover:bg-zinc-50">
          <span className="text-lg">🇺🇸</span> English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
