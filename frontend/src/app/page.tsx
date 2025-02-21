import { Button } from '@/components/ui/button';
import Dashboard from '@/components/dashboard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome to Next.js 15</h1>
        <p className="text-muted-foreground mb-4">
          Get started by editing app/page.tsx
        </p>
        <Button>shadcn btn</Button>
      </div>
      <Dashboard />
    </main>
  );
}
