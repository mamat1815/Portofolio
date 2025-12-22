'use client';

import { HospitalProvider } from './components/DataProvider';

export default function DokterBubungLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <HospitalProvider>{children}</HospitalProvider>;
}
