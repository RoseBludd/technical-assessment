'use client';

import { Checkbox } from '@/src/app/components/ui/checkbox';
import { ColumnSorter } from '@/src/app/components/ui/column-sorter';
import { ColumnDef } from '@tanstack/react-table';
import { Student } from './types/student';

export const columns: ColumnDef<Student>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <ColumnSorter column={column} label="ID" />;
    },
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      return <ColumnSorter column={column} label="First Name" />;
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      return <ColumnSorter column={column} label="Last Name" />;
    },
  },
  {
    accessorKey: 'city',
    header: ({ column }) => {
      return <ColumnSorter column={column} label="City" />;
    },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => {
      return <ColumnSorter column={column} label="State" />;
    },
  },
  {
    accessorKey: 'number',
    header: 'Phone Number',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
];
