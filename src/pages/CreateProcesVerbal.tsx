import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, FileText, Plus, Trash2 } from 'lucide-react';
import { AGENTS_LIST } from '../data/agents';
import { dbService } from '../services/db';

export default function CreateProcesVerbal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ministere: 'MINISTERE DES EAUX ET FORETS',
    direction_regionale: 'DIRECTION REGIONALE DU N\'ZI',
    cantonnement: 'CANTONNEMENT DES EAUX ET FORETS DE DIMBOKRO',
    ville: 'Dimbokro',
    date_creation: new Date().toISOString().split('T')[0],
    numero: '',
    annee: 'vingt-six',
    jour: '',
    mois: '',
    agents: [''],
    sieur: '',
    produits: [''],
    gardien: '',
    infractions: [''],
    remis_a: '',
    lieu_cloture: 'Dimbokro',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, field: 'agents' | 'produits' | 'infractions', value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'agents' | 'produits' | 'infractions') => {
    if (formData[field].length < (field === 'agents' ? 4 : field === 'produits' ? 2 : 3)) {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
    }
  };

  const removeArrayItem = (index: number, field: 'agents' | 'produits' | 'infractions') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const id = await dbService.saveProcesVerbal(formData);
      navigate(`/preview-proces-verbal/${id}`);
    } catch (error) {
      console.error('Error saving proces verbal:', error);
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
            Nouveau Procès-Verbal de Saisie
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
              <input
                type="date"
                name="date_creation"
                value={formData.date_creation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro du document</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
                placeholder="Ex: 001"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Date en toutes lettres */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Date de l'acte (en toutes lettres)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année (ex: vingt-six)</label>
              <input
                type="text"
                name="annee"
                value={formData.annee}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour (ex: vingt-trois)</label>
              <input
                type="text"
                name="jour"
                value={formData.jour}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mois (ex: mars)</label>
              <input
                type="text"
                name="mois"
                value={formData.mois}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Agents */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Agents soussignés (Max 4)</h2>
            {formData.agents.length < 4 && (
              <button
                type="button"
                onClick={() => addArrayItem('agents')}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            )}
          </div>
          <div className="space-y-4">
            {formData.agents.map((agent, index) => (
              <div key={index} className="flex gap-4 items-center">
                <span className="font-bold text-gray-500 w-4">{index + 1}.</span>
                <input
                  type="text"
                  value={agent}
                  onChange={(e) => handleArrayChange(index, 'agents', e.target.value)}
                  placeholder="Nom, Prénoms, Grade et Matricule de l'agent"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
                {formData.agents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'agents')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contrevenant */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Contrevenant</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Signifié au (x) sieur (s)</label>
            <input
              type="text"
              name="sieur"
              value={formData.sieur}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Produits */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Produits ou matériels saisis (Max 2)</h2>
            {formData.produits.length < 2 && (
              <button
                type="button"
                onClick={() => addArrayItem('produits')}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            )}
          </div>
          <div className="space-y-4">
            {formData.produits.map((produit, index) => (
              <div key={index} className="flex gap-4 items-center">
                <span className="font-bold text-gray-500 w-4">{index + 1}.</span>
                <input
                  type="text"
                  value={produit}
                  onChange={(e) => handleArrayChange(index, 'produits', e.target.value)}
                  placeholder="Description du produit ou matériel"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
                {formData.produits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'produits')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Gardien */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Gardien de saisie</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sont saisis et confiés à la garde de</label>
            <input
              type="text"
              name="gardien"
              value={formData.gardien}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Infractions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">Infraction(s) relevée(s) (Max 3)</h2>
            {formData.infractions.length < 3 && (
              <button
                type="button"
                onClick={() => addArrayItem('infractions')}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            )}
          </div>
          <div className="space-y-4">
            {formData.infractions.map((infraction, index) => (
              <div key={index} className="flex gap-4 items-center">
                <span className="font-bold text-gray-500 w-4">{index + 1}.</span>
                <input
                  type="text"
                  value={infraction}
                  onChange={(e) => handleArrayChange(index, 'infractions', e.target.value)}
                  placeholder="Description de l'infraction"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
                {formData.infractions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'infractions')}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Clôture */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Clôture du document</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remis un exemplaire à</label>
              <input
                type="text"
                name="remis_a"
                value={formData.remis_a}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fait et clos à</label>
              <input
                type="text"
                name="lieu_cloture"
                value={formData.lieu_cloture}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-6 h-6" />
            {loading ? 'Enregistrement...' : 'Enregistrer le document'}
          </button>
        </div>
      </form>
    </div>
  );
}
