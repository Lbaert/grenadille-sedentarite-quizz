import recommandationsData from '@/data/recommandations_ecrans_enfants_2025.json';
import { getDetailedRecommendations } from '@/utils/csvRecommendationsParser';

export interface SimulationData {
  childAge: number;
  screenTimeHours: number;
  mainDevices: string[];
}

export interface ImpactResult {
  totalScore: number;
  sleepImpact: {
    score: number;
    hoursLostPerNight: number;
    yearlyHoursLost: number;
    totalHoursUntil18: number;
  };
  attentionImpact: {
    score: number;
    concentrationDecrease: number;
  };
  academicImpact: {
    score: number;
    gradeImpact: string;
  };
  familyImpact: {
    score: number;
    lostFamilyTimePerDay: number;
    yearlyFamilyTimeLost: number;
  };
  socialImpact: {
    score: number;
    description: string;
  };
  physicalHealthImpact: {
    score: number;
    description: string;
  };
  shockPhrase: string;
  comparisonData: {
    childScore: number;
    averageScore: number;
    betterThanPercent: number;
    chartData: Array<{
      age: number;
      moyenne: number;
      enfant: number;
    }>;
  };
  recommendations: string[];
  detailedRecommendations: {
    ageGroup: string;
    deviceRecommendations: Array<{ device: string; recommendation: string }>;
    generalRecommendations: string;
    alternatives: string;
  };
}

// Données de référence basées sur les moyennes par âge (en heures) - Sourcées par plus de 100 études
const averageScreenTimeByAge: Record<number, number> = {
  1: 50/60, 2: 65/60, 3: 79/60, 4: 94/60, 5: 109/60, 6: 123/60, 7: 138/60, 8: 153/60,
  9: 167/60, 10: 182/60, 11: 197/60, 12: 211/60, 13: 226/60, 14: 241/60, 15: 255/60,
  16: 270/60, 17: 285/60, 18: 300/60
};

