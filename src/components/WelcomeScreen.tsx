import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Moon, Activity, Target, TrendingDown, Zap, Brain } from "lucide-react";
interface WelcomeScreenProps {
  onStart: () => void;
}
export const WelcomeScreen = ({
  onStart
}: WelcomeScreenProps) => {
  return <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-6 animate-gentle-bounce">
            <Activity className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Votre mode de vie sédentaire 
            <span className="text-red-500 block">impacte plus que vous ne le pensez</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto">Découvrez l'impact réel de votre sédentarité sur votre santé physique et mentale, et obtenez des solutions personnalisées</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 hover-lift shadow-card">
            <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Risques cardiovasculaires</h3>
            <p className="text-sm text-muted-foreground">Hypertension, diabète, maladies cardiaques</p>
          </Card>
          
          <Card className="p-4 hover-lift shadow-card">
            <TrendingDown className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Perte de masse musculaire</h3>
            <p className="text-sm text-muted-foreground">Faiblesse, douleurs dorsales, fragilité osseuse</p>
          </Card>
          
          <Card className="p-4 hover-lift shadow-card">
            <Brain className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Santé mentale dégradée</h3>
            <p className="text-sm text-muted-foreground">Stress, anxiété, dépression, fatigue chronique</p>
          </Card>

          <Card className="p-4 hover-lift shadow-card">
            <Moon className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Troubles du sommeil</h3>
            <p className="text-sm text-muted-foreground">Insomnie, sommeil non réparateur, fatigue</p>
          </Card>
          
          <Card className="p-4 hover-lift shadow-card">
            <Users className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Isolement social</h3>
            <p className="text-sm text-muted-foreground">Moins d'activités, relations appauvries</p>
          </Card>
          
          <Card className="p-4 hover-lift shadow-card">
            <Zap className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Baisse d'énergie</h3>
            <p className="text-sm text-muted-foreground">Fatigue, manque de motivation, productivité réduite</p>
          </Card>
        </div>

        <p className="text-lg font-medium text-foreground mb-4">
          Votre mode de vie est-il trop sédentaire pour votre santé ?
        </p>

        <Button onClick={onStart} size="lg" className="bg-gradient-primary hover-glow text-lg px-8 py-6 rounded-full animate-scale-in">
          Évaluez votre santé en 3 minutes
        </Button>
        
        <p className="text-sm text-muted-foreground mt-4">
          Gratuit • 3 minutes • Analyse personnalisée
        </p>
      </div>
    </div>;
};