import questionsData from '@/data/questions.json';
import { calculateScore } from '@/utils/scoringSystem.js';
import { parseAverageScores } from '@/utils/csvParser';
import scoreMoyenCsv from '@/data/score_moyen_francais.csv?raw';

export interface AdultSimulationData {
  age: number;
  activity_hours: number;
  activity_days: number;
  activity_intensity: number;
  sedentary_hours: number;
  screen_hours: number;
  sleep_hours: number;
  sleep_quality: number;
  energy_level: number;
  stress_level: number;
  social_activities: number;
  outdoor_hours: number;
}

export interface AdultImpactResult {
  totalScore: number;
  healthRisk: {
    level: string;
    description: string;
    color: string;
  };
  physicalImpact: {
    score: number;
    description: string;
    risksPerYear: string[];
  };
  mentalImpact: {
    score: number;
    description: string;
    effects: string[];
  };
  socialImpact: {
    score: number;
    description: string;
    timeImpact: string;
  };
  sleepImpact: {
    score: number;
    quality: string;
    effects: string[];
  };
  shockPhrase: string;
  comparisonData: {
    userScore: number;
    averageScore: number;
    betterThanPercent: number;
    chartData: Array<{
      age: number;
      moyenne: number;
      utilisateur: number;
    }>;
  };
  recommendations: string[];
  detailedAnalysis: string;
}

// Parse average scores data
const averageScores = parseAverageScores(scoreMoyenCsv);
const averageScoreByAge: Record<number, number> = {};
averageScores.forEach(item => {
  averageScoreByAge[item.age] = item.score_moyen;
});

// Helper function to convert answers to scoring format
const formatAnswerForScoring = (questionId: string, value: number): string => {
  switch (questionId) {
    case 'activity_hours':
      if (value === 0) return '0';
      if (value === 1) return '1';
      if (value >= 2 && value <= 3) return '2-3';
      if (value >= 4 && value <= 6) return '4-6';
      if (value >= 7 && value <= 10) return '7-10';
      return '>10';
    
    case 'activity_days':
      if (value === 0) return '0';
      if (value >= 1 && value <= 2) return '1-2';
      if (value >= 3 && value <= 4) return '3-4';
      if (value >= 5 && value <= 6) return '5-6';
      return '7';
    
    case 'activity_intensity':
      if (value === 0) return '0';
      if (value >= 1 && value <= 2) return '1-2';
      if (value >= 3 && value <= 5) return '3-5';
      if (value >= 6 && value <= 8) return '6-8';
      return '9-10';
    
    case 'sedentary_hours':
      if (value >= 12) return '≥12h';
      if (value >= 9 && value <= 11) return '9-11h';
      if (value >= 6 && value <= 8) return '6-8h';
      return '≤5h';
    
    case 'screen_hours':
      if (value >= 6) return '≥6h';
      if (value >= 4 && value <= 5) return '4-5h';
      if (value >= 2 && value <= 3) return '2-3h';
      return '≤1h';
    
    case 'sleep_hours':
      if (value <= 5) return '≤5h';
      if (value === 6) return '6h';
      if (value >= 7 && value <= 8) return '7-8h';
      if (value === 9) return '9h';
      return '≥10h';
    
    case 'sleep_quality':
    case 'energy_level':
      if (value >= 0 && value <= 2) return '0-2';
      if (value >= 3 && value <= 4) return '3-4';
      if (value >= 5 && value <= 6) return '5-6';
      if (value >= 7 && value <= 8) return '7-8';
      return '9-10';
    
    case 'stress_level':
      // Stress is inverted - higher stress = lower score
      if (value >= 0 && value <= 2) return '0-2';
      if (value >= 3 && value <= 4) return '3-4';
      if (value >= 5 && value <= 6) return '5-6';
      if (value >= 7 && value <= 8) return '7-8';
      return '9-10';
    
    case 'social_activities':
      if (value === 0) return '0';
      if (value === 1) return '1';
      if (value >= 2 && value <= 3) return '2-3';
      if (value >= 4 && value <= 6) return '4-6';
      return '≥7';
    
    case 'outdoor_hours':
      if (value >= 0 && value <= 1) return '0-1h';
      if (value >= 2 && value <= 3) return '2-3h';
      if (value >= 4 && value <= 5) return '4-5h';
      if (value >= 6 && value <= 10) return '6-10h';
      return '≥11h';
    
    default:
      return value.toString();
  }
};