export const calculateImpact = (data: SimulationData): ImpactResult => {
  const { childAge, screenTimeHours, mainDevices } = data;
  
  // Calculs de base
  const yearsUntil18 = 18 - childAge;
  const averageForAge = averageScreenTimeByAge[childAge] || averageScreenTimeByAge[Math.min(Math.max(childAge, 1), 18)];
  const deviationFromAverage = screenTimeHours - averageForAge;
  
  // Nouveau système de scoring avec 60/100 = moyenne, 100/100 = moitié de la moyenne, 0/100 = double de la moyenne
  const calculateScore = (screenTime: number, average: number): number => {
    if (screenTime <= average * 0.5) {
      return 100; // Score parfait si moitié de la moyenne ou moins
    } else if (screenTime >= average * 2) {
      return 0; // Score zéro si double de la moyenne ou plus
    } else if (screenTime <= average) {
      // Interpolation linéaire entre 0.5x moyenne (100 points) et 1x moyenne (60 points)
      const ratio = (screenTime - average * 0.5) / (average * 0.5);
      return Math.round(100 - (ratio * 40)); // De 100 à 60
    } else {
      // Interpolation linéaire entre 1x moyenne (60 points) et 2x moyenne (0 points)
      const ratio = (screenTime - average) / average;
      return Math.round(60 - (ratio * 60)); // De 60 à 0
    }
  };

  const totalScore = calculateScore(screenTimeHours, averageForAge);
  
  // Impact sur le sommeil
  const sleepImpactFactor = Math.min(screenTimeHours / 8, 1);
  const hoursLostPerNight = screenTimeHours > 2 ? (screenTimeHours - 2) * 0.3 : 0;
  const yearlyHoursLost = hoursLostPerNight * 365;
  const totalHoursUntil18 = yearlyHoursLost * yearsUntil18;
  const sleepScore = calculateScore(screenTimeHours, averageForAge);
  
  // Impact sur l'attention
  const attentionDecrease = Math.min((screenTimeHours / averageForAge) * 25, 70);
  const attentionScore = calculateScore(screenTimeHours, averageForAge);
  
  // Impact académique
  const academicScore = calculateScore(screenTimeHours, averageForAge);
  const gradeImpact = getGradeImpact(academicScore);
  
  // Impact familial
  const lostFamilyTimePerDay = screenTimeHours * 0.7;
  const yearlyFamilyTimeLost = lostFamilyTimePerDay * 365;
  const familyScore = calculateScore(screenTimeHours, averageForAge);
  
  // Impact social
  const socialScore = calculateScore(screenTimeHours, averageForAge);
  const socialDescription = getSocialImpactDescription(socialScore);
  
  // Impact sur la santé physique
  const physicalHealthScore = calculateScore(screenTimeHours, averageForAge);
  const physicalHealthDescription = getPhysicalHealthImpactDescription(physicalHealthScore);
  
  // Phrase choc
  const shockPhrase = generateShockPhrase(data, totalHoursUntil18, yearlyFamilyTimeLost);
  
  // Données de comparaison avec graphique
  const chartData = generateChartData(childAge, screenTimeHours);
  const betterThanPercent = screenTimeHours <= averageForAge ? 60 : Math.round(Math.max(10, 100 - (screenTimeHours / averageForAge - 1) * 30));
  
  // Recommandations personnalisées
  const recommendations = generatePersonalizedRecommendations(childAge, screenTimeHours, mainDevices, totalScore);
  const detailedRecommendations = getDetailedRecommendations(childAge, screenTimeHours, mainDevices);
  
  return {
    totalScore,
    sleepImpact: {
      score: sleepScore,
      hoursLostPerNight,
      yearlyHoursLost,
      totalHoursUntil18
    },
    attentionImpact: {
      score: attentionScore,
      concentrationDecrease: attentionDecrease
    },
    academicImpact: {
      score: academicScore,
      gradeImpact
    },
    familyImpact: {
      score: familyScore,
      lostFamilyTimePerDay,
      yearlyFamilyTimeLost
    },
    socialImpact: {
      score: socialScore,
      description: socialDescription
    },
    physicalHealthImpact: {
      score: physicalHealthScore,
      description: physicalHealthDescription
    },
    shockPhrase,
    comparisonData: {
      childScore: totalScore,
      averageScore: Math.round(averageForAge * 20), // Score basé sur la moyenne
      betterThanPercent,
      chartData
    },
    recommendations,
    detailedRecommendations
  };
};

const getRecommendedScreenTime = (age: number): number => {
  if (age < 2) return 0;
  if (age < 6) return 1;
  if (age < 12) return 1.5;
  return 2;
};

const getGradeImpact = (score: number): string => {
  if (score >= 80) return "Impact minimal sur les résultats";
  if (score >= 60) return "Baisse légère des résultats scolaires";
  if (score >= 40) return "Impact modéré sur les performances";
  return "Impact significatif sur la réussite scolaire";
};

const getSocialImpactDescription = (score: number): string => {
  if (score >= 80) return "Relations sociales préservées";
  if (score >= 60) return "Légère diminution des interactions sociales";
  if (score >= 40) return "Impact modéré sur les relations";
  return "Isolement social préoccupant";
};

const getPhysicalHealthImpactDescription = (score: number): string => {
  if (score >= 80) return "Santé physique préservée";
  if (score >= 60) return "Légers effets sur la condition physique";
  if (score >= 40) return "Impact modéré sur la santé";
  return "Risques importants pour la santé";
};

