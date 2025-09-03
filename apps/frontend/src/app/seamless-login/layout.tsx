import { ReactNode } from 'react';
import { Metadata } from 'next';
import '../global.scss';

export const metadata: Metadata = {
  title: 'Seamless Login - Postiz',
  description: 'Secure authentication from your external product to Postiz',
  robots: 'noindex, nofollow',
};

/**
 * Layout for the seamless login page
 * 
 * This layout provides a minimal structure for SSO authentication pages.
 * It's a root layout that includes necessary HTML tags.
 */
export default function SeamlessLoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="dark text-primary !bg-primary">
        <main className="min-h-screen bg-primary">
          {children}
        </main>
      </body>
    </html>
  );
}