/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return function (...args: Parameters<T>) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
