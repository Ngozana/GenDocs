import localforage from 'localforage';

localforage.config({
  name: 'E_GENDOCs',
  storeName: 'missions_store'
});

export interface Agent {
  nom_prenoms: string;
  matricule: string;
  corps_grade: string;
  observation: string;
}

export interface Mission {
  id?: number;
  ministere: string;
  direction_regionale: string;
  cantonnement: string;
  ville: string;
  date_creation: string;
  numero: string;
  lieu_mission: string;
  objet_mission: string;
  nombre_personnes: number;
  moyen_transport: string;
  date_depart: string;
  date_retour: string;
  agents: Agent[];
}

export interface AutorisationAbsence {
  id?: number;
  ministere: string;
  direction_regionale: string;
  cantonnement: string;
  ville: string;
  date_creation: string;
  numero: string;
  nombre_jours: number;
  date_debut: string;
  date_fin: string;
  beneficiaire_nom: string;
  beneficiaire_matricule: string;
  destination: string;
  motif: string;
  date_reprise: string;
  signataire_nom: string;
  signataire_titre: string;
}

export interface ProcesVerbalSaisie {
  id?: number;
  ministere: string;
  direction_regionale: string;
  cantonnement: string;
  ville: string;
  date_creation: string;
  numero: string;
  annee: string;
  jour: string;
  mois: string;
  agents: string[];
  sieur: string;
  produits: string[];
  gardien: string;
  infractions: string[];
  remis_a: string;
  lieu_cloture: string;
}

export const dbService = {
  async getMissions(): Promise<Mission[]> {
    const missions = await localforage.getItem<Mission[]>('missions');
    return missions || [];
  },

  async getMission(id: number): Promise<Mission | undefined> {
    const missions = await this.getMissions();
    return missions.find(m => m.id === id);
  },

  async saveMission(mission: Mission): Promise<number> {
    const missions = await this.getMissions();
    const newId = missions.length > 0 ? Math.max(...missions.map(m => m.id || 0)) + 1 : 1;
    const newMission = { ...mission, id: newId };
    missions.push(newMission);
    await localforage.setItem('missions', missions);
    return newId;
  },

  async deleteMission(id: number): Promise<void> {
    const missions = await this.getMissions();
    const updatedMissions = missions.filter(m => m.id !== id);
    await localforage.setItem('missions', updatedMissions);
  },

  async getAutorisations(): Promise<AutorisationAbsence[]> {
    const autorisations = await localforage.getItem<AutorisationAbsence[]>('autorisations');
    return autorisations || [];
  },

  async getAutorisation(id: number): Promise<AutorisationAbsence | undefined> {
    const autorisations = await this.getAutorisations();
    return autorisations.find(a => a.id === id);
  },

  async saveAutorisation(autorisation: AutorisationAbsence): Promise<number> {
    const autorisations = await this.getAutorisations();
    const newId = autorisations.length > 0 ? Math.max(...autorisations.map(a => a.id || 0)) + 1 : 1;
    const newAutorisation = { ...autorisation, id: newId };
    autorisations.push(newAutorisation);
    await localforage.setItem('autorisations', autorisations);
    return newId;
  },

  async deleteAutorisation(id: number): Promise<void> {
    const autorisations = await this.getAutorisations();
    const updatedAutorisations = autorisations.filter(a => a.id !== id);
    await localforage.setItem('autorisations', updatedAutorisations);
  },

  async getProcesVerbaux(): Promise<ProcesVerbalSaisie[]> {
    const pvs = await localforage.getItem<ProcesVerbalSaisie[]>('proces_verbaux');
    return pvs || [];
  },

  async getProcesVerbal(id: number): Promise<ProcesVerbalSaisie | undefined> {
    const pvs = await this.getProcesVerbaux();
    return pvs.find(p => p.id === id);
  },

  async saveProcesVerbal(pv: ProcesVerbalSaisie): Promise<number> {
    const pvs = await this.getProcesVerbaux();
    const newId = pvs.length > 0 ? Math.max(...pvs.map(p => p.id || 0)) + 1 : 1;
    const newPv = { ...pv, id: newId };
    pvs.push(newPv);
    await localforage.setItem('proces_verbaux', pvs);
    return newId;
  },

  async deleteProcesVerbal(id: number): Promise<void> {
    const pvs = await this.getProcesVerbaux();
    const updatedPvs = pvs.filter(p => p.id !== id);
    await localforage.setItem('proces_verbaux', updatedPvs);
  }
};