export const calculateAdultImpact = (data: AdultSimulationData): AdultImpactResult => {
  const { age } = data;
  
  // Format answers for the scoring system
  const formattedAnswers: Record<string, string> = {};
  
  // Map form fields to scoring system fields
  const fieldMapping = {
    'activity_hours': 'activite_physique_heures',
    'activity_days': 'activite_physique_jours', 
    'activity_intensity': 'activite_physique_intensite',
    'sedentary_hours': 'sedentarite_heures_assis',
    'screen_hours': 'sedentarite_heures_ecran',
    'sleep_hours': 'sommeil_heures',
    'sleep_quality': 'sommeil_qualite',
    'energy_level': 'bienetre_energie',
    'stress_level': 'bienetre_stress',
    'social_activities': 'social_activites',
    'outdoor_hours': 'exterieur_heures'
  };
  
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'age' && fieldMapping[key as keyof typeof fieldMapping]) {
      const scoringKey = fieldMapping[key as keyof typeof fieldMapping];
      formattedAnswers[scoringKey] = formatAnswerForScoring(key, value as number);
    }
  });
  
  // Calculate total score using the imported scoring system
  const totalScore = calculateScore(age, formattedAnswers);
  
  // Get average score for age
  const averageScore = averageScoreByAge[age] || 60;
  
  // Calculate health risk level
  const healthRisk = getHealthRiskLevel(totalScore);
  
  // Calculate individual impact scores
  const physicalImpact = calculatePhysicalImpact(data);
  const mentalImpact = calculateMentalImpact(data);
  const socialImpact = calculateSocialImpact(data);
  const sleepImpact = calculateSleepImpact(data);
  
  // Generate shock phrase
  const shockPhrase = generateAdultShockPhrase(data, totalScore);
  
  // Generate chart data
  const chartData = generateAdultChartData(age, totalScore);
  
  // Calculate comparison
  const betterThanPercent = Math.round(Math.max(10, Math.min(90, 
    totalScore >= averageScore ? 50 + ((totalScore - averageScore) / 40) * 40 : 
    50 - ((averageScore - totalScore) / averageScore) * 30
  )));
  
  // Generate recommendations
  const recommendations = generateAdultRecommendations(data, totalScore);
  
  // Generate detailed analysis
  const detailedAnalysis = generateDetailedAnalysis(data, totalScore);
  
  return {
    totalScore,
    healthRisk,
    physicalImpact,
    mentalImpact,
    socialImpact,
    sleepImpact,
    shockPhrase,
    comparisonData: {
      userScore: totalScore,
      averageScore,
      betterThanPercent,
      chartData
    },
    recommendations,
    detailedAnalysis
  };
};

const getHealthRiskLevel = (score: number) => {
  if (score >= 80) {
    return {
      level: 'Excellent',
      description: 'Votre mode de vie est exemplaire ! Continuez sur cette voie.',
      color: 'green'
    };
  } else if (score >= 65) {
    return {
      level: 'Bon',
      description: 'Votre mode de vie est globalement sain avec quelques points à améliorer.',
      color: 'blue'
    };
  } else if (score >= 50) {
    return {
      level: 'Moyen',
      description: 'Votre mode de vie présente des risques modérés pour votre santé.',
      color: 'yellow'
    };
  } else if (score >= 35) {
    return {
      level: 'Préoccupant',
      description: 'Votre mode de vie présente des risques importants. Il est temps d\'agir !',
      color: 'orange'
    };
  } else {
    return {
      level: 'Critique',
      description: 'Votre mode de vie présente des risques majeurs. Consultez un professionnel de santé.',
      color: 'red'
    };
  }
};

const calculatePhysicalImpact = (data: AdultSimulationData) => {
  const { activity_hours, sedentary_hours, activity_days } = data;
  
  let score = 50;
  
  // Activity hours impact
  if (activity_hours >= 5) score += 20;
  else if (activity_hours >= 3) score += 10;
  else if (activity_hours <= 1) score -= 20;
  
  // Sedentary hours impact
  if (sedentary_hours >= 10) score -= 25;
  else if (sedentary_hours >= 8) score -= 15;
  else if (sedentary_hours <= 6) score += 10;
  
  // Activity frequency impact
  if (activity_days >= 5) score += 15;
  else if (activity_days >= 3) score += 5;
  else if (activity_days <= 1) score -= 15;
  
  score = Math.max(0, Math.min(100, score));
  
  const risksPerYear = [];
  if (activity_hours < 2) risksPerYear.push("Risque cardiovasculaire +40%");
  if (sedentary_hours > 8) risksPerYear.push("Risque de diabète +25%");
  if (activity_days < 3) risksPerYear.push("Perte de masse musculaire -5%");
  
  return {
    score,
    description: getPhysicalDescription(score),
    risksPerYear
  };
};

const calculateMentalImpact = (data: AdultSimulationData) => {
  const { stress_level, energy_level, screen_hours, outdoor_hours } = data;
  
  let score = 50;
  
  // Stress impact (inverted)
  score += (10 - stress_level) * 3;
  
  // Energy impact
  score += energy_level * 3;
  
  // Screen time impact
  if (screen_hours >= 5) score -= 15;
  else if (screen_hours >= 3) score -= 8;
  
  // Outdoor time impact
  if (outdoor_hours >= 5) score += 10;
  else if (outdoor_hours <= 2) score -= 10;
  
  score = Math.max(0, Math.min(100, score));
  
  const effects = [];
  if (stress_level > 7) effects.push("Risque de burnout élevé");
  if (energy_level < 5) effects.push("Fatigue chronique");
  if (screen_hours > 4) effects.push("Surcharge informationnelle");
  
  return {
    score,
    description: getMentalDescription(score),
    effects
  };
};

const calculateSocialImpact = (data: AdultSimulationData) => {
  const { social_activities, screen_hours, outdoor_hours } = data;
  
  let score = 50;
  
  // Social activities impact
  if (social_activities >= 5) score += 25;
  else if (social_activities >= 3) score += 10;
  else if (social_activities <= 1) score -= 20;
  
  // Screen time impact on social life
  if (screen_hours >= 5) score -= 15;
  
  // Outdoor activities impact
  if (outdoor_hours >= 5) score += 10;
  
  score = Math.max(0, Math.min(100, score));
  
  const lostSocialTime = Math.max(0, (5 - social_activities) * 2);
  const timeImpact = `${lostSocialTime}h de moins par semaine que la moyenne`;
  
  return {
    score,
    description: getSocialDescription(score),
    timeImpact
  };
};

const calculateSleepImpact = (data: AdultSimulationData) => {
  const { sleep_hours, sleep_quality, screen_hours } = data;
  
  let score = 50;
  
  // Sleep duration impact
  if (sleep_hours >= 7 && sleep_hours <= 8) score += 20;
  else if (sleep_hours >= 6) score += 10;
  else if (sleep_hours <= 5) score -= 25;
  else if (sleep_hours >= 9) score -= 10;
  
  // Sleep quality impact
  score += sleep_quality * 4;
  
  // Screen time impact on sleep
  if (screen_hours >= 4) score -= 15;
  
  score = Math.max(0, Math.min(100, score));
  
  const effects = [];
  if (sleep_hours < 7) effects.push("Manque de sommeil chronique");
  if (sleep_quality < 5) effects.push("Sommeil non réparateur");
  if (screen_hours > 3) effects.push("Écrans perturbent l'endormissement");
  
  return {
    score,
    quality: getSleepQuality(score),
    effects
  };
};

const getPhysicalDescription = (score: number): string => {
  if (score >= 80) return "Excellente condition physique";
  if (score >= 65) return "Bonne condition physique";
  if (score >= 50) return "Condition physique moyenne";
  if (score >= 35) return "Condition physique dégradée";
  return "Condition physique préoccupante";
};

const getMentalDescription = (score: number): string => {
  if (score >= 80) return "Excellent équilibre mental";
  if (score >= 65) return "Bon équilibre mental";
  if (score >= 50) return "Équilibre mental fragile";
  if (score >= 35) return "Déséquilibre mental notable";
  return "Détresse psychologique";
};

const getSocialDescription = (score: number): string => {
  if (score >= 80) return "Vie sociale épanouie";
  if (score >= 65) return "Vie sociale satisfaisante";
  if (score >= 50) return "Vie sociale limitée";
  if (score >= 35) return "Isolement social modéré";
  return "Isolement social important";
};

