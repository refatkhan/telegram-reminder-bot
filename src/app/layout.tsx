import "./globals.css";

export const metadata = {
  title: "Study Reminder Bot",
  description: "Telegram Study Reminder System",
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