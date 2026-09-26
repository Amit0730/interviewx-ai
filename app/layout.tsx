import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://interviewx-ai.vercel.app'),
  title: 'InterviewX — AI Technical Interview Simulator',
  description: 'Practice technical interviews with AI-powered questions, evaluation, and personalized feedback.',
  keywords: [
    'technical interview',
    'interview preparation',
    'mock interview',
    'DSA practice',
    'software engineering interview',
    'system design',
    'AI interview simulator',
    'coding feedback'
  ],
  authors: [{ name: 'Amit Kumar' }],
  creator: 'Amit Kumar',
  openGraph: {
    title: 'InterviewX — AI Technical Interview Simulator',
    description: 'Practice technical interviews with AI-powered questions, evaluation, and personalized feedback.',
    url: 'https://interviewx-ai.vercel.app',
    siteName: 'InterviewX',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InterviewX — AI Technical Interview Simulator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InterviewX — AI Technical Interview Simulator',
    description: 'Practice technical interviews with AI-powered questions, evaluation, and personalized feedback.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
