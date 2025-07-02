'use client';
import { LayoutProps } from '@/lib/types/layout';
import React from 'react';
import Header from './header';
import LeftSidebar from './left-sidebar';
import RightSidebar from './right-sidebar';
import ToolBar from './toolbar';
import ViewerContextProvider from './context';
import FloatingToolbar from './floating-toolbar';
import ChildWrapper from './child-wrapper';

export default function ViewerLayout({ children }: LayoutProps) {
	return (
		<ViewerContextProvider>
			<div className='w-screen overflow-x-hidden min-h-sceen flex flex-col bg-[#f1f5f8]'>
				<Header />
				<div className='hidden md:block w-screen min-h-[calc(100vh-56px)]'>
					<div className='grid grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr_50px] w-screen min-h-[calc(100vh-56px)]'>
						<LeftSidebar />
						<div className='flex relative h-full max-w-[calc(100vw-80px)] lg:max-w-[calc(100vw-130px)] flex-col rounded-tl-[16px] lg:rounded-t-[16px] border-[#e8eef3] border bg-[#e8eef3]'>
							<ToolBar />
							<div className='flex border border-[#e8eef3] rounded-tl-[8px] lg:rounded-t-[8px] overflow-hidden h-[calc(100vh-106px)] bg-[#fff]'>
								<ChildWrapper>{children}</ChildWrapper>
							</div>
							<FloatingToolbar />
						</div>
						<RightSidebar />
					</div>
				</div>

				<div className='w-screen bg-[#fff] md:hidden min-h-[calc(100dvh-64px)!important] min-h-[calc(100vh-64px)] flex items-center text-center justify-center px-4 text-[0.9rem]'>
					Actually.. just increase your viewport 😊
					<br />
					Or..
					<br /> Check back later. Support for smaller screens is in
					the works, We can&apos;t wait too.. 😁🔥
				</div>
			</div>
		</ViewerContextProvider>
	);
}
