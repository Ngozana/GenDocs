import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, FileText } from 'lucide-react';
import { AGENTS_LIST } from '../data/agents';
import { dbService } from '../services/db';

export default function CreateMission() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ministere: 'MINISTERE DES EAUX ET FORETS',
    direction_regionale: '',
    cantonnement: '',
    ville: '',
    date_creation: new Date().toISOString().split('T')[0],
    numero: '',
    lieu_mission: '',
    objet_mission: '',
    nombre_personnes: 1,
    moyen_transport: '',
    date_depart: '',
    date_retour: '',
  });

  const [agents, setAgents] = useState([
    { nom_prenoms: '', matricule: '', corps_grade: '', observation: 'Chef de mission' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (index: number, field: string, value: string) => {
    const newAgents = [...agents];
    newAgents[index] = { ...newAgents[index], [field]: value };
    setAgents(newAgents);
  };

  const handleAgentSelect = (index: number, value: string) => {
    const newAgents = [...agents];
    newAgents[index].nom_prenoms = value;
    
    const foundAgent = AGENTS_LIST.find(a => a.nom_prenoms === value);
    if (foundAgent) {
      newAgents[index].matricule = foundAgent.matricule;
      newAgents[index].corps_grade = foundAgent.emploi;
    }
    
    setAgents(newAgents);
  };

  const addAgent = () => {
    setAgents([...agents, { nom_prenoms: '', matricule: '', corps_grade: '', observation: '' }]);
    setFormData((prev) => ({ ...prev, nombre_personnes: agents.length + 1 }));
  };

  const removeAgent = (index: number) => {
    const newAgents = agents.filter((_, i) => i !== index);
    setAgents(newAgents);
    setFormData((prev) => ({ ...prev, nombre_personnes: newAgents.length }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = await dbService.saveMission({ ...formData, agents });
      navigate(`/preview/${id}`);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de l\'ordre de mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-10 h-10 text-emerald-800" />
            Créer un Ordre de Mission
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations Administratives */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Informations Administratives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ministère</label>
              <input type="text" name="ministere" value={formData.ministere} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Direction Régionale</label>
              <input type="text" name="direction_regionale" value={formData.direction_regionale} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantonnement</label>
              <input type="text" name="cantonnement" value={formData.cantonnement} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville de signature</label>
              <input type="text" name="ville" value={formData.ville} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de création</label>
              <input type="date" name="date_creation" value={formData.date_creation} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de l'ordre</label>
              <input type="text" name="numero" value={formData.numero} onChange={handleInputChange} required placeholder="Ex: 001/MINEDD/DR/CEF" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
          </div>
        </div>

        {/* Informations sur la Mission */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Détails de la Mission
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Objet de la mission</label>
              <textarea name="objet_mission" value={formData.objet_mission} onChange={handleInputChange} required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de la mission</label>
              <input type="text" name="lieu_mission" value={formData.lieu_mission} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Moyen de transport</label>
              <input type="text" name="moyen_transport" value={formData.moyen_transport} onChange={handleInputChange} required placeholder="Ex: Véhicule de service" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de départ</label>
              <input type="date" name="date_depart" value={formData.date_depart} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de retour</label>
              <input type="date" name="date_retour" value={formData.date_retour} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" />
            </div>
          </div>
        </div>

        {/* Agents */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Agents désignés
            </h2>
            <button type="button" onClick={addAgent} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Ajouter un agent
            </button>
          </div>
          
          <div className="space-y-4">
            {agents.map((agent, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nom et Prénoms</label>
                    <input 
                      type="text" 
                      list={`agents-list-${index}`}
                      value={agent.nom_prenoms} 
                      onChange={(e) => handleAgentSelect(index, e.target.value)} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" 
                    />
                    <datalist id={`agents-list-${index}`}>
                      {AGENTS_LIST.map((a, i) => (
                        <option key={i} value={a.nom_prenoms} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Matricule</label>
                    <input type="text" value={agent.matricule} onChange={(e) => handleAgentChange(index, 'matricule', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Corps et Grade</label>
                    <input type="text" value={agent.corps_grade} onChange={(e) => handleAgentChange(index, 'corps_grade', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Observation</label>
                    <input type="text" value={agent.observation} onChange={(e) => handleAgentChange(index, 'observation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                  </div>
                </div>
                {agents.length > 1 && (
                  <button type="button" onClick={() => removeAgent(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-5 md:mt-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-sm transition-colors disabled:opacity-50">
            {loading ? 'Enregistrement...' : <><Save className="w-5 h-5" /> Générer l'Ordre de Mission</>}
          </button>
        </div>
      </form>
    </div>
  );
}
