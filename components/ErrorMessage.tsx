import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  retryText?: string;
}

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500 mx-auto">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);


export default function ErrorMessage({ message, onRetry, retryText = "Upload a different image" }: ErrorMessageProps): React.ReactElement {
  return (
    <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-6 py-8 rounded-lg text-center" role="alert">
      <ErrorIcon />
      <h3 className="mt-4 text-xl font-bold">An Error Occurred</h3>
      <p className="mt-2 text-red-300/80">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
      >
        {retryText}
      </button>
    </div>
  );
}