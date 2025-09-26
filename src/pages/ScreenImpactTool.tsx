import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { AdultSimulationForm } from "@/components/AdultSimulationForm";
import { EmailCollection } from "@/components/EmailCollection";
import { AdultResultsDisplay } from "@/components/AdultResultsDisplay";
import { calculateAdultImpact } from "@/utils/adultImpactCalculator";
import type { AdultSimulationData, AdultImpactResult } from "@/utils/adultImpactCalculator";

type Step = 'welcome' | 'simulation' | 'email' | 'results';

export const ScreenImpactTool = () => {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [simulationData, setSimulationData] = useState<AdultSimulationData | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [results, setResults] = useState<AdultImpactResult | null>(null);

  const handleStart = () => {
    setCurrentStep('simulation');
  };

  const handleSimulationComplete = (data: AdultSimulationData) => {
    setSimulationData(data);
    setCurrentStep('email');
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    
    if (simulationData) {
      const calculatedResults = calculateAdultImpact(simulationData);
      setResults(calculatedResults);
      setCurrentStep('results');
    }
  };

  const handleDownloadPDF = () => {
    // Géré dans le composant AdultResultsDisplay
  };

  const handleShare = () => {
    // Géré dans le composant AdultResultsDisplay
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'simulation':
        setCurrentStep('welcome');
        break;
      case 'email':
        setCurrentStep('simulation');
        break;
      case 'results':
        setCurrentStep('email');
        break;
      default:
        setCurrentStep('welcome');
    }
  };

  return (
    <div className="min-h-screen">
      {currentStep === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      
      {currentStep === 'simulation' && (
        <AdultSimulationForm 
          onNext={handleSimulationComplete}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 'email' && simulationData && (
        <EmailCollection 
          onEmailSubmit={handleEmailSubmit}
          onBack={handleBack}
          simulationData={simulationData}
        />
      )}
      
      {currentStep === 'results' && results && (
        <AdultResultsDisplay 
          results={results}
          userEmail={userEmail}
          onDownloadPDF={handleDownloadPDF}
          onShare={handleShare}
        />
      )}
      
      {/* Footer Grenadille */}
      <footer className="bg-card border-t py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Créé par{' '}
            <a 
              href="https://www.grenadille.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Grenadille 🌱
            </a>
            {' '}• Renforcez vos liens familiaux avec des activités enrichissantes
          </p>
        </div>
      </footer>
    </div>
  );
};