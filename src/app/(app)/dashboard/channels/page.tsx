import { ChannelsManager } from '@/components/dashboard/channels-manager';

export const metadata = {
    title: 'Distribution Channels — SAT Connect',
    description: 'Manage OTA distribution channels and commission rates',
};

export default function ChannelsPage() {
    return (
        <main className="p-6 max-w-7xl mx-auto">
            <ChannelsManager />
        </main>
    );
}
