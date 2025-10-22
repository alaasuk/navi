// Fix: Define and export the Address interface.
export interface Address {
  plz: string;
  street: string;
  houseNumbers: string;
  city: string;
}

// Fix: Removed circular import `import { Address } from './types';` which was causing errors.
export interface SavedPlan {
  id: string;
  name: string;
  imagePreviewUrl: string;
  addresses: Address[];
  createdAt: string;
}
