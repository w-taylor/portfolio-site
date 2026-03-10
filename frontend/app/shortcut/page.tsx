import type { Metadata } from 'next';
import ShortcutClient from '@/components/shortcut/ShortcutClient';

export const metadata: Metadata = {
  title: 'ShortCut | wtaylor.xyz',
};

export default function ShortcutPage() {
  return <ShortcutClient />;
}
