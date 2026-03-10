import type { Metadata } from 'next';
import ConwayGrid from '@/components/conway/ConwayGrid';

export const metadata: Metadata = {
  title: "Conway's Game of Life | wtaylor.xyz",
};

export default function ConwayPage() {
  return (
    <div className="conway-main-content">
      <ConwayGrid />
    </div>
  );
}
