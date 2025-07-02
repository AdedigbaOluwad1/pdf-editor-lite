/* eslint-disable @next/next/no-img-element */
'use client';
import { CloudUpload, RefreshCcw } from 'lucide-react';
import React, { DragEvent, useEffect, useRef, useState } from 'react';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';
import { ClipLoader } from 'react-spinners';
import { useViewerContext } from '../layout/context';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const useAnimatedDots = (maxDots = 3, interval = 500) => {
	const [dotCount, setDotCount] = useState(1);

	useEffect(() => {
		const timer = setInterval(() => {
			setDotCount((prev) => (prev < maxDots ? prev + 1 : 1));
		}, interval);

		return () => clearInterval(timer);
	}, [maxDots, interval]);

	return '.'.repeat(dotCount);
};

const PreUploadDisplay = () => {
	const { onDocumentUpload } = useViewerContext();

	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (file: File): boolean => {
		const allowedTypes = ['application/pdf'];
		const maxSize = 10 * 1024 * 1024;

		if (!allowedTypes.includes(file.type)) {
			toast.error('Invalid file type!');
			return false;
		}

		if (file.size > maxSize) {
			toast.error('File size exceeds 10MB limit.');
			return false;
		}

		return true;
	};

	const handleFileChange = (file: File) => {
		if (validateFile(file)) {
			onDocumentUpload(file);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleFileChange(file);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);

		const file = event.dataTransfer.files?.[0];
		if (file) {
			handleFileChange(file);
		}
	};

	return (
		<motion.div
			key='preUploadDisplay'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className={`w-full overflow-hidden border border-dashed ${
				isDragging ? 'border-primary' : 'border-[#D0D5DD]'
			}  border-[1.5px] rounded-lg px-6 py-8 max-w-[500px] gap-10 flex flex-col`}
			style={{
				backgroundColor: isDragging ? '#F9FAFB' : 'transparent',
				transition: 'background-color 0.3s ease',
			}}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<input
				type='file'
				ref={fileInputRef}
				onChange={handleInputChange}
				style={{ display: 'none' }}
				accept='.pdf'
				className='hidden'
			/>

			<div
				className={`flex flex-col items-center justify-center gap-4 ${
					isDragging && 'pointer-events-none'
				}`}
			>
				<div className='w-14 h-14 rounded-full bg-[#F0F2F5] flex items-center justify-center text-[#475367]'>
					<CloudUpload size={'1.65rem'} />
				</div>

				<div className='flex flex-col items-center justify-center'>
					<div className='flex items-center gap-1'>
						<button className='cursor-pointer font-semibold'>
							Click to upload
						</button>
						<p className='text-[#475367]'>or drag and drop</p>
					</div>
					<p className='text-sm text-[#98A2B3]'>
						PDF only (max file size. 10MB)
					</p>
				</div>

				<div className='flex items-center w-full gap-2'>
					<Separator
						orientation='horizontal'
						style={{ width: 'unset', flex: 1 }}
					/>
					<p className='font-semibold text-[#98A2B3]'>OR</p>
					<Separator
						orientation='horizontal'
						style={{ width: 'unset', flex: 1 }}
					/>
				</div>

				<Button
					onClick={handleButtonClick}
					className='w-32 text-sm cursor-pointer h-[2.25rem]'
					size={'lg'}
				>
					Browse Files
				</Button>
			</div>
		</motion.div>
	);
};

