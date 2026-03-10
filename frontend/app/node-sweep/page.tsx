import type { Metadata } from 'next';
import NodeSweepClient from '@/components/node-sweep/NodeSweepClient';

export const metadata: Metadata = {
  title: 'Node Sweep | wtaylor.xyz',
};

export default function NodeSweepPage() {
  return (
    <div>
      <NodeSweepClient />
    </div>
  );
}
