"use client";

import * as React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbPage, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { AlignLeft, Bell } from "lucide-react";
import LocalSwitcher from "./LocalSwitcher";
import { useLocale, useTranslations } from 'next-intl';

export default function HeaderLayout() {
    const { toggleSidebar } = useSidebar();
    const t = useTranslations('menu');
    const pathname = usePathname();
    let pathSegments = pathname.split('/').filter(segment => segment !== '');
    const supportedLanguages = ["vi", "en"];
    if (supportedLanguages.includes(pathSegments[0])) { pathSegments = pathSegments.slice(1); }
    const currentLocale = useLocale();


    const segmentLabels: Record<string, string> = {
        "manage": t("manage"),
        "courses": t("courseList"),
        "categories": t("courseCategories"),
        "tags": t("courseTags"),
        "activate-course": t("activationCodes"),
        "user-accounts": t("userAccounts"),
        "account-groups": t("accountGroups"),
        "roles-permissions": t("rolesPermissions"),
        "promo-codes": t("promoCodes"),
        "email-marketing": t("emailCampaigns"),
        "popups": t("popUpWindows"),
        "liblarys": t("libraryManagement"),
    };


    const formatSegment = (segment: string) => {
        return segmentLabels[segment] || segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <header className="flex justify-between h-[60px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b w-full px-5 sticky top-0 bg-white z-50">
            <div className="flex items-center gap-2">
                <Button className="lg:hidden mr-1 w-8 h-8" variant="outline" size="icon" onClick={() => toggleSidebar()}>
                    <AlignLeft strokeWidth={1.5} />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-4 block md:hidden" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${currentLocale}/manage`}>{formatSegment(pathSegments[0])}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {pathSegments.slice(1).map((segment, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {formatSegment(segment)}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center gap-2.5">
                <LocalSwitcher />
                <Button className="w-9 h-9" variant="outline" size="icon">
                    <Bell strokeWidth={1.5} />
                </Button>
            </div>
        </header>
    );
}
