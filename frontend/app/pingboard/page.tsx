import type { Metadata } from 'next';
import PingboardClient from '@/components/pingboard/PingboardClient';

export const metadata: Metadata = {
  title: 'Pingboard | wtaylor.xyz',
};

async function getServices(): Promise<{ loadedServices: Record<string, unknown>[]; loadError: string | null }> {
  try {
    const response = await fetch('http://backend:3000/api/pingboard/services', {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { loadedServices: data, loadError: null };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return { loadedServices: [], loadError: 'Failed to fetch data from server' };
  }
}

export default async function PingboardPage() {
  const { loadedServices, loadError } = await getServices();
  return <PingboardClient loadedServices={loadedServices} loadError={loadError} />;
}
