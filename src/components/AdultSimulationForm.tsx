import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft } from "lucide-react";
import questionsData from '@/data/questions.json';
import type { AdultSimulationData } from "@/utils/adultImpactCalculator";

interface AdultSimulationFormProps {
  onNext: (data: AdultSimulationData) => void;
  onBack: () => void;
}

export const AdultSimulationForm = ({
  onNext,
  onBack
}: AdultSimulationFormProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Initialize answers with default values (middle of each range)
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const initialAnswers: Record<string, number> = {};
    questionsData.questions.forEach(question => {
      initialAnswers[question.id] = Math.floor((question.min + question.max) / 2);
    });
    return initialAnswers;
  });
  
  const questions = questionsData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, submit the form
      const simulationData: AdultSimulationData = {
        age: answers.age,
        activity_hours: answers.activity_hours,
        activity_days: answers.activity_days,
        activity_intensity: answers.activity_intensity,
        sedentary_hours: answers.sedentary_hours,
        screen_hours: answers.screen_hours,
        sleep_hours: answers.sleep_hours,
        sleep_quality: answers.sleep_quality,
        energy_level: answers.energy_level,
        stress_level: answers.stress_level,
        social_activities: answers.social_activities,
        outdoor_hours: answers.outdoor_hours
      };
      onNext(simulationData);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const currentAnswer = answers[currentQuestion.id];

  const formatValue = (value: number) => {
    if (currentQuestion.unit === "/10") {
      return `${value}/10`;
    } else if (currentQuestion.unit === "h/jour" || currentQuestion.unit === "h/semaine" || currentQuestion.unit === "h/nuit") {
      return `${value}${currentQuestion.unit.replace('h/', 'h ')}`;
    } else {
      return `${value} ${currentQuestion.unit}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <Card className="p-8 shadow-soft">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {currentQuestion.label}
            </h2>
            <p className="text-muted-foreground">
              Déplacez le curseur pour répondre
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <div className="space-y-6">
                <Slider 
                  value={[currentAnswer]} 
                  onValueChange={(value) => handleAnswerChange(value[0])} 
                  max={currentQuestion.max} 
                  min={currentQuestion.min} 
                  step={currentQuestion.step} 
                  className="w-full" 
                />
                
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {formatValue(currentAnswer)}
                  </span>
                </div>

                {/* Range indicators */}
                <div className="flex justify-between text-xs text-muted-foreground px-2">
                  <span>{formatValue(currentQuestion.min)}</span>
                  <span>{formatValue(currentQuestion.max)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              {currentQuestionIndex === 0 ? 'Retour' : 'Précédent'}
            </Button>
            
            <Button 
              onClick={handleNext} 
              className="bg-gradient-primary hover-glow flex items-center"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Voir mes résultats' : 'Suivant'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};