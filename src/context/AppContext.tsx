import React, { createContext, useContext, useState } from 'react';

interface UserData {
  name: string;
  dob: string;
  phone: string;
  mpin: string;
  creditLimit: number;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

interface AppContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  step: number;
  setStep: (step: number) => void;
}

const initialUserData: UserData = {
  name: '',
  dob: '',
  phone: '',
  mpin: '',
  creditLimit: 150000,
  cardNumber: '',
  cardHolderName: '',
  expiryDate: '',
  cvv: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [step, setStep] = useState(1);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  return (
    <AppContext.Provider value={{ userData, updateUserData, step, setStep }}>
      {children}
    </AppContext.Provider>
  );
};