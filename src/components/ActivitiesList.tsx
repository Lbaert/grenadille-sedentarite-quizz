import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink, Bike, Gamepad, ChefHat, TreePine, Book, Volleyball } from "lucide-react";

const activities = [
  { 
    name: "Pique-nique en famille", 
    icon: Heart, 
    description: "Moment de partage et de détente dans la nature",
    duration: "2-3h"
  },
  { 
    name: "Balade à vélo", 
    icon: Bike, 
    description: "Activité sportive et découverte de nouveaux lieux",
    duration: "1-2h"
  },
  { 
    name: "Jeux de société", 
    icon: Gamepad, 
    description: "Moments de complicité et développement cognitif",
    duration: "1h"
  },
  { 
    name: "Cuisine en famille", 
    icon: ChefHat, 
    description: "Apprentissage pratique et créativité culinaire",
    duration: "1-2h"
  },
  { 
    name: "Sortie nature", 
    icon: TreePine, 
    description: "Randonnée, parc, observation de la faune et flore",
    duration: "2-4h"
  },
  { 
    name: "Temps de lecture partagé", 
    icon: Book, 
    description: "Développement de l'imagination et moments calmes",
    duration: "30min-1h"
  },
  { 
    name: "Activité sportive", 
    icon: Volleyball, 
    description: "Football, yoga, danse, badminton...",
    duration: "1-2h"
  }
];

interface ActivitiesListProps {
  onNext: () => void;
}

export const ActivitiesList = ({ onNext }: ActivitiesListProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Redécouvrez le plaisir des moments 
            <span className="text-primary block">en famille</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Remplacez le temps d'écran par des activités enrichissantes qui renforcent vos liens familiaux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Card 
                key={activity.name} 
                className="p-6 hover-lift shadow-card transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-primary p-3 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{activity.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-medium text-sm">⏱️ {activity.duration}</span>
                      <span className="text-success text-sm">✨ Enrichissant</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Grenadille */}
        <Card className="p-8 shadow-soft bg-gradient-warm text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Envie de découvrir encore plus d'activités ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Grenadille vous propose des centaines d'activités locales pour renforcer vos liens familiaux 
              et créer des souvenirs inoubliables avec vos enfants.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://www.grenadille.app/', '_blank')}
                className="bg-gradient-primary hover-glow"
              >
                Découvrir Grenadille 🌱
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
              
              <Button 
                onClick={onNext}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Continuer le diagnostic
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Conseil :</strong> Commencez par 2-3 activités par semaine pour créer de nouvelles habitudes positives
          </p>
        </div>
      </div>
    </div>
  );
};