import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/ui-custom/login-form"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <h1 className="text-[22px] font-black text-primary mb-6 text-center">Learnify</h1>
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:flex items-center justify-center">
                <img
                    src="https://noova.vn/images/account/login-banner.svg"
                    alt="Image"
                    className="absolute inset-0 h-full  object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
