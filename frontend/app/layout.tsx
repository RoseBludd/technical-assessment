export const metadata = {
  title: "Frontend Specialist Assessment",
  description:
    "Create a modern, responsive dashboard using Next.js 14 that demonstrates your frontend expertise.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
