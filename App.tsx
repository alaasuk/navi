import React, { useState, useCallback, useEffect } from 'react';
import { Address, SavedPlan } from './types';
import { extractAddressesFromImage } from './services/geminiService';
import { fileToDataUrl, createThumbnailDataUrl } from './utils/fileUtils';
import * as storageService from './services/storageService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import AddressTable from './components/AddressTable';
import SavedPlansList from './components/SavedPlansList';
import SavePlanModal from './components/SavePlanModal';

type View = 'upload' | 'results' | 'savedPlans';

export default function App(): React.ReactElement {
  const [activePlan, setActivePlan] = useState<{ addresses: Address[]; imagePreviewUrl: string; isSaved: boolean; } | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [view, setView] = useState<View>('upload');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadedPlans = storageService.getSavedPlans();
    setSavedPlans(loadedPlans);
    if (loadedPlans.length > 0) {
      setView('savedPlans');
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setActivePlan(null);

    try {
      const dataUrl = await fileToDataUrl(file);
      const base64Image = dataUrl.split(',')[1];
      const mimeType = file.type;
      const extractedData = await extractAddressesFromImage(base64Image, mimeType);
      
      const processedAddresses = extractedData.flatMap(address => {
        const houseNumbersList = address.houseNumbers.split(',').map(num => num.trim()).filter(Boolean);
        if (houseNumbersList.length <= 1) return address;
        return houseNumbersList.map(houseNumber => ({ ...address, houseNumbers: houseNumber }));
      });

      setActivePlan({ addresses: processedAddresses, imagePreviewUrl: dataUrl, isSaved: false });
      setView('results');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenSaveModal = useCallback(() => {
    if (!activePlan) return;
    setIsSaveModalOpen(true);
  }, [activePlan]);

  const handleConfirmSave = useCallback(async (name: string) => {
    if (!activePlan || !name) return;

    setIsSaveModalOpen(false);
    setIsSaving(true);
    setError(null);

    try {
      // Generate a smaller, compressed thumbnail for storage to avoid hitting localStorage limits.
      const thumbnailUrl = await createThumbnailDataUrl(activePlan.imagePreviewUrl, 400, 400);

      const newPlan: SavedPlan = {
        id: Date.now().toString(),
        name,
        addresses: activePlan.addresses,
        imagePreviewUrl: thumbnailUrl,
        createdAt: new Date().toISOString(),
      };
      
      const updatedPlans = storageService.addPlan(newPlan);
      setSavedPlans(updatedPlans);
      setView('savedPlans');
      setActivePlan(null);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred while saving.';
      setError(`Save Failed: ${message}. Please try again.`);
      setView('results'); 
    } finally {
      setIsSaving(false);
    }
  }, [activePlan]);

  const handleViewPlan = useCallback((planId: string) => {
    const plan = savedPlans.find(p => p.id === planId);
    if (plan) {
      setActivePlan({ addresses: plan.addresses, imagePreviewUrl: plan.imagePreviewUrl, isSaved: true });
      setView('results');
    }
  }, [savedPlans]);

  const handleDeletePlan = useCallback((planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        const updatedPlans = storageService.deletePlan(planId);
        setSavedPlans(updatedPlans);
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'An unknown error occurred while deleting.';
        alert(`Delete Failed: ${message}`);
      }
    }
  }, []);

  const handleReset = useCallback(() => {
    setActivePlan(null);
    setError(null);
    setIsLoading(false);
    setView(savedPlans.length > 0 ? 'savedPlans' : 'upload');
  }, [savedPlans.length]);

  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Analyzing document and extracting addresses..." />;
    }
    if (isSaving) {
        return <Loader message="Saving your plan..." />;
    }
    if (error) {
      const isSaveError = error.startsWith('Save Failed:');
      return (
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
            if (!isSaveError) {
              setView('upload');
            }
          }}
          retryText={isSaveError ? 'OK' : 'Upload a different image'}
        />
      );
    }
    switch (view) {
      case 'savedPlans':
        return <SavedPlansList plans={savedPlans} onView={handleViewPlan} onDelete={handleDeletePlan} onAddNew={() => setView('upload')} />;
      case 'results':
        if (activePlan) {
          return <AddressTable plan={activePlan} onReset={handleReset} onSave={handleOpenSaveModal} />;
        }
        return null;
      case 'upload':
      default:
        return (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Upload New Address Plan</h2>
              <p className="mt-4 text-lg leading-8 text-slate-400">Our AI will extract addresses and generate navigation links for you.</p>
            </div>
            <FileUpload onFileUpload={handleImageUpload} />
             {savedPlans.length > 0 && (
                <div className="text-center mt-6">
                    <button onClick={() => setView('savedPlans')} className="text-sky-400 hover:text-sky-300 font-medium">
                        &larr; Back to Saved Plans
                    </button>
                </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Address Map Navigator. Powered by AI.</p>
      </footer>
      <SavePlanModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleConfirmSave}
        defaultName={`Plan - ${new Date().toLocaleString()}`}
      />
    </div>
  );
}