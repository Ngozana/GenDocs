import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FilePlus, History, FileText, Users, ArrowRight } from 'lucide-react';
import { dbService } from '../services/db';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [recentMissions, setRecentMissions] = useState<any[]>([]);

  useEffect(() => {
    dbService.getMissions()
      .then((data) => {
        const sortedData = data.sort((a, b) => (b.id || 0) - (a.id || 0));
        setStats({
          total: sortedData.length,
          recent: sortedData.filter((m: any) => {
            const date = new Date(m.date_creation);
            const now = new Date();
            return (now.getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000;
          }).length
        });
        setRecentMissions(sortedData.slice(0, 5));
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-10 h-10 text-emerald-800" />
          Ordres de Mission
        </h1>
        <p className="text-gray-500 mt-2">Bienvenue sur l'application de gestion des ordres de mission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Ordres</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
            <History className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">7 derniers jours</p>
            <p className="text-3xl font-bold text-gray-900">{stats.recent}</p>
          </div>
        </div>

        <Link to="/create" className="bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-2xl p-6 shadow-sm flex items-center justify-between text-white group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <FilePlus className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-bold">Créer un ordre</p>
              <p className="text-emerald-100 text-sm">Nouvelle mission</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link to="/create-autorisation" className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-6 shadow-sm flex items-center justify-between text-white group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-bold">Créer une autorisation</p>
              <p className="text-blue-100 text-sm">Nouvelle absence</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link to="/create-proces-verbal" className="bg-amber-600 hover:bg-amber-700 transition-colors rounded-2xl p-6 shadow-sm flex items-center justify-between text-white group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-bold">Créer un PV</p>
              <p className="text-amber-100 text-sm">Nouveau procès-verbal</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Ordres récents</h2>
          <Link to="/history" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Numéro</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Lieu</th>
                <th className="p-4 font-medium">Objet</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentMissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Aucun ordre de mission récent.
                  </td>
                </tr>
              ) : (
                recentMissions.map((mission) => (
                  <tr key={mission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{mission.numero}</td>
                    <td className="p-4 text-gray-600">{new Date(mission.date_creation).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4 text-gray-600">{mission.lieu_mission}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">{mission.objet_mission}</td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/preview/${mission.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Aperçu
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
