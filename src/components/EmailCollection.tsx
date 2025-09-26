import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdultSimulationData } from "@/utils/adultImpactCalculator";

interface EmailCollectionProps {
  onEmailSubmit: (email: string) => void;
  onBack: () => void;
  simulationData: AdultSimulationData;
}

export const EmailCollection = ({ onEmailSubmit, onBack, simulationData }: EmailCollectionProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoi vers Make.com / Google Sheets
      const response = await fetch('https://hook.eu2.make.com/12b58avbachuvfl35jbqy54fxa7p87xc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
          source: 'sedentarite-adulte-tool',
          age: simulationData.age,
          activity_hours: simulationData.activity_hours,
          sedentary_hours: simulationData.sedentary_hours,
          screen_hours: simulationData.screen_hours,
          sleep_hours: simulationData.sleep_hours
        })
      });

      toast({
        title: "Parfait ! 🎉",
        description: "Vos résultats personnalisés arrivent...",
      });
      
      onEmailSubmit(email);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      // On continue même en cas d'erreur avec l'envoi
      toast({
        title: "Résultats prêts !",
        description: "Découvrez votre diagnostic personnalisé",
      });
      onEmailSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-md mx-auto animate-fade-in-up">
        <Card className="p-8 shadow-soft">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
              <Gift className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Votre diagnostic personnalisé
            </h2>
            <p className="text-muted-foreground text-sm">
              Recevez vos résultats détaillés et un rapport gratuit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Adresse email
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="bg-family-warm p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-family-warm-foreground">
                    Vos données sont protégées
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Nous ne partageons jamais vos informations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Génération en cours..." : "Voir mes résultats"}
              </Button>
              
              <Button 
                type="button"
                variant="ghost" 
                onClick={onBack}
                className="w-full"
              >
                Retour
              </Button>
            </div>
          </form>

        </Card>
      </div>
    </div>
  );
};