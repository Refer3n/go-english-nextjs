import { useTranslations } from 'next-intl'; // declare this import

export default function HomePage() {
    const t = useTranslations('Home'); // declare the hook passing into parameter a context name
    return (
        <div>
            <h1>{t('title')}</h1> // Call the hook by passing as parameter the dictionary key you want
        </div>
    );
}