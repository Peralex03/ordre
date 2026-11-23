/* Ordre : le canevas de la méthode, reformulé d'après deux règlements de l'Armée suisse :
   - 50.040 f « Conduite et organisation des états-majors 17 » : les 5 (+2) activités de conduite (ch. 4.2),
     la méthode Énoncé, Déduction, Conséquence, la règle des quarts, la structure des ordres ;
   - 51.019 f « Instruction de base 17 », ch. 6 : les questions guides et les règles d'or de l'échelon groupe.
   Chaque bloc porte sa référence. Les textes sont des reformulations courtes, pas des citations. */
'use strict';
const METHOD = {
  source: 'Règlements 50.040 f (ch. 4.2 et structure des ordres) et 51.019 f (ch. 6)',
  note: 'Cinq activités successives (problème, appréciation, décision, plans, donnée d’ordres) et deux permanentes (mesures d’urgence, planification horaire). Le suivi de la situation vient du règlement 51.019.',
  steps: [
    { k: 'pb', n: 1, t: 'Appréhension du problème', short: 'Problème', ref: '50.040 ch. 4.2.1 ; 51.019 ch. 6, activité n° 1',
      lead: 'Trois étapes : détecter le problème, l’éclairer, l’apprécier.',
      guide: ['Détection : de quoi s’agit-il ? Quelles tâches, quel objectif, quel état final ? Quelles opportunités, quels risques ? Quels délais ?', 'Éclairage : quelles informations manquent ? En quels problèmes partiels la tâche se découpe-t-elle ?', 'Appréciation : pour chaque problème partiel, quelle importance, quelle urgence, et qui s’en charge ?', 'Quelles activités sont déjà en cours ?'],
      rules: { t: 'Quatre règles d’or', l: ['Ne rien entreprendre qui gêne la décision à venir.', 'Chercher d’abord la vue d’ensemble.', 'Réunir le minimum d’informations : moyens et possibilités de l’adversaire, propres moyens du moment, forces et faiblesses du terrain.', 'Ne pas se fixer sur le fait nouveau : tenir compte de ce qui est déjà en cours.'] } },
    { k: 'urg', n: '+', t: 'Mesures d’urgence et plan horaire', short: 'Urgence, temps', ref: '50.040 ch. 4.2.2 et 4.2.3 ; 51.019 ch. 6',
      lead: 'Deux tâches permanentes, dès l’appréhension du problème.',
      guide: ['Quelles informations manquantes faut-il aller chercher tout de suite ?', 'Que faut-il faire maintenant pour garder ou retrouver la liberté d’action ?', 'Comment employer au mieux le temps disponible ?'],
      rules: { t: 'À retenir', l: ['Une mesure d’urgence ne préjuge pas de la décision et ne limite pas la liberté de décision.', 'Le plan horaire s’établit en général à rebours, à partir de l’effet recherché, réserve de temps comprise.', 'Règle des quarts (niveau tactique) : un quart du temps encore disponible par niveau pour planifier ; le reste revient aux subordonnés.', 'Le plan horaire se fonde sur l’état réel du personnel et du matériel et sur une estimation réaliste de ce qu’on ne maîtrise pas ; il se tient à jour en permanence.'] } },
    { k: 'app', n: 2, t: 'Appréciation de la situation', short: 'Appréciation', ref: '50.040 ch. 4.2.4 (facteurs MMAPD, méthode Énoncé, Déduction, Conséquence) ; 51.019 ch. 6',
      lead: 'Cinq facteurs. Pour chacun : des énoncés (faits, données, chiffres), mis en relation pour en tirer des déductions, puis des conséquences concrètes pour l’action.',
      factors: [
        { k: 'mi', t: 'Mission', q: ['Quelle est l’importance de ma tâche dans le cadre général ?', 'Quelle prestation est attendue, explicitement et implicitement ? Au minimum, au maximum ?', 'Quelle est ma marge de manœuvre (servitudes, restrictions, règles d’engagement) ?', 'Quel appui peut m’être utile, et de qui ?'] },
        { k: 'te', t: 'Milieu', q: ['Où se trouvent les couverts et les possibilités de camouflage ?', 'Où sont les positions et les secteurs de feu et d’observation ?', 'Où sont les hauteurs importantes, les routes et les chemins ?'] },
        { k: 'ad', t: 'Moyens adverses', q: ['Où se trouve l’adversaire ?', 'Quels sont ses effectifs ?', 'Quelles sont ses armes, quels sont ses véhicules ?', 'Quelle est son intention ?'] },
        { k: 'pr', t: 'Propres moyens', q: ['Y a-t-il des blessés ou des morts ?', 'Y a-t-il des véhicules, des armes ou des appareils hors service ?', 'Les munitions suffisent-elles ?', 'Que puis-je faire avec mes moyens actuels ?'] },
        { k: 'de', t: 'Délais', q: ['Que pouvons-nous, nous ou l’adversaire, entreprendre immédiatement ?', 'Qu’est-ce qui demande une longue préparation ?'] }] },
    { k: 'dec', n: 3, t: 'Décision', short: 'Décision', ref: '50.040 ch. 4.2.5 ; 51.019 ch. 6, activité n° 3',
      lead: 'Développer ses possibilités en variantes, les comparer, décider. La décision fixe comment la mission sera accomplie, dans l’espace et dans le temps.',
      guide: ['Quelles sont les deux meilleures solutions réalisables ?', 'Laquelle est la meilleure ?', 'Quels sont les désavantages de la solution retenue ?'],
      principles: ['Simplicité', 'Unité de l’action', 'Surprise', 'Sûreté'],
      rules: { t: 'Cinq règles d’or', l: ['Ne chercher des solutions qu’une fois la vue d’ensemble acquise.', 'Ne retenir que des solutions réalistes.', 'Une solution utilisable maintenant vaut mieux qu’une solution parfaite trop tard.', 'Toute solution a des désavantages : chercher ceux que l’adversaire pourrait exploiter.', 'La solution n’expose pas les subordonnés à des risques inutiles.'] } },
    { k: 'plan', n: 4, t: 'Développement du plan', short: 'Plan', ref: '50.040 ch. 4.2.6 ; 51.019 ch. 6, activité n° 4',
      lead: 'Régler la mise en œuvre : intention, déroulement, et planification prévisionnelle (toute décision a des faiblesses).',
      guide: ['Quel état final est recherché ? Comment l’action se déroule-t-elle dans l’espace et dans le temps ?', 'Mes subordonnés pourront-ils redire l’intention avec leurs mots ?', 'Planification prévisionnelle : quelles évolutions de la situation n’ont pas été prises en compte, et quelle décision réservée y répond ?'] },
    { k: 'ord', n: 5, t: 'Donnée d’ordres', short: 'Ordre', ref: '50.040 ch. 4.2.7 et structure des ordres ; 51.019 ch. 6, activité n° 5',
      lead: 'Ordre en cinq points, en termes simples, clairs et précis. Le chef donne les motifs de son intention.',
      rules: { t: 'Principes et genres d’ordres', l: ['Les missions laissent la plus grande liberté de manœuvre possible (conduite par objectifs) ; elles ne valent souvent que pour la première phase.', 'Ordre préalable : crée des conditions favorables à une action ultérieure. Ordre partiel : extrait, complément ou modification. Ordre particulier : pour un seul subordonné.', 'L’ordre fixe des objectifs atteignables et confie une responsabilité.', 'Il ne restreint la marge des subordonnés que si la cohésion de l’action l’exige.', 'L’intention est comprise quand les subordonnés savent la redire eux-mêmes.', 'Montrer l’intention sur le terrain, une maquette ou un croquis aide beaucoup.'] } },
    { k: 'suivi', n: 6, t: 'Suivi de la situation', short: 'Suivi', ref: '51.019 ch. 6, activité n° 6',
      lead: 'Comparer ce qui était voulu et ce qui se passe, garder une longueur d’avance.',
      guide: ['L’état réel correspond-il à l’état voulu ? Sinon, que corriger ?', 'Que se passerait-il si… ?', 'Quels enseignements du dernier engagement faut-il rappeler avant celui-ci ?'],
      rules: { t: 'Briefing et débriefing', l: ['Avant l’engagement : rappeler les enseignements du débriefing précédent.', 'Après l’engagement : échanger les expériences, tirer les enseignements ensemble, passer du cas particulier à la règle.', 'Relever ce qui a bien marché autant que ce qui n’a pas marché.'] } }
  ],
  /* l'ordre en cinq points, et ce que chaque point contient */
  order: [
    { k: 'o', n: 1, t: 'Orientation', sub: [['terrain', 'Situation et terrain', 'Situation, baptême du terrain (noms donnés aux points du terrain)'], ['adv', 'Adversaire', 'Force, emplacements, effectifs, armes, véhicules, potentiel de violence'], ['mission', 'Mission reçue', 'Intention de l’échelon supérieur et mission reçue, dite avec ses propres mots'], ['voisins', 'Moyens, voisins, partenaires', 'Forces à disposition ; rôle des voisins et des partenaires ; éviter les tirs fratricides']] },
    { k: 'i', n: 2, t: 'Intention' },
    { k: 'm', n: 3, t: 'Missions' },
    { k: 'd', n: 4, t: 'Dispositions particulières' },
    { k: 'e', n: 5, t: 'Emplacements', hint: 'D’où le chef conduit l’action (lieux, horaires), comment le joindre, où se trouve l’échelon supérieur' }
  ],
  /* missions : ce que chaque type de mission précise (51.019, ch. 6) */
  missionTypes: [
    ['long', 'Engagement de longue durée', 'Lieu d’engagement, activité, secteur d’observation, comportement'],
    ['obs', 'Observation', 'Emplacement, secteur d’observation, ce qui est à annoncer'],
    ['mvt', 'Mouvement ou attaque', 'But à atteindre, itinéraire, comportement à l’arrivée'],
    ['feu', 'Disponibilité ou appui de feu', 'Secteur des positions, secteur de feu, ouverture du feu']],
  dispo: [
    ['roe', 'Règles d’engagement et de comportement'], ['rempl', 'Remplacements'], ['radio', 'Liaisons radio'], ['panne', 'Conduite en cas de panne de véhicule'],
    ['ident', 'Signes d’identification, codes, accès'], ['san', 'Service sanitaire, acheminement des blessés'], ['paq', 'Ordre de paquetage'],
    ['mun', 'Munitions, armes collectives, matériel spécial'], ['horaire', 'Plan horaire détaillé, degré de disponibilité'], ['rass', 'Points de rassemblement'], ['subs', 'Subsistance'], ['autre', 'Autres points']]
};
