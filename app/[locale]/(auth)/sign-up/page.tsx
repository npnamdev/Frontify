"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { registerUser } from '@/services/api';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const router = useRouter();
  const t = useTranslations('signUp');
  const currentLocale = useLocale();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.error(t('fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }

    setIsLoading(true); // Khi bắt đầu xử lý đăng ký
    try {
      const res: any = await registerUser(username, email, password);
      if (res && res.status === "success") {
        toast.success(t('registrationSuccess'));
        router.replace('/sign-in', { locale: currentLocale });
      } else {
        toast.error(t('registrationFailed'));
      }
    } catch (error) {
      toast.error(t('systemError'));
    } finally {
      setIsLoading(false); // Khi hoàn thành hoặc gặp lỗi
    }
  };

  // Kiểm tra nếu có đủ dữ liệu và không trong trạng thái loading
  const isButtonDisabled = !username || !email || !password || !confirmPassword || isLoading;

  return (
    <div className="flex bg-gray-100 h-dvh lg:h-screen w-full items-center justify-center px-4 bg-[url('https://hachium.com/wp-content/uploads/2024/02/grid-1024x671.png')] bg-cover">
      <Card className="w-full mx-auto lg:max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('fullNameLabel')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('fullNamePlaceholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">{t('confirmPasswordLabel')}</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder={t('confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={handleRegister}
              disabled={isButtonDisabled}
            >
              {isLoading ? (
                <>
                <Loader2 className="animate-spin" />
                {t('signUpButton')}
                </>
              ) : (
                t('signUpButton')
              )}
            </Button>
            <Button variant="outline" className="w-full">
              {t('signUpWithGoogle')}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t('alreadyHaveAccount')}{" "}
            <Link href="/sign-in" className="underline">
              {t('signInLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
