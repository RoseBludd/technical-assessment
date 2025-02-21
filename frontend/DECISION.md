# Project Decisions

### Styling

I went with **Tailwind CSS** because it's simple, flexible, and gets the job done without unnecessary clutter.

### UI Components

I decided to use **shadcn/ui**. It's well-designed, works seamlessly with Tailwind, and saves me from reinventing the wheel.+

### API Integration

I kept it basic with **route-based API endpoints**. No fancy setups, just straightforward calls to get the data I need. I also did this so that i can cache the data.

### Error Handling

I didn’t overcomplicate it. A **global in-page error boundary** does the trick, catching issues without breaking the entire app.

### For Optimization

I made the data tables cachable, and will revalidate for 60 secs. For the metrics , I made it not cachable because the data change with respect to time.
