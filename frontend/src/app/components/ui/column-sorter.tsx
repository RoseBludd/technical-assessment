import { Column } from '@tanstack/react-table';
import { Button } from './button';
import { ArrowUpDown } from 'lucide-react';
import { Student } from '@/src/app/types/student';

type Props = {
  column: Column<Student, unknown>;
  label: string;
};

export function ColumnSorter({ column, label }: Props) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
