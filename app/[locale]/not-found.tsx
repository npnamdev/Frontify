import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <section className="bg-white dark:bg-gray w-full h-dvh flex flex-col items-center justify-center">
            <div className="py-8 px-4 lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary dark:text-primary">
                        {t('404Title')}
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray md:text-4xl dark:text-white">
                        {t('missingMessage')}
                    </p>
                    <p className="mb-4 text-md font-light">
                        {t('sorryMessage')}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary my-4"
                    >
                        {t('backToHome')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
