'use client';

import { useAnimatedCounter } from '@/hooks/use-counter';

interface Props {
  value: number;
}

export const Counter = ({ value }: Props) => {
  const count = useAnimatedCounter(value);

  return <div className="text-4xl font-bold tracking-tight">{count}</div>;
};
