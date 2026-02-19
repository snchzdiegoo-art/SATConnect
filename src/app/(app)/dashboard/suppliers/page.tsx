import { SuppliersManager } from '@/components/dashboard/suppliers-manager';

export const metadata = {
    title: 'Suppliers — SAT Connect',
    description: 'Manage tour suppliers and provider profiles',
};

export default function SuppliersPage() {
    return (
        <main className="p-6 max-w-7xl mx-auto">
            <SuppliersManager />
        </main>
    );
}
