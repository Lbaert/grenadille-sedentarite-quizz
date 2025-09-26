// Utilitaire pour parser et utiliser les recommandations CSV
interface RecommendationRow {
  age: string;
  tablette_smartphone: string;
  television: string;
  jeux_video: string;
  internet: string;
  recommandations: string;
  activites_alternatives: string;
}

// Données CSV converties en format JavaScript
const csvRecommendations: RecommendationRow[] = [
  {
    age: "1-3 ans",
    tablette_smartphone: "Aucun écran n'est recommandé à cet âge, sauf pour des appels vidéo exceptionnels avec la famille (maximum 15 minutes). Le cerveau est en plein développement et a besoin d'interactions réelles.",
    television: "La télévision est totalement déconseillée, même en bruit de fond. Elle perturbe les jeux spontanés et le développement du langage, même quand l'enfant ne la regarde pas directement.",
    jeux_video: "Les jeux vidéo sont totalement déconseillés à cet âge. L'enfant a besoin de découvrir le monde réel à travers ses cinq sens et la manipulation d'objets.",
    internet: "Aucun accès à internet n'est recommandé. L'enfant doit développer ses capacités d'attention et de concentration sans stimulations numériques.",
    recommandations: "Privilégiez les interactions face-à-face, les jeux sensoriels et les activités motrices. Respectez les rythmes naturels de sommeil et d'éveil. Évitez la \"technoférence\" parentale en rangeant vos propres écrans.",
    activites_alternatives: "Proposez des jeux sensoriels avec différentes textures, des comptines et chansons, des lectures d'imagiers colorés, des jeux de cache-cache, de l'exploration en plein air, des jeux d'encastrement et des activités de motricité libre sur tapis d'éveil."
  },
  {
    age: "3-6 ans",
    tablette_smartphone: "Maximum 30 minutes par jour, toujours en présence d'un adulte qui commente et explique. Commencez par 15 minutes à 3-4 ans et progressez vers 30 minutes à 5-6 ans.",
    television: "Maximum 1 heure par jour avec des contenus éducatifs adaptés à l'âge. Un parent doit être présent pour commenter et expliquer ce qui est vu à l'écran.",
    jeux_video: "Pas de console personnelle avant 6 ans. Seuls les jeux familiaux occasionnels sont acceptables, toujours avec supervision et participation d'un adulte.",
    internet: "Aucun accès libre à internet n'est recommandé. L'enfant n'a pas encore développé les capacités de discernement nécessaires pour naviguer en sécurité.",
    recommandations: "Respectez la règle des 4 PAS : pas d'écran le matin, pas pendant les repas, pas avant le coucher, pas dans la chambre. Privilégiez toujours l'accompagnement parental et jamais d'écran en solitaire.",
    activites_alternatives: "Organisez des spectacles de marionnettes maison, initiez à l'origami simple, proposez des jeux de société adaptés comme Uno Junior, encouragez les constructions avec Lego ou Kapla, faites du jardinage ensemble, cuisinez des recettes simples et organisez des chasses au trésor dans le jardin."
  },
  {
    age: "6-9 ans",
    tablette_smartphone: "Maximum 60 minutes par jour sur tablette familiale avec supervision. Pas de smartphone personnel avant 9-10 ans. Privilégiez les applications éducatives et créatives.",
    television: "Maximum 90 minutes par jour avec des programmes éducatifs ou familiaux. Privilégiez les contenus sous-titrés pour enrichir le vocabulaire et évitez les programmes pour adultes.",
    jeux_video: "Maximum 45 minutes par jour avec des jeux adaptés PEGI 3-7. Une console familiale est possible dès 6 ans, en privilégiant les jeux coopératifs et familiaux.",
    internet: "Maximum 30 minutes par jour sur sites éducatifs uniquement, toujours sous supervision parentale. Initiation possible vers 9 ans avec contrôle parental strict.",
    recommandations: "Établissez un planning clair : devoirs d'abord, puis activités, puis éventuellement écrans. L'enfant peut commencer à gérer son quota de temps d'écran mais avec des règles fermes et un contrôle parental sur tous les appareils.",
    activites_alternatives: "Proposez des cahiers d'activités et mots fléchés adaptés, des kits créatifs pour bracelets brésiliens, encouragez les sports collectifs comme le football ou basket, initiez aux jeux de société plus complexes, inscrivez à des activités comme arts martiaux ou danse, et organisez des projets scientifiques simples comme des volcans."
  },
  {
    age: "9-13 ans",
    tablette_smartphone: "Maximum 90 minutes par jour. Un premier smartphone est possible vers 11-12 ans (entrée en 6ème) mais avec contrôle parental et règles claires sur les horaires d'utilisation.",
    television: "Maximum 2 heures par jour avec des programmes variés mais évitez le multi-écrans simultané. L'enfant peut commencer à choisir ses programmes mais gardez un œil sur les contenus.",
    jeux_video: "Maximum 60 minutes par jour avec attention particulière aux jeux en ligne et aux interactions avec des inconnus. Respectez la classification PEGI et privilégiez les moments de jeu en famille.",
    internet: "Maximum 60 minutes par jour avec navigation supervisée vers des sites éducatifs et sûrs. Commencez l'éducation aux risques numériques et au cyberharcèlement.",
    recommandations: "C'est la période de transition vers l'autonomie. Imposez des pauses toutes les 45 minutes, négociez les règles en famille, discutez ouvertement des contenus vus, et maintenez un contrôle parental progressivement assoupli selon la maturité.",
    activites_alternatives: "Encouragez les sports d'équipe avec tournois entre amis, créez des clubs de lecture, initiez à la photographie créative, proposez du bénévolat associatif local, maintenez la correspondance écrite, organisez des sorties aux spectacles vivants, et proposez des kits scientifiques plus avancés."
  },
  {
    age: "13-18 ans",
    tablette_smartphone: "Maximum 3 heures par jour recommandées, mais l'accent est mis sur la qualité d'usage plutôt que la quantité. Le contrôle parental s'assouplit progressivement selon la maturité démontrée.",
    television: "Maximum 2 heures par jour avec usage libre mais raisonné. Encouragez la discussion critique sur les contenus et évitez la consommation passive prolongée.",
    jeux_video: "Maximum 90 minutes par jour en semaine avec jeux selon classification PEGI. Attention particulière aux jeux en ligne, aux achats intégrés, et à la gestion du temps de jeu.",
    internet: "Maximum 2h30 par jour avec accès aux réseaux sociaux dès 13 ans (âge légal) et majorité numérique à 15 ans en France. Éducation continue aux risques numériques et à la vie privée.",
    recommandations: "Passez de l'encadrement strict à l'éducation numérique. Imposez le téléphone hors de la chambre la nuit, préservez au moins une soirée par semaine sans écrans en famille, encouragez les pauses toutes les heures, et maintenez un dialogue ouvert sur les interactions en ligne.",
    activites_alternatives: "Lancez des défis sportifs entre amis avec challenges fitness, encouragez les projets artistiques collaboratifs comme le film-making, proposez du bénévolat dans des associations locales, soutenez l'apprentissage d'instruments en groupe, organisez des soirées débat en famille sur l'actualité, et explorez des sports à sensations comme l'escalade supervisée."
  }
];