const OnUploadDisplay = () => {
	const { onDocumentUploadCancel, document, updateDocumentUploadStatus } =
		useViewerContext();
	const dots = useAnimatedDots();

	const [progress, setProgress] = useState(1);

	useEffect(() => {
		const totalDuration = 4000;
		const steps = 100;
		const interval = totalDuration / steps;

		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					setTimeout(
						() =>
							updateDocumentUploadStatus(
								DOCUMENT_UPLOAD_STATUS.SUCCESS
							),
						500
					);
					return 100;
				}
				return prev + 1;
			});
		}, interval);

		return () => clearInterval(timer);
	}, [updateDocumentUploadStatus]);
	return (
		<motion.div
			key='onUploadDisplay'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className='w-full overflow-hidden border border-dashed border-primary border-[1.5px] rounded-lg px-6 py-8 max-w-[500px] gap-10 flex flex-col'
		>
			<div className='flex flex-col items-center justify-center gap-5 py-4'>
				<img
					src='/pdf.svg'
					alt=''
					className='w-[2.75rem] object-contain'
				/>

				<div className='w-full flex flex-col gap-4'>
					<div className='flex flex-col items-center gap-1 w-full'>
						<p className='text-lg text-[#98A2B3] font-semibold'>
							{progress}%
						</p>
						<Progress
							value={progress}
							className='w-4/5 h-1.5'
						/>
					</div>

					<div className='flex flex-col items-center w-full'>
						<p className='text-base font-semibold'>
							Uploading Document{dots}
						</p>
						<p className='text-sm text-[#98A2B3] '>
							{document?.name}
						</p>
					</div>
				</div>

				<button
					onClick={onDocumentUploadCancel}
					className='text-[#98A2B3] flex items-center justify-center gap-0.5 cursor-pointer border-b border-b-[#fff] hover:border-b-[#98A2B3]'
				>
					<p className='text-base text-[#98A2B3] font-semibold'>
						Cancel Upload
					</p>
				</button>
			</div>
		</motion.div>
	);
};

const OnSuccessDisplay = () => {
	const { updateDocumentUploadStatus } = useViewerContext();

	useEffect(() => {
		setTimeout(
			() =>
				updateDocumentUploadStatus(
					DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
				),
			1500
		);
	}, [updateDocumentUploadStatus]);
	return (
		<motion.div
			key='onSuccessDisplay'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className='w-full overflow-hidden border border-dashed border-[#5FC381] border-[1.5px] rounded-lg px-6 py-8 max-w-[500px] gap-10 flex flex-col'
		>
			<div className='flex flex-col items-center justify-center gap-5 py-4'>
				<img
					src='/upload-success.svg'
					alt=''
					className='w-[3.5rem] object-contain'
				/>

				<div className='w-full flex flex-col gap-4'>
					<div className='flex flex-col items-center w-full'>
						<p className='text-base font-semibold'>
							Document Uploaded Successfully!
						</p>
						<p className='text-sm text-[#98A2B3] '>
							Name of document
						</p>
					</div>
				</div>

				<div className='text-[#98A2B3] flex items-center justify-center gap-2'>
					<ClipLoader
						size={'0.865rem'}
						color='currentColor'
					/>
					<p className='text-base text-[#98A2B3] font-semibold'>
						Opening document..
					</p>
				</div>
			</div>
		</motion.div>
	);
};

const OnErrorDisplay = () => {
	return (
		<motion.div
			key='onErrorDisplay'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className='w-full overflow-hidden border border-dashed border-[#E26E6A] border-[1.5px] rounded-lg px-6 py-8 max-w-[500px] gap-10 flex flex-col'
		>
			<div className='flex flex-col items-center justify-center gap-5 py-4'>
				<img
					src='/upload-error.svg'
					alt=''
					className='w-[3.5rem] object-contain'
				/>

				<div className='w-full flex flex-col gap-4'>
					<div className='flex flex-col items-center w-full'>
						<p className='text-base font-semibold'>
							Failed to Upload
						</p>
						<p className='text-sm text-[#98A2B3] '>Error message</p>
					</div>
				</div>

				<button className='text-[#F56630] flex items-center justify-center gap-2 cursor-pointer'>
					<RefreshCcw
						size={'1.25rem'}
						color='currentColor'
					/>
					<p className='text-base font-semibold'>Try Again</p>
				</button>
			</div>
		</motion.div>
	);
};

const documentUploadDisplays: Partial<
	Record<DOCUMENT_UPLOAD_STATUS, React.ReactNode>
> = {
	[DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD]: <PreUploadDisplay />,
	[DOCUMENT_UPLOAD_STATUS.UPLOADING]: <OnUploadDisplay />,
	[DOCUMENT_UPLOAD_STATUS.SUCCESS]: <OnSuccessDisplay />,
	[DOCUMENT_UPLOAD_STATUS.ERROR]: <OnErrorDisplay />,
};

export default function DocumentUploader() {
	const { documentUploadStatus } = useViewerContext();
	return documentUploadDisplays[documentUploadStatus];
}
