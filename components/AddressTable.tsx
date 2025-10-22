import React from 'react';
import { Address } from '../types';

interface AddressTableProps {
  plan: {
    addresses: Address[];
    imagePreviewUrl: string;
    isSaved: boolean;
  };
  onReset: () => void;
  onSave: () => void;
}

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-3 text-slate-400 group-hover:text-sky-400 transition-colors">
    <path fillRule="evenodd" d="m9.69 18.933.003.001a9.85 9.85 0 0 1 .404-.185 10.035 10.035 0 0 0 7.402-9.582 7.5 7.5 0 0 0-15 0 10.035 10.035 0 0 0 7.402 9.582 9.85 9.85 0 0 1 .404.185l.003-.001a.75.75 0 0 0 .93-.002ZM10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
  </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.665l3-3Z" />
      <path d="M8.603 14.93a4 4 0 0 1-5.656-5.656l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a5.5 5.5 0 0 0 7.778 7.778l3-3a5.5 5.5 0 0 0-.225-7.865.75.75 0 0 0-.977 1.138 4 4 0 0 1 .142 5.165l-3 3Z" />
    </svg>
);

const createGoogleMapsUrl = (address: Address): string => {
  const query = `${address.street} ${address.houseNumbers}, ${address.plz} ${address.city}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export default function AddressTable({ plan, onReset, onSave }: AddressTableProps): React.ReactElement {
  const { addresses, imagePreviewUrl, isSaved } = plan;
  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg p-2 sm:p-4">
      <div className="flex flex-col md:flex-row gap-6 p-4">
        <div className="md:w-1/3 flex-shrink-0">
          <h3 className="text-xl font-bold text-white mb-3">Extracted Addresses</h3>
          <p className="text-sm text-slate-400 mb-4">
            {addresses.length} addresses found. Click any row to open in Google Maps.
          </p>
           <img src={imagePreviewUrl} alt="Uploaded document" className="rounded-lg object-cover w-full h-auto max-h-60 mb-4 shadow-md" />
           <div className="space-y-2">
            {!isSaved && (
                 <button
                 onClick={onSave}
                 className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
               >
                 Save Plan
               </button>
            )}
            <button
              onClick={onReset}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
            >
              {isSaved ? 'Back to Saved Plans' : 'Start Over'}
            </button>
           </div>
        </div>
        
        <div className="md:w-2/3 overflow-x-auto">
          <div className="w-full min-w-[500px] md:min-w-full">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 p-3 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <div>Street & House No.</div>
              <div>Postal Code</div>
              <div>City</div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {addresses.map((address, index) => (
                <a
                  key={index}
                  href={createGoogleMapsUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 items-center p-3 group hover:bg-sky-900/30 transition-colors rounded-md border-b border-slate-800"
                >
                  <div className="flex items-center">
                    <MapPinIcon />
                    <div>
                      <p className="font-medium text-slate-200 group-hover:text-white truncate">{address.street}</p>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300">{address.houseNumbers}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">{address.plz}</div>
                  <div className="text-sm text-slate-300 flex items-center justify-between">
                    <span>{address.city}</span>
                    <ExternalLinkIcon/>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