export const getDetailedRecommendations = (age: number, screenTime: number, devices: string[]) => {
  // Déterminer le groupe d'âge approprié
  const getAgeGroup = (age: number): RecommendationRow => {
    if (age <= 3) return csvRecommendations[0]; // 1-3 ans
    if (age <= 6) return csvRecommendations[1]; // 3-6 ans
    if (age <= 9) return csvRecommendations[2]; // 6-9 ans
    if (age <= 13) return csvRecommendations[3]; // 9-13 ans
    return csvRecommendations[4]; // 13-18 ans
  };

  const ageGroup = getAgeGroup(age);

  // Mapper les appareils du formulaire aux recommandations spécifiques
  const getDeviceRecommendations = (devices: string[]) => {
    const deviceRecommendations: { device: string; recommendation: string }[] = [];
    
    devices.forEach(device => {
      switch (device) {
        case "smartphone":
        case "tablet":
          deviceRecommendations.push({
            device: "Tablette/Smartphone",
            recommendation: ageGroup.tablette_smartphone
          });
          break;
        case "tv":
          deviceRecommendations.push({
            device: "Télévision", 
            recommendation: ageGroup.television
          });
          break;
        case "gaming":
          deviceRecommendations.push({
            device: "Jeux vidéo",
            recommendation: ageGroup.jeux_video
          });
          break;
        default:
          deviceRecommendations.push({
            device: "Internet",
            recommendation: ageGroup.internet
          });
      }
    });

    // Éviter les doublons
    return deviceRecommendations.filter((rec, index, self) => 
      index === self.findIndex(r => r.device === rec.device)
    );
  };

  return {
    ageGroup: ageGroup.age,
    deviceRecommendations: getDeviceRecommendations(devices),
    generalRecommendations: ageGroup.recommandations,
    alternatives: ageGroup.activites_alternatives
  };
};