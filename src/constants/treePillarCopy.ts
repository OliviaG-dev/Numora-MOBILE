export const TREE_PILLAR_COPY = {
  mercy: {
    name: "Pilier de la Miséricorde",
    description:
      "Le pilier de gauche représente l'énergie d'expansion, de générosité et de créativité. C'est la force masculine active qui donne, crée et se déploie dans le monde.",
    guidance:
      "Ton pilier de la miséricorde te pousse à donner et à créer. Équilibre cette force avec la sagesse pour éviter l'excès."
  },
  severity: {
    name: "Pilier de la Rigueur",
    description:
      "Le pilier de droite représente l'énergie de contraction, de discipline et de structure. C'est la force féminine réceptive qui filtre, organise et donne forme.",
    guidance:
      "Ton pilier de la rigueur te donne structure et discernement. Équilibre cette force avec la compassion pour éviter la rigidité."
  },
  equilibrium: {
    name: "Pilier de l'Équilibre",
    description:
      "Le pilier central représente l'harmonie entre expansion et contraction. C'est le chemin de l'équilibre où les opposés se rencontrent et se complètent.",
    guidance:
      "Ton pilier central est le chemin de l'harmonie. C'est en équilibrant tes forces que tu atteins ta pleine réalisation."
  }
} as const;

export type DominantPillarKey = keyof typeof TREE_PILLAR_COPY;
