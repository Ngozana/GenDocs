import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, FileText } from 'lucide-react';
import { AGENTS_LIST } from '../data/agents';
import { dbService } from '../services/db';

export default function CreateAutorisation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ministere: 'MINISTERE DES EAUX ET FORETS',
    direction_regionale: 'DIRECTION REGIONALE DU N\'ZI',
    cantonnement: 'CANTONNEMENT DES EAUX ET FORETS DE DIMBOKRO',
    ville: 'Dimbokro',
    date_creation: new Date().toISOString().split('T')[0],
    numero: '',
    nombre_jours: 1,
    date_debut: '',
    date_fin: '',
    beneficiaire_nom: '',
    beneficiaire_matricule: '',
    destination: '',
    motif: '',
    date_reprise: '',
    signataire_nom: 'Cne SORO Ramata',
    signataire_titre: 'Ingénieur des Techniques des Eaux et Forêts',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, beneficiaire_nom: value }));
    
    const foundAgent = AGENTS_LIST.find(a => a.nom_prenoms === value);
    if (foundAgent) {
      setFormData((prev) => ({ 
        ...prev, 
        beneficiaire_matricule: foundAgent.matricule
      }));
    }
  };

  const calculateDays = () => {
    if (formData.date_debut && formData.date_fin) {
      const start = new Date(formData.date_debut);
      const end = new Date(formData.date_fin);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      setFormData(prev => ({ ...prev, nombre_jours: diffDays }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = await dbService.saveAutorisation(formData);
      navigate(`/preview-autorisation/${id}`);
    } catch (error) {
      console.error('Error saving autorisation:', error);
      alert('Une erreur est survenue lors de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-800" />
            Nouvelle Autorisation d'Absence
          </h1>
          <p className="text-gray-500 mt-1">Remplissez les informations pour générer le document.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* En-tête Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">En-tête du document</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ministère</label>
              <input
                type="text"
                name="ministere"
                value={formData.ministere}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Direction Régionale</label>
              <input
                type="text"
                name="direction_regionale"
                value={formData.direction_regionale}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantonnement</label>
              <input
                type="text"
                name="cantonnement"
                value={formData.cantonnement}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville d'émission</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'émission</label>
              <input
                type="date"
                name="date_creation"
                value={formData.date_creation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro (ex: 123)</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Détails de l'absence */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Détails de l'absence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bénéficiaire (Nom et Prénoms)</label>
              <input
                type="text"
                name="beneficiaire_nom"
                value={formData.beneficiaire_nom}
                onChange={(e) => handleAgentSelect(e.target.value)}
                list="agents-list"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
              <datalist id="agents-list">
                {AGENTS_LIST.map((agent, idx) => (
                  <option key={idx} value={agent.nom_prenoms} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
              <input
                type="text"
                name="beneficiaire_matricule"
                value={formData.beneficiaire_matricule}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
              <input
                type="text"
                name="motif"
                value={formData.motif}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={(e) => {
                  handleInputChange(e);
                  setTimeout(calculateDays, 100);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={(e) => {
                  handleInputChange(e);
                  setTimeout(calculateDays, 100);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de jours</label>
              <input
                type="number"
                name="nombre_jours"
                value={formData.nombre_jours}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de reprise</label>
              <input
                type="date"
                name="date_reprise"
                value={formData.date_reprise}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Signataire */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Signataire</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du signataire</label>
              <input
                type="text"
                name="signataire_nom"
                value={formData.signataire_nom}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre / Grade</label>
              <input
                type="text"
                name="signataire_titre"
                value={formData.signataire_titre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-800 text-white font-medium rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Enregistrement...' : 'Enregistrer et prévisualiser'}
          </button>
        </div>
      </form>
    </div>
  );
}
