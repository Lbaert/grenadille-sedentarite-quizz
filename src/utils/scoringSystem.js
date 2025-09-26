
// Fonction d'interpolation linéaire
const interp = (val18, val80, age) => {
  const t = (age - 18) / (80 - 18);
  return +(val18 * (1 - t) + val80 * t).toFixed(1);
};

// -------------------------
// QUESTIONS & RÈGLES
// -------------------------

function scoreActiviteHeures(age) {
  return {
    "0": 0.0,
    "1": interp(1.0, 3.5, age),
    "2-3": interp(2.5, 5.0, age),
    "4-6": interp(4.5, 4.2, age),
    "7-10": interp(5.0, 2.8, age),
    ">10": interp(3.2, 1.5, age)
  };
}

function scoreActiviteJours(age) {
  return {
    "0": 0.0,
    "1-2": interp(1.0, 5.0, age),
    "3-4": interp(3.5, 5.0, age),
    "5-6": interp(5.0, 3.0, age),
    "7": interp(5.0, 2.0, age)
  };
}

function scoreActiviteIntensite(age) {
  return {
    "0": 0.0,
    "1-2": interp(1.0, 2.0, age),
    "3-5": interp(3.0, 5.0, age),
    "6-8": interp(5.0, 3.0, age),
    "9-10": interp(5.0, 2.0, age)
  };
}

function scoreSedentariteAssis(age) {
  return {
    "≥12h": 0.0,
    "9-11h": interp(1.0, 3.0, age),
    "6-8h": interp(4.0, 5.0, age),
    "≤5h": 5.0
  };
}

function scoreSedentariteEcran(age) {
  return {
    "≥6h": interp(0.0, 2.0, age),
    "4-5h": interp(2.0, 4.0, age),
    "2-3h": 5.0,
    "≤1h": 5.0
  };
}

function scoreSommeilHeures(age) {
  return {
    "≤5h": 0.0,
    "6h": interp(2.0, 4.0, age),
    "7-8h": 5.0,
    "9h": interp(3.0, 5.0, age),
    "≥10h": interp(1.0, 4.0, age)
  };
}

function scoreSommeilQualite() {
  return {
    "0-2": 0.0,
    "3-4": 1.0,
    "5-6": 3.0,
    "7-8": 4.0,
    "9-10": 5.0
  };
}

function scoreBienetreEnergie() {
  return {
    "0-2": 0.0,
    "3-4": 1.0,
    "5-6": 3.0,
    "7-8": 4.0,
    "9-10": 5.0
  };
}

function scoreBienetreStress() {
  return {
    "0-2": 5.0,
    "3-4": 4.0,
    "5-6": 3.0,
    "7-8": 1.0,
    "9-10": 0.0
  };
}

function scoreSocialActivites(age) {
  return {
    "0": 0.0,
    "1": interp(1.0, 2.0, age),
    "2-3": interp(3.0, 4.0, age),
    "4-6": 5.0,
    "≥7": 5.0
  };
}

function scoreExterieurHeures(age) {
  return {
    "0-1h": 0.0,
    "2-3h": interp(2.0, 4.0, age),
    "4-5h": interp(3.0, 5.0, age),
    "6-10h": 5.0,
    "≥11h": interp(5.0, 4.0, age)
  };
}

// -------------------------
// FONCTION PRINCIPALE
// -------------------------

export function getScoringRules(age) {
  return {
    activite_physique_heures: scoreActiviteHeures(age),
    activite_physique_jours: scoreActiviteJours(age),
    activite_physique_intensite: scoreActiviteIntensite(age),
    sedentarite_heures_assis: scoreSedentariteAssis(age),
    sedentarite_heures_ecran: scoreSedentariteEcran(age),
    sommeil_heures: scoreSommeilHeures(age),
    sommeil_qualite: scoreSommeilQualite(),
    bienetre_energie: scoreBienetreEnergie(),
    bienetre_stress: scoreBienetreStress(),
    social_activites: scoreSocialActivites(age),
    exterieur_heures: scoreExterieurHeures(age)
  };
}

// -------------------------
// CALCUL GLOBAL (/100)
// -------------------------

export function calculateScore(age, answers) {
  console.log("✅ calculateScore called with:", age, answers);
  const rules = getScoringRules(age);
  let total = 0;
  let maxScore = 0;

  for (const [question, value] of Object.entries(answers)) {
    const questionRules = rules[question];
    if (!questionRules) {
      console.warn(`⚠️ Pas de règles pour ${question}`);
      continue;
    }

    const score = questionRules[value];
    if (score === undefined) {
      console.warn(`⚠️ Réponse non reconnue: ${question} -> ${value}`);
      continue;
    }

    total += score;
    maxScore += 5;

    // 👉 Debug détaillé
    console.log(`🔎 ${question}: valeur='${value}' → score=${score}/5`);
  }

  const finalScore = maxScore > 0 ? +(total / maxScore * 100).toFixed(1) : 0;
  console.log(`🧮 Résultat final: ${total}/${maxScore} → ${finalScore}/100`);

  return finalScore;
}


// -------------------------
// Exemple d'utilisation
// -------------------------
// const answers = {
//   activite_physique_heures: "4-6",
//   sommeil_heures: "7-8h",
//   bienetre_stress: "5-6"
// };
// console.log(calculateScore(30, answers)); // => renvoie un score /100