const getSleepQuality = (score: number): string => {
  if (score >= 80) return "Sommeil excellent";
  if (score >= 65) return "Sommeil de qualité";
  if (score >= 50) return "Sommeil correct";
  if (score >= 35) return "Sommeil perturbé";
  return "Sommeil très dégradé";
};

const generateAdultShockPhrase = (data: AdultSimulationData, score: number): string => {
  const phrases = [
    `Avec ${data.sedentary_hours}h assis par jour, vous perdez ${Math.round(data.sedentary_hours * 0.5)} mois d'espérance de vie par an.`,
    `Votre sédentarité équivaut à ${Math.round(data.sedentary_hours * 365 / 24)} jours complets assis chaque année.`,
    `En 10 ans, vous passerez ${Math.round(data.sedentary_hours * 365 * 10 / 24 / 365)} années complètes en position assise.`,
    `Votre score de ${Math.round(score)}/100 vous place ${score < 60 ? 'dans la zone de risque' : 'dans la moyenne'} pour votre âge.`
  ];
  
  return phrases[Math.floor(Math.random() * phrases.length)];
};

const generateAdultChartData = (userAge: number, userScore: number) => {
  const data = [];
  
  // Generate data from user age to future ages
  for (let age = userAge; age <= Math.min(80, userAge + 15); age++) {
    const avgScore = averageScoreByAge[age] || 60;
    
    // For current age, use user score, otherwise project based on current deviation
    const deviation = userScore - (averageScoreByAge[userAge] || 60);
    const projectedUserScore = age === userAge ? userScore : Math.max(0, Math.min(100, avgScore + deviation));
    
    data.push({
      age,
      moyenne: avgScore,
      utilisateur: age >= userAge ? Math.round(projectedUserScore) : null,
      utilisateur_actuel: age === userAge ? Math.round(userScore) : null
    });
  }
  
  return data;
};

const generateAdultRecommendations = (data: AdultSimulationData, score: number): string[] => {
  const recommendations: string[] = [];
  
  if (data.activity_hours < 3) {
    recommendations.push("Augmentez votre activité physique à au moins 150 min/semaine");
  }
  
  if (data.sedentary_hours > 8) {
    recommendations.push("Levez-vous 5 minutes toutes les heures de travail");
  }
  
  if (data.screen_hours > 3) {
    recommendations.push("Limitez les écrans récréatifs à 2h maximum par jour");
  }
  
  if (data.sleep_hours < 7) {
    recommendations.push("Visez 7-8h de sommeil par nuit pour optimiser votre récupération");
  }
  
  if (data.outdoor_hours < 3) {
    recommendations.push("Passez au moins 30 min par jour à l'extérieur");
  }
  
  if (data.social_activities < 3) {
    recommendations.push("Planifiez au moins 3 activités sociales par semaine");
  }
  
  // Add a general recommendation based on score
  if (score < 50) {
    recommendations.push("Consultez un professionnel de santé pour un accompagnement personnalisé");
  } else if (score < 70) {
    recommendations.push("Adoptez une routine quotidienne incluant 30 min d'activité physique");
  }
  
  return recommendations.slice(0, 4);
};

const generateDetailedAnalysis = (data: AdultSimulationData, score: number): string => {
  let analysis = `Avec un score global de ${Math.round(score)}/100, `;
  
  if (score >= 70) {
    analysis += "vous avez un mode de vie globalement sain. ";
  } else if (score >= 50) {
    analysis += "votre mode de vie présente quelques risques modérés. ";
  } else {
    analysis += "votre mode de vie nécessite des améliorations importantes. ";
  }
  
  // Add specific insights
  if (data.sedentary_hours > 8) {
    analysis += `Vos ${data.sedentary_hours}h d'assise quotidienne augmentent significativement vos risques cardiovasculaires. `;
  }
  
  if (data.activity_hours < 2) {
    analysis += "Votre faible niveau d'activité physique impacte négativement votre santé métabolique. ";
  }
  
  if (data.sleep_hours < 7) {
    analysis += "Votre manque de sommeil affecte votre récupération et vos performances cognitives. ";
  }
  
  return analysis;
};