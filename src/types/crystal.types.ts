export type CrystalPierreBloc = {
  nom: string;
  proprietes?: string;
  energie?: string;
  objectif?: string;
};

export type CrystalPathEntry = {
  chemin: string;
  description: string;
  pierres: {
    amour: CrystalPierreBloc;
    carriere: CrystalPierreBloc;
    spiritualite: CrystalPierreBloc;
  };
};

export type CrystalExpressionEntry = {
  nombre_expression: string;
  description: string;
  pierre: CrystalPierreBloc;
};

export type CrystalSyntheseProfil = {
  chemin_de_vie: number;
  nombre_expression: number;
  synthese: {
    energie_dominante: string;
    objectif_global: string;
    pierre_prioritaire: CrystalPierreBloc;
    message_cle: string;
  };
};

export type CrystalSyntheseWrapper = {
  profil_synthese: CrystalSyntheseProfil;
};