const generateShockPhrase = (data: SimulationData, totalHoursLost: number, yearlyFamilyTimeLost: number): string => {
  const phrases = [
    `Votre enfant perdra ${Math.round(totalHoursLost / 8760)} années de sommeil à cause des écrans avant sa majorité.`,
    `${Math.round(yearlyFamilyTimeLost)} heures de liens familiaux perdues chaque année.`,
    `En ${18 - data.childAge} ans, votre enfant passera ${Math.round(data.screenTimeHours * 365 * (18 - data.childAge) / 24)} jours complets devant un écran.`,
    `Votre enfant perd l'équivalent de ${Math.round(yearlyFamilyTimeLost / 24)} jours de temps familial par an.`
  ];
  
  return phrases[Math.floor(Math.random() * phrases.length)];
};

const generateChartData = (childAge: number, screenTimeHours: number) => {
  const data = [];
  
  // Générer les données à partir de l'âge actuel jusqu'à 18 ans
  for (let age = childAge; age <= 18; age++) {
    const avgTime = averageScreenTimeByAge[age] || averageScreenTimeByAge[Math.min(Math.max(age, 1), 18)];
    
    // Pour l'âge actuel, utiliser la valeur utilisateur
    const childTime = age === childAge ? screenTimeHours : 
      // Projection future basée sur la progression actuelle par rapport à la moyenne
      screenTimeHours + (avgTime - averageScreenTimeByAge[childAge]);
    
    data.push({
      age,
      moyenne: avgTime,
      enfant: Math.max(0, childTime)
    });
  }
  
  return data;
};

const generatePersonalizedRecommendations = (age: number, screenTime: number, devices: string[], score: number): string[] => {
  const recommendations: string[] = [];
  
  // Mapper l'âge aux groupes d'âge du JSON
  const getAgeGroup = (age: number): string => {
    if (age <= 3) return "0-3_ans";
    if (age <= 6) return "3-6_ans"; 
    if (age <= 11) return "6-11_ans";
    return "12-17_ans";
  };
  
  // Mapper les appareils du formulaire aux clés du JSON
  const mapDeviceToKey = (device: string): string => {
    switch (device) {
      case "smartphone":
      case "tablet":
        return "smartphone_tablette";
      case "tv":
        return "television";
      case "gaming":
        return "jeux_video";
      default:
        return "smartphone_tablette";
    }
  };
  
  const ageGroup = getAgeGroup(age);
  const ageGroupData = recommandationsData.age_groups[ageGroup as keyof typeof recommandationsData.age_groups];
  
  // Ajouter les règles fondamentales pour cet âge (maximum 2)
  if (ageGroupData?.regles_fundamentales) {
    recommendations.push(...ageGroupData.regles_fundamentales.slice(0, 2));
  }
  
  // Ajouter des alternatives spécifiques aux appareils utilisés
  if (ageGroupData?.alternatives_par_appareil) {
    const usedDeviceKeys = devices.map(mapDeviceToKey);
    const uniqueDeviceKeys = Array.from(new Set(usedDeviceKeys));
    
    uniqueDeviceKeys.forEach(deviceKey => {
      const alternatives = ageGroupData.alternatives_par_appareil[deviceKey as keyof typeof ageGroupData.alternatives_par_appareil];
      if (alternatives && alternatives.length > 0) {
        // Prendre une alternative aléatoire pour chaque type d'appareil
        const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
        recommendations.push(randomAlternative);
      }
    });
  }
  
  // Ajouter une recommandation universelle selon le score d'impact
  const avgForAge = averageScreenTimeByAge[age] || 2;
  if (screenTime > avgForAge * 1.5) {
    recommendations.push("Réduisez immédiatement le temps d'écran de 50% - consultez un professionnel si nécessaire");
  } else if (screenTime > avgForAge) {
    recommendations.push("Diminuez progressivement de 30 minutes par jour le temps d'écran total");
  } else {
    // Ajouter la règle des 3 équilibres pour les scores plus élevés
    recommendations.push("Appliquez la règle des 3 équilibres : 1h d'écran = 1h de sport + 1h de créativité + 1h de social");
  }
  
  // Retourner 4 recommandations uniques
  const uniqueRecommendations = Array.from(new Set(recommendations));
  return uniqueRecommendations.slice(0, 4);
};