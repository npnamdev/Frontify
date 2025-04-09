"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/api";
import { toast } from 'sonner';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
    const [email, setEmail] = useState('root@doman.com');
    const [password, setPassword] = useState('root123456');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('signIn');
    const currentLocale = useLocale();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res: any = await loginUser(email, password);
            if (res && res.status === "success") {
                router.replace('/manage', { locale: currentLocale });
                localStorage.setItem('accessToken', res.accessToken);
                toast.success(t('loginSuccess'));
            } else {
                toast.error(t('loginFailed'));
            }
        } catch (error) {
            toast.error(t('systemError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra nút "disabled"
    const isButtonDisabled = !email || !password || isLoading;

    return (
        <div className="flex bg-gray-100 h-dvh lg:h-screen w-full items-center justify-center px-4 bg-[url('https://hachium.com/wp-content/uploads/2024/02/grid-1024x671.png')] bg-cover">
            <Card className="w-full mx-auto lg:max-w-sm z-5">
                <CardHeader>
                    <CardTitle className="text-2xl">{t('loginTitle')}</CardTitle>
                    <CardDescription>
                        {t('loginDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
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
                            <div className="flex items-center">
                                <Label htmlFor="password">{t('passwordLabel')}</Label>
                                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                                    {t('forgotPassword')}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            className="w-full"
                            onClick={handleLogin}
                            disabled={isButtonDisabled}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    {t('signInButton')}
                                </>
                            ) : (
                                t('signInButton')
                            )}
                        </Button>
                        <Button variant="outline" className="w-full">
                            {t('signInWithGoogle')}
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        {t('noAccount')}{" "}
                        <Link href="/sign-up" className="underline">
                            {t('signUp')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
