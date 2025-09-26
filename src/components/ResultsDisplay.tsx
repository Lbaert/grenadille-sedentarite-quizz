import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Heart, Brain, GraduationCap, Users, Share, Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Dot } from "recharts";
import type { ImpactResult } from "@/utils/impactCalculator";
import { generatePDF } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
interface ResultsDisplayProps {
  results: ImpactResult;
  userEmail: string;
  onDownloadPDF: () => void;
  onShare: () => void;
}
export const ResultsDisplay = ({
  results,
  userEmail,
  onDownloadPDF,
  onShare
}: ResultsDisplayProps) => {
  const {
    toast
  } = useToast();
  const handleDownloadPDF = async () => {
    try {
      await generatePDF(results, userEmail);
      toast({
        title: "PDF téléchargé ! 📄",
        description: "Votre rapport personnalisé a été téléchargé avec succès."
      });
      onDownloadPDF();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon diagnostic écrans famille',
        text: `J'ai obtenu un score de ${results.totalScore}/100 sur l'impact des écrans. ${results.shockPhrase}`,
        url: window.location.href
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API share
      navigator.clipboard.writeText(`Mon diagnostic écrans: Score ${results.totalScore}/100. ${results.shockPhrase} Découvrez Grenadille: https://www.grenadille.app/`);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans votre presse-papier."
      });
    }
    onShare();
  };
  const impactData = [{
    name: "Sommeil perturbé",
    value: results.sleepImpact.score,
    color: "#F04D5E",
    icon: "🌙",
    description: "difficulté d'endormissement, repos de mauvaise qualité"
  }, {
    name: "Santé physique fragilisée",
    value: results.physicalHealthImpact.score,
    color: "#FF6B6B",
    icon: "🏃‍♂️",
    description: "sédentarité, surpoids, fatigue visuelle"
  }, {
    name: "Attention et concentration réduites",
    value: results.attentionImpact.score,
    color: "#FF8A80",
    icon: "🎯",
    description: "moins de patience, difficulté à se focaliser"
  }, {
    name: "Résultats scolaires en baisse",
    value: results.academicImpact.score,
    color: "#FFAB40",
    icon: "📉",
    description: "apprentissages freinés, mémorisation altérée"
  }, {
    name: "Lien familial affaibli",
    value: results.familyImpact.score,
    color: "#81C784",
    icon: "💔",
    description: "moins d'échanges, tensions, complicité réduite"
  }, {
    name: "Relations sociales et estime de soi affectées",
    value: results.socialImpact.score,
    color: "#64B5F6",
    icon: "😔",
    description: "isolement, comparaison, anxiété"
  }];
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-primary";
  };
  const getScoreBackground = (score: number) => {
    if (score >= 70) return "bg-success/10";
    if (score >= 50) return "bg-warning/10";
    return "bg-primary/10";
  };
  return <div className="min-h-screen bg-gradient-hero py-8 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in-up" data-results-container>
        {/* En-tête avec score global */}
        <Card className="p-8 mb-8 shadow-soft text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <AlertTriangle className={`w-8 h-8 ${getScoreColor(results.totalScore)}`} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Votre plan d'action personnalisé
          </h1>
          
          <div className={`inline-block px-6 py-3 rounded-full ${getScoreBackground(results.totalScore)} mb-6`}>
            <span className="text-2xl font-bold">Score d'impact: </span>
            <span className={`text-3xl font-bold ${getScoreColor(results.totalScore)}`}>
              {results.totalScore}/100
            </span>
          </div>
          
        </Card>

        {/* Comparaison avec la moyenne */}
        <Card className="p-6 mb-8 shadow-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Évolution du temps d'écran par rapport à la moyenne
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={results.comparisonData.chartData} margin={{
                bottom: 40
              }}>
                  <XAxis dataKey="age" label={{
                  value: 'Âge',
                  position: 'insideBottom',
                  offset: -20
                }} />
                  <YAxis label={{
                  value: 'Temps (heures)',
                  angle: -90,
                  position: 'insideLeft'
                }} />
                  <Tooltip formatter={(value: number, name: string) => [`${value.toFixed(1)}h`, name === 'moyenne' ? 'Moyenne nationale (100+ sources)' : 'Projection si continue']} />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="moyenne" stroke="#64B5F6" strokeWidth={2} name="moyenne" />
                  <Line type="monotone" dataKey="enfant" stroke="#F04D5E" strokeWidth={2} strokeDasharray="5 5" name="évolution enfant" connectNulls={false} dot={props => {
                  if (props.payload.age === results.comparisonData.chartData[0]?.age) {
                    return <Dot {...props} r={6} fill="#F04D5E" stroke="#F04D5E" strokeWidth={2} />;
                  }
                  return null;
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Votre enfant a un temps d'écran</p>
                <p className={`text-2xl font-bold ${results.totalScore > 59 ? "text-success" : "text-destructive"}`}>
                  {results.totalScore > 59 ? "INFÉRIEUR" : "SUPÉRIEUR"}
                </p>
                <p className="text-muted-foreground">
                  à la moyenne des enfants de son âge
                </p>
              </div>
              
              
              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-center">
                  <span className="font-semibold">Conseil :</span> Découvrez sur{" "}
                  <a href="https://www.grenadille.app/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                    🌱 Grenadille
                  </a>{" "}
                  des activités près de chez vous pour réduire naturellement le temps d'écran.
                </p>
              </div>
              
              <div className="text-xs text-muted-foreground text-center">
                *Projection approximative basée sur la moyenne de plus de 100 sources
              </div>
            </div>
          </div>
        </Card>



        {/* Recommandations personnalisées */}
        <Card className="p-6 mb-8 shadow-card">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Heart className="w-6 h-6 mr-2 text-primary" />
            Recommandations personnalisées pour votre enfant ({results.detailedRecommendations.ageGroup})
          </h3>
          
          {/* Recommandations par appareil */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">📱 Recommandations par appareil</h4>
              <div className="space-y-4">
                {results.detailedRecommendations.deviceRecommendations.map((deviceRec, index) => <div key={index} className="border-l-4 border-primary/20 pl-4 py-2">
                    <h5 className="font-medium text-foreground mb-1">{deviceRec.device}</h5>
                    <p className="text-muted-foreground text-sm leading-relaxed">{deviceRec.recommendation}</p>
                  </div>)}
              </div>
            </div>

            {/* Recommandations générales */}
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">⚖️ Recommandations générales</h4>
              <div className="bg-accent/10 p-4 rounded-lg border-l-4 border-primary/30">
                <p className="text-foreground text-sm leading-relaxed">{results.detailedRecommendations.generalRecommendations}</p>
              </div>
            </div>

            {/* Activités alternatives */}
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">🎯 Activités alternatives recommandées</h4>
              <div className="bg-success/5 p-4 rounded-lg border-l-4 border-success/30">
                <p className="text-foreground text-sm leading-relaxed">{results.detailedRecommendations.alternatives}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary rounded-lg border border-primary">
            <h4 className="font-semibold text-primary-foreground mb-2">Découvrez Grenadille, la plateforme collaborative dédiée aux loisirs</h4>
            <p className="text-primary-foreground text-sm mb-4">
              Pour votre enfant, trouvez des activités locales adaptées à son âge et transformez le temps d'écran en moments de qualité près de chez vous !
            </p>
            <div className="flex justify-center">
              <Button onClick={() => window.open('https://www.grenadille.app/', '_blank')} variant="secondary" className="bg-red-200 text-black hover:bg-red-300">
                Voir les activités près de chez moi
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>;
};