import type { Metadata } from 'next';
import { Inter, Nunito } from 'next/font/google';
import ViewerLayout from '@/components/layout/layout';
import './globals.css';
import { Toaster } from '@/components/core/toaster';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

const nunito = Nunito({
	variable: '--font-nunito',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'PDF Editor Lite',
	description:
		'Slick, fast, and drama-free PDF editing—because life’s too short for clunky tools.',
	icons: {
		icon: 'https://pdf-editor-lite.vercel.app/logo.png',
	},
	openGraph: {
		title: 'PDF Editor Lite',
		description:
			'Slick, fast, and drama-free PDF editing—because life’s too short for clunky tools.',
		url: 'https://pdf-editor-lite.vercel.app',
		siteName: 'PDF Editor Lite',
		images: [
			{
				url: 'https://pdf-editor-lite.vercel.app/logo.png',
				width: 1200,
				height: 630,
				alt: 'PDF Editor Lite Logo',
			},
		],
		type: 'website',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
				/>
			</head>
			<body
				className={`${inter.variable} ${nunito.variable} antialiased`}
			>
				<Toaster position='bottom-right' />
				<ViewerLayout>{children} </ViewerLayout>
			</body>
		</html>
	);
}
