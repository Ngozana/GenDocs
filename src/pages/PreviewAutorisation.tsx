import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import html2pdf from 'html2pdf.js';
import { dbService } from '../services/db';

export default function PreviewAutorisation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [autorisation, setAutorisation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    dbService.getAutorisation(Number(id))
      .then((data) => {
        if (!data) throw new Error('Not found');
        setAutorisation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `Autorisation_Absence_${autorisation?.numero?.replace(/\//g, '_') || 'document'}`;
    window.print();
    document.title = originalTitle;
  };

  const handleDownloadPDF = () => {
    if (!componentRef.current) return;
    
    setIsGeneratingPdf(true);
    
    const element = componentRef.current;
    const opt = {
      margin:       0,
      filename:     `Autorisation_Absence_${autorisation?.numero?.replace(/\//g, '_') || 'document'}.pdf`,
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

  if (!autorisation) {
    return <div className="p-8 text-center text-red-500">Autorisation d'absence introuvable.</div>;
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
                <p className="font-bold uppercase text-left">{autorisation.ministere}</p>
                <p>-----------------</p>
                <p className="font-bold uppercase">CABINET</p>
                <p>-----------------</p>
              </div>
              <div className="text-center">
                <p className="font-bold uppercase text-left">{autorisation.direction_regionale}</p>
                <p>-----------------</p>
              </div>
              <div className="text-center flex flex-col items-center">
                {autorisation.cantonnement.toUpperCase().includes(' DE ') ? (
                  <>
                    <p className="font-bold uppercase text-center">
                      {autorisation.cantonnement.substring(0, autorisation.cantonnement.toUpperCase().lastIndexOf(' DE '))}
                    </p>
                    <p className="font-bold uppercase text-center">
                      DE {autorisation.cantonnement.substring(autorisation.cantonnement.toUpperCase().lastIndexOf(' DE ') + 4)}
                    </p>
                  </>
                ) : (
                  <p className="font-bold uppercase text-center">{autorisation.cantonnement}</p>
                )}
                <p>---------------------------------</p>
              </div>
              <div className="mt-2 text-left">
                <p>N° {autorisation.numero}/MINEF/CAB/DRN/CEF-DIMB</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center w-[45%]">
              <p className="font-bold uppercase">REPUBLIQUE DE COTE D'IVOIRE</p>
              <p className="italic">Union – Discipline – Travail</p>
              <p>-----------------</p>
              <div className="mt-4">
                <p>{autorisation.ville}, le {format(new Date(autorisation.date_creation), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mt-6 mb-6">
            <h1 className="text-xl font-bold underline underline-offset-4 tracking-widest">AUTORISATION D'ABSENCE</h1>
          </div>

          {/* Body Text */}
          <div className="mb-3 text-justify" style={{ fontSize: '12pt', lineHeight: '1.8' }}>
            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">Une autorisation d'absence de</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {autorisation.nombre_jours}
              </span>
              <span className="whitespace-nowrap ml-2">jours</span>
            </div>
            
            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">du</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {format(new Date(autorisation.date_debut), 'dd/MM/yyyy')}
              </span>
              <span className="whitespace-nowrap mx-2">au</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {format(new Date(autorisation.date_fin), 'dd/MM/yyyy')}
              </span>
              <span className="whitespace-nowrap ml-2">inclus est accordée à</span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">Mr</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {autorisation.beneficiaire_nom}
              </span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2 font-bold">Matricule</span>
              <span className="w-40 border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {autorisation.beneficiaire_matricule}
              </span>
              <span className="whitespace-nowrap ml-2">en service au Cantonnement des Eaux et Forêts de</span>
            </div>
            
            <div className="w-full mb-3">
              <span className="font-bold">{autorisation.ville}</span>.
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2 font-bold">Pour se rendre à</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {autorisation.destination}
              </span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2 font-bold">Motif :</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {autorisation.motif}
              </span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">L'intéressé (e) reprendra ses fonctions le</span>
              <span className="w-32 border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {format(new Date(autorisation.date_reprise), 'dd/MM/yyyy')}
              </span>
              <span className="whitespace-nowrap ml-2">à son poste actuel et aux</span>
            </div>
            
            <div className="w-full mb-3">
              <span>heures habituelles.</span>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="flex justify-end pr-8 mt-8">
            <div className="text-center">
              <p>LE CHEF DE CANTONNEMENT</p>
              <div style={{ marginTop: '1.5cm' }}>
                <p className="font-bold underline">{autorisation.signataire_nom}</p>
                <p className="italic">{autorisation.signataire_titre}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
