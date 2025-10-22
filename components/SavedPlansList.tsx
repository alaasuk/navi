import React from 'react';
import { SavedPlan } from '../types';

interface SavedPlansListProps {
  plans: SavedPlan[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export default function SavedPlansList({ plans, onView, onDelete, onAddNew }: SavedPlansListProps): React.ReactElement {
  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Saved Plans</h2>
                <p className="mt-2 text-lg text-slate-400">Select a plan to view its addresses or upload a new one.</p>
            </div>
            <button
                onClick={onAddNew}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
            >
                Upload New Plan
            </button>
        </div>

        {plans.length === 0 ? (
            <div className="text-center bg-slate-800/50 rounded-lg py-12">
                <h3 className="text-xl font-medium text-slate-300">No saved plans yet.</h3>
                <p className="text-slate-500 mt-2">Upload a document to get started.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <img src={plan.imagePreviewUrl} alt={plan.name} className="w-full h-40 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-white truncate flex-grow" title={plan.name}>{plan.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">{plan.addresses.length} addresses</p>
                            <p className="text-xs text-slate-500 mt-1">Saved on: {new Date(plan.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 border-t border-slate-700 grid grid-cols-2 gap-2">
                             <button
                                onClick={() => onView(plan.id)}
                                className="w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 transition-colors"
                            >
                                View
                            </button>
                            <button
                                onClick={() => onDelete(plan.id)}
                                title="Delete Plan"
                                className="w-full flex justify-center items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-red-900/50 hover:border-red-700 hover:text-red-300 transition-colors"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}
