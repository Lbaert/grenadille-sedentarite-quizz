import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Brain, 
  Users, 
  Moon, 
  Activity,
  TrendingUp,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import type { AdultImpactResult } from "@/utils/adultImpactCalculator";

interface AdultResultsDisplayProps {
  results: AdultImpactResult;
  userEmail: string;
  onDownloadPDF: () => void;
  onShare: () => void;
}

export const AdultResultsDisplay = ({
  results,
  userEmail,
  onDownloadPDF,
  onShare
}: AdultResultsDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score > 65) return "text-green-600";
    if (score >= 55) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackgroundColor = (score: number) => {
    if (score > 65) return "bg-green-500";
    if (score >= 55) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score > 65) return "text-green-600";
    if (score >= 55) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthRiskIcon = (level: string) => {
    switch (level) {
      case 'Excellent':
      case 'Bon':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Votre Analyse de Santé
          </h1>
          <p className="text-xl text-muted-foreground">
            Analyse personnalisée de votre mode de vie
          </p>
        </div>

        {/* Score Global */}
        <Card className="p-8 mb-8 text-center shadow-soft">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getScoreBackgroundColor(results.totalScore)}`}>
              <span className="text-3xl font-bold text-black">
                {Math.round(results.totalScore)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Score Santé Global
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {getHealthRiskIcon(results.healthRisk.level)}
              <Badge 
                variant="secondary" 
                className={`text-lg px-4 py-2 ${results.healthRisk.color === 'green' ? 'bg-green-100 text-green-700' : 
                  results.healthRisk.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  results.healthRisk.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  results.healthRisk.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'}`}
              >
                {results.healthRisk.level}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {results.healthRisk.description}
            </p>
          </div>
          
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Impacts Détaillés */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center">
              <Activity className="mr-3 w-6 h-6 text-primary" />
              Impacts sur votre santé
            </h3>

            {/* Impact Physique */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Heart className="w-6 h-6 text-red-500 mr-3" />
                  <h4 className="font-semibold">Santé Physique</h4>
                </div>
                <span className={`font-bold ${getScoreColor(results.physicalImpact.score)}`}>
                  {Math.round(results.physicalImpact.score)}/100
                </span>
              </div>
              <Progress value={results.physicalImpact.score} className="mb-4" />
              <p className="text-sm text-muted-foreground mb-3">
                {results.physicalImpact.description}
              </p>
              {results.physicalImpact.risksPerYear.length > 0 && (
                <div className="space-y-1">
                  {results.physicalImpact.risksPerYear.map((risk, index) => (
                    <div key={index} className="flex items-center text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {risk}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Impact Mental */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Brain className="w-6 h-6 text-blue-500 mr-3" />
                  <h4 className="font-semibold">Santé Mentale</h4>
                </div>
                <span className={`font-bold ${getScoreColor(results.mentalImpact.score)}`}>
                  {Math.round(results.mentalImpact.score)}/100
                </span>
              </div>
              <Progress value={results.mentalImpact.score} className="mb-4" />
              <p className="text-sm text-muted-foreground mb-3">
                {results.mentalImpact.description}
              </p>
              {results.mentalImpact.effects.length > 0 && (
                <div className="space-y-1">
                  {results.mentalImpact.effects.map((effect, index) => (
                    <div key={index} className="flex items-center text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {effect}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Impact Social */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-green-500 mr-3" />
                  <h4 className="font-semibold">Vie Sociale</h4>
                </div>
                <span className={`font-bold ${getScoreColor(results.socialImpact.score)}`}>
                  {Math.round(results.socialImpact.score)}/100
                </span>
              </div>
              <Progress value={results.socialImpact.score} className="mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                {results.socialImpact.description}
              </p>
              <p className="text-sm text-orange-600">
                {results.socialImpact.timeImpact}
              </p>
            </Card>

            {/* Impact Sommeil */}
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Moon className="w-6 h-6 text-purple-500 mr-3" />
                  <h4 className="font-semibold">Qualité du Sommeil</h4>
                </div>
                <span className={`font-bold ${getScoreColor(results.sleepImpact.score)}`}>
                  {Math.round(results.sleepImpact.score)}/100
                </span>
              </div>
              <Progress value={results.sleepImpact.score} className="mb-4" />
              <p className="text-sm text-muted-foreground mb-3">
                {results.sleepImpact.quality}
              </p>
              {results.sleepImpact.effects.length > 0 && (
                <div className="space-y-1">
                  {results.sleepImpact.effects.map((effect, index) => (
                    <div key={index} className="flex items-center text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {effect}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Comparaison et Graphique */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground flex items-center">
              <TrendingUp className="mr-3 w-6 h-6 text-primary" />
              Comparaison avec la moyenne
            </h3>

            {/* Stats de Comparaison */}
            <Card className="p-6 shadow-card">
              <div className="text-center mb-6">
                <h4 className="font-semibold mb-4">Votre position par rapport aux français de votre âge</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-2xl font-bold ${getScoreTextColor(results.totalScore)}`}>
                      {Math.round(results.comparisonData.userScore)}
                    </p>
                    <p className="text-sm text-muted-foreground">Votre score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(results.comparisonData.averageScore)}
                    </p>
                    <p className="text-sm text-muted-foreground">Moyenne française</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Graphique d'évolution */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold mb-4">Évolution par âge</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={results.comparisonData.chartData}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis 
                       dataKey="age" 
                       label={{ value: 'Âge', position: 'insideBottom', offset: -10 }}
                     />
                     <YAxis 
                       label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                     />
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={50} wrapperStyle={{ paddingTop: '20px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="moyenne" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Moyenne française"
                        dot={false}
                      />
                       <Line 
                         type="monotone" 
                         dataKey="utilisateur" 
                         stroke="#ef4444" 
                         strokeWidth={2}
                         name="Votre évolution future"
                         strokeDasharray="5 5"
                         dot={false}
                         connectNulls={true}
                       />
                      <Line 
                        type="monotone" 
                        dataKey="utilisateur_actuel" 
                        stroke="#ef4444" 
                        strokeWidth={0}
                        legendType="none"
                        dot={{fill: '#ef4444', strokeWidth: 3, r: 6}}
                        connectNulls={false}
                      />
                   </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Analyse Détaillée */}
            <Card className="p-6 shadow-card">
              <h4 className="font-semibold mb-4">Analyse Personnalisée</h4>
              <p className="text-muted-foreground leading-relaxed">
                {results.detailedAnalysis}
              </p>
            </Card>
          </div>
        </div>

        {/* Recommandations */}
        <Card className="p-8 shadow-soft">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            🎯 Vos Recommandations Personnalisées
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-accent/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>

        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Rapport généré pour {userEmail}
          </p>
        </div>
      </div>
    </div>
  );
};