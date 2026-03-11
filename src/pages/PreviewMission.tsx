import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import html2pdf from 'html2pdf.js';
import { dbService } from '../services/db';

export default function PreviewMission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    dbService.getMission(Number(id))
      .then((data) => {
        if (!data) throw new Error('Not found');
        setMission(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Ordre_Mission_${mission?.numero?.replace(/\//g, '_') || 'document'}`;
    window.print();
    document.title = originalTitle;
  };

  const handleDownloadPDF = () => {
    if (!componentRef.current) return;
    
    setIsGeneratingPdf(true);
    
    const element = componentRef.current;
    const opt = {
      margin:       0,
      filename:     `Ordre_Mission_${mission?.numero?.replace(/\//g, '_') || 'document'}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        windowWidth: 1024,
        onclone: (clonedDoc: Document) => {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) return;

          const convertColor = (color: string) => {
            if (!color || typeof color !== 'string') return color;
            if (!color.includes('oklch') && !color.includes('color(')) return color;
            
            return color.replace(/(?:oklch|color)\([^)]+\)/g, (match) => {
              ctx.clearRect(0, 0, 1, 1);
              ctx.fillStyle = match;
              ctx.fillRect(0, 0, 1, 1);
              const data = ctx.getImageData(0, 0, 1, 1).data;
              return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
            });
          };

          const elements = clonedDoc.querySelectorAll('*');
          const colorProps = [
            'color', 
            'background-color', 
            'border-color', 
            'border-top-color', 
            'border-right-color', 
            'border-bottom-color', 
            'border-left-color',
            'text-decoration-color', 
            'outline-color',
            'fill',
            'stroke'
          ];

          elements.forEach((el) => {
            if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;
            const style = clonedDoc.defaultView?.getComputedStyle(el);
            if (!style) return;

            colorProps.forEach(prop => {
              const val = style.getPropertyValue(prop);
              if (val && (val.includes('oklch') || val.includes('color('))) {
                el.style.setProperty(prop, convertColor(val), 'important');
              }
            });
          });
        }
      },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsGeneratingPdf(false);
    }).catch((err: any) => {
      console.error('Erreur lors de la génération du PDF', err);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
      setIsGeneratingPdf(false);
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement de l'aperçu...</div>;
  }

  if (!mission) {
    return <div className="p-8 text-center text-red-500">Ordre de mission introuvable.</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto print:p-0 print:max-w-none">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <div className="flex gap-4">
          <button onClick={handleDownloadPDF} disabled={isGeneratingPdf} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-colors disabled:opacity-50">
            <Download className="w-4 h-4" /> {isGeneratingPdf ? 'Génération...' : 'Télécharger PDF'}
          </button>
          <button onClick={() => handlePrint()} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-sm transition-colors">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto print:p-0 print:shadow-none print:border-none print:overflow-visible">
        {/* Document Container for Printing */}
        <div ref={componentRef} className="bg-white mx-auto box-border" style={{ width: '210mm', minHeight: '297mm', padding: '20mm', color: '#000', fontFamily: '"Calisto MT", Calisto, serif', fontSize: '12pt' }}>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4 leading-none" style={{ fontSize: '11pt' }}>
            <div className="flex flex-col items-start w-[55%] gap-1">
              <div className="text-center">
                <p className="font-bold uppercase text-left">{mission.ministere}</p>
                <p>-----------------</p>
                <p className="font-bold uppercase">CABINET</p>
                <p>-----------------</p>
              </div>
              <div className="text-center">
                <p className="font-bold uppercase text-left">{mission.direction_regionale}</p>
                <p>-----------------</p>
              </div>
              <div className="text-center flex flex-col items-center">
                {mission.cantonnement.toUpperCase().includes(' DE ') ? (
                  <>
                    <p className="font-bold uppercase text-center">
                      {mission.cantonnement.substring(0, mission.cantonnement.toUpperCase().lastIndexOf(' DE '))}
                    </p>
                    <p className="font-bold uppercase text-center">
                      DE {mission.cantonnement.substring(mission.cantonnement.toUpperCase().lastIndexOf(' DE ') + 4)}
                    </p>
                  </>
                ) : (
                  <p className="font-bold uppercase text-center">{mission.cantonnement}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center text-center w-[45%]">
              <p className="font-bold uppercase">REPUBLIQUE DE COTE D'IVOIRE</p>
              <p className="italic">Union – Discipline – Travail</p>
              <p>-----------------</p>
            </div>
          </div>

          <div className="flex justify-between items-end mb-4" style={{ fontSize: '11pt' }}>
            <p>N° {mission.numero}</p>
            <p>{mission.ville}, le {format(new Date(mission.date_creation), 'dd MMMM yyyy', { locale: fr })}</p>
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold underline underline-offset-4 tracking-widest">ORDRE DE MISSION</h1>
          </div>

          {/* Body Text */}
          <div className="mb-3 text-justify leading-relaxed">
            <p>
              Le Chef de Cantonnement des Eaux et Forêts de <strong>{mission.ville}</strong> donne ordre aux agents ci-dessous désignés :
            </p>
          </div>

          {/* Agents Table */}
          <table className="w-full border-collapse border border-black mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-center w-1/3">NOM ET PRENOMS</th>
                <th className="border border-black p-2 text-center">MATRICULE</th>
                <th className="border border-black p-2 text-center">CORPS ET GRADE</th>
                <th className="border border-black p-2 text-center">OBSERVATION</th>
              </tr>
            </thead>
            <tbody>
              {mission.agents.map((agent: any, index: number) => (
                <tr key={index}>
                  <td className="border border-black p-2">{agent.nom_prenoms}</td>
                  <td className="border border-black p-2 text-center">{agent.matricule}</td>
                  <td className="border border-black p-2 text-center">{agent.corps_grade}</td>
                  <td className="border border-black p-2 text-center">{agent.observation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mission Details */}
          <div className="space-y-1 mb-6 pl-4">
            <div className="flex">
              <span className="w-48 font-bold">Lieu de la mission</span>
              <span>: {mission.lieu_mission}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-bold">Objet de la mission</span>
              <span className="flex-1">: {mission.objet_mission}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-bold">Nombre de personnes</span>
              <span>: {mission.nombre_personnes}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-bold">Moyen de transport</span>
              <span>: {mission.moyen_transport}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-bold">Date de départ</span>
              <span>: {format(new Date(mission.date_depart), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex">
              <span className="w-48 font-bold">Date de retour</span>
              <span>: {format(new Date(mission.date_retour), 'dd/MM/yyyy')}</span>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="flex justify-end pr-8">
            <div className="text-center">
              <p>LE CHEF DE CANTONNEMENT</p>
              <div style={{ marginTop: '1.5cm' }}>
                <p className="font-bold underline">Cne SORO RAMATA</p>
                <p className="italic">Ingénieur des Techniques des Eaux et Forêts</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
