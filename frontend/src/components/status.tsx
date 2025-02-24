import { formatRelative } from 'date-fns';
import { cn } from '@/lib/utils';
import { StatusUpdate } from '@/app/api/status/route';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const host = process.env.NEXT_PUBLIC_API_HOST;

const fetchData = async (): Promise<StatusUpdate[]> => {
  const res = await fetch(`${host}/api/status`);
  const data = await res.json();
  return data;
};

export default async function () {
  const data: StatusUpdate[] = await fetchData();

  return (
    <>
      {data.map((item) => (
        <div className="col-span-3 lg:col-span-1" key={item.id}>
          <Alert
            {...(item.status === 'error' && { variant: 'destructive' })}
            className={cn('rounded-sm', {
              'border-green-600/50 text-green-600 dark:border-green-600 [&>svg]:text-green-600':
                item.status === 'healthy',
              'border-amber-600/50 text-amber-600 dark:border-amber-600 [&>svg]:text-amber-600':
                item.status === 'warning',
            })}
          >
            <AlertTitle className="capitalize font-bold">
              {item.status}
            </AlertTitle>
            <AlertDescription>{item.message}</AlertDescription>
            <p className="text-gray-400 capitalize">
              {formatRelative(item.timestamp, new Date())}
            </p>
          </Alert>
        </div>
      ))}
    </>
  );
}
