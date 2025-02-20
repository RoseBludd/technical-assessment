import { DataTable } from '@/src/app/components/ui/data-table';
import { columns } from './columns';
import { Suspense } from 'react';
import TableSkeleton from '@/src/app/components/TableSkeleton/TableSkeleton';
import { Student } from './types/student';

export default async function Home() {
  const { data } = await fetch('http://localhost:3000/api/students').then(
    (res) => res.json(),
  );
  return (
    <>
      <h1 className="mb-10 text-2xl font-bold">Student List</h1>
      <Suspense fallback={<TableSkeleton />}>
        <DataTable columns={columns} data={data as Student[]} />
      </Suspense>
    </>
  );
}
