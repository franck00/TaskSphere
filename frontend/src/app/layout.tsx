import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as an example, can be changed based on font choice
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskSphere",
  description: "A task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-primary text-white p-4">
          <nav className="container mx-auto">
            <h1 className="text-xl font-bold">TaskSphere</h1>
          </nav>
        </header>
        <main className="flex-grow container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-secondary text-white p-4 text-center">
          <p>&copy; 2025 TaskSphere</p>
        </footer>
      </body>
    </html>
  );
}
