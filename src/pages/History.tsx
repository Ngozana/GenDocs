import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Trash2 } from 'lucide-react';
import { dbService } from '../services/db';

export default function History() {
  const [activeTab, setActiveTab] = useState<'missions' | 'autorisations' | 'proces_verbaux'>('missions');
  const [missions, setMissions] = useState<any[]>([]);
  const [autorisations, setAutorisations] = useState<any[]>([]);
  const [procesVerbaux, setProcesVerbaux] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'missions') {
        const data = await dbService.getMissions();
        setMissions(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
      } else if (activeTab === 'autorisations') {
        const data = await dbService.getAutorisations();
        setAutorisations(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
      } else {
        const data = await dbService.getProcesVerbaux();
        setProcesVerbaux(data.sort((a, b) => (b.id || 0) - (a.id || 0)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: number) => {
    const message = activeTab === 'missions' 
      ? 'Êtes-vous sûr de vouloir supprimer cet ordre de mission ?'
      : activeTab === 'autorisations'
      ? 'Êtes-vous sûr de vouloir supprimer cette autorisation d\'absence ?'
      : 'Êtes-vous sûr de vouloir supprimer ce procès-verbal ?';
      
    if (window.confirm(message)) {
      try {
        if (activeTab === 'missions') {
          await dbService.deleteMission(id);
        } else if (activeTab === 'autorisations') {
          await dbService.deleteAutorisation(id);
        } else {
          await dbService.deleteProcesVerbal(id);
        }
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const filteredMissions = missions.filter(m => 
    m.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.lieu_mission.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.objet_mission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAutorisations = autorisations.filter(a => 
    a.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.beneficiaire_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.motif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProcesVerbaux = procesVerbaux.filter(p => 
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sieur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.gardien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-10 h-10 text-emerald-800" />
            Historique des Documents
          </h1>
          <p className="text-gray-500 mt-2">Consultez et gérez tous les documents générés.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('missions')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'missions'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Ordres de Mission
        </button>
        <button
          onClick={() => setActiveTab('autorisations')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'autorisations'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Autorisations d'Absence
        </button>
        <button
          onClick={() => setActiveTab('proces_verbaux')}
          className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'proces_verbaux'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Procès-Verbaux
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'missions' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Numéro</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Lieu</th>
                  <th className="p-4 font-medium">Objet</th>
                  <th className="p-4 font-medium">Agents</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Chargement...</td>
                  </tr>
                ) : filteredMissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Aucun ordre de mission trouvé.</td>
                  </tr>
                ) : (
                  filteredMissions.map((mission) => (
                    <tr key={mission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{mission.numero}</td>
                      <td className="p-4 text-gray-600">{new Date(mission.date_creation).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4 text-gray-600">{mission.lieu_mission}</td>
                      <td className="p-4 text-gray-600 max-w-xs truncate" title={mission.objet_mission}>{mission.objet_mission}</td>
                      <td className="p-4 text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {mission.nombre_personnes}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/preview/${mission.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Aperçu
                        </Link>
                        <button
                          onClick={() => handleDelete(mission.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeTab === 'autorisations' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Numéro</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Bénéficiaire</th>
                  <th className="p-4 font-medium">Motif</th>
                  <th className="p-4 font-medium">Durée</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Chargement...</td>
                  </tr>
                ) : filteredAutorisations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Aucune autorisation d'absence trouvée.</td>
                  </tr>
                ) : (
                  filteredAutorisations.map((autorisation) => (
                    <tr key={autorisation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{autorisation.numero}</td>
                      <td className="p-4 text-gray-600">{new Date(autorisation.date_creation).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4 text-gray-600">{autorisation.beneficiaire_nom}</td>
                      <td className="p-4 text-gray-600 max-w-xs truncate" title={autorisation.motif}>{autorisation.motif}</td>
                      <td className="p-4 text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {autorisation.nombre_jours} jour(s)
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/preview-autorisation/${autorisation.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Aperçu
                        </Link>
                        <button
                          onClick={() => handleDelete(autorisation.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Numéro</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Contrevenant</th>
                  <th className="p-4 font-medium">Gardien</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Chargement...</td>
                  </tr>
                ) : filteredProcesVerbaux.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Aucun procès-verbal trouvé.</td>
                  </tr>
                ) : (
                  filteredProcesVerbaux.map((pv) => (
                    <tr key={pv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{pv.numero}</td>
                      <td className="p-4 text-gray-600">{new Date(pv.date_creation).toLocaleDateString('fr-FR')}</td>
                      <td className="p-4 text-gray-600">{pv.sieur}</td>
                      <td className="p-4 text-gray-600">{pv.gardien}</td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/preview-proces-verbal/${pv.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Aperçu
                        </Link>
                        <button
                          onClick={() => handleDelete(pv.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
