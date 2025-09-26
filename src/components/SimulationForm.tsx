import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { ArrowRight, Smartphone, Tv, Gamepad2, Globe } from "lucide-react";
interface SimulationData {
  childAge: number;
  screenTimeHours: number;
  mainDevices: string[];
}
interface SimulationFormProps {
  onNext: (data: SimulationData) => void;
  onBack: () => void;
}
export const SimulationForm = ({
  onNext,
  onBack
}: SimulationFormProps) => {
  const [childAge, setChildAge] = useState(8);
  const [screenTimeHours, setScreenTimeHours] = useState(3);
  const [mainDevices, setMainDevices] = useState<string[]>([]);
  const devices = [{
    id: "smartphone",
    label: "Smartphone/Tablette",
    icon: Smartphone
  }, {
    id: "tv",
    label: "Télévision",
    icon: Tv
  }, {
    id: "gaming",
    label: "Jeux vidéo",
    icon: Gamepad2
  }, {
    id: "internet",
    label: "Internet/Réseaux sociaux",
    icon: Globe
  }];
  const toggleDevice = (deviceId: string) => {
    setMainDevices(prev => prev.includes(deviceId) ? prev.filter(d => d !== deviceId) : [...prev, deviceId]);
  };
  const handleSubmit = () => {
    onNext({
      childAge,
      screenTimeHours,
      mainDevices
    });
  };
  return <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <Card className="p-8 shadow-soft">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Parlez-nous de votre enfant
            </h2>
            <p className="text-muted-foreground">
              Ces informations nous aident à personnaliser votre diagnostic
            </p>
          </div>

          <div className="space-y-8">
            {/* Age de l'enfant */}
            <div>
              <Label className="text-lg font-medium block mb-4">
                Quel âge a votre enfant ?
              </Label>
              <div className="space-y-4">
                <Slider value={[childAge]} onValueChange={value => setChildAge(value[0])} max={18} min={1} step={1} className="w-full" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">
                    {childAge}
                  </span>
                  <span className="text-muted-foreground ml-2">ans</span>
                </div>
              </div>
            </div>

            {/* Temps d'écran */}
            <div>
              <Label className="text-lg font-medium block mb-4">
                Combien de temps passe-t-il devant les écrans par jour ?
              </Label>
              <div className="space-y-4">
                <Slider value={[screenTimeHours]} onValueChange={value => setScreenTimeHours(value[0])} max={12} min={0} step={0.5} className="w-full" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">
                    {Math.floor(screenTimeHours)}h{screenTimeHours % 1 !== 0 ? `${Math.round((screenTimeHours % 1) * 60)}min` : ''}
                  </span>
                  <span className="text-muted-foreground ml-2">par jour</span>
                </div>
                
              </div>
            </div>

            {/* Appareils principaux */}
            <div>
              <Label className="text-lg font-medium block mb-4">
                Quels sont ses appareils préférés ?
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map(device => {
                const Icon = device.icon;
                const isSelected = mainDevices.includes(device.id);
                return <button key={device.id} onClick={() => toggleDevice(device.id)} className={`p-4 rounded-lg border-2 transition-all hover-lift ${isSelected ? "border-primary bg-accent text-primary" : "border-border hover:border-primary/50"}`}>
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{device.label}</p>
                    </button>;
              })}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-8">
            <Button variant="outline" onClick={onBack}>
              Retour
            </Button>
            
            <Button onClick={handleSubmit} className="bg-gradient-primary hover-glow" disabled={screenTimeHours === 0}>
              Voir mes résultats
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>;
};