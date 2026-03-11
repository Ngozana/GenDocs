import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { dbService, ProcesVerbalSaisie } from '../services/db';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PreviewProcesVerbal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pv, setPv] = useState<ProcesVerbalSaisie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dbService.getProcesVerbal(Number(id))
        .then((data) => {
          if (data) {
            setPv(data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!componentRef.current || !pv) return;
    
    try {
      setIsGeneratingPdf(true);
      
      const canvas = await html2canvas(componentRef.current, { 
        scale: 2, 
        useCORS: true,
        windowWidth: 1024,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.querySelector('[data-pdf-container]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.padding = '20mm';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PV_SAISIE_${pv.numero || 'NOUVEAU'}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement de l'aperçu...</div>;
  }

  if (!pv) {
    return <div className="p-8 text-center text-red-500">Procès-Verbal introuvable.</div>;
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
        <div ref={componentRef} data-pdf-container className="bg-white mx-auto box-border" style={{ width: '210mm', minHeight: '297mm', padding: '20mm', color: '#000', fontFamily: '"Calisto MT", Calisto, serif', fontSize: '12pt' }}>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-4 leading-none" style={{ fontSize: '11pt' }}>
            <div className="flex flex-col items-start w-[55%] gap-1">
              <div className="text-center">
                <p className="font-bold uppercase text-left">{pv.ministere}</p>
                <p>-----------------</p>
                <p className="font-bold uppercase">CABINET</p>
                <p>-----------------</p>
              </div>
              <div className="text-center">
                <p className="font-bold uppercase text-left">{pv.direction_regionale}</p>
                <p>-----------------</p>
              </div>
              <div className="text-center flex flex-col items-center">
                {pv.cantonnement.toUpperCase().includes(' DE ') ? (
                  <>
                    <p className="font-bold uppercase text-center">
                      {pv.cantonnement.substring(0, pv.cantonnement.toUpperCase().lastIndexOf(' DE '))}
                    </p>
                    <p className="font-bold uppercase text-center">
                      DE {pv.cantonnement.substring(pv.cantonnement.toUpperCase().lastIndexOf(' DE ') + 4)}
                    </p>
                  </>
                ) : (
                  <p className="font-bold uppercase text-center">{pv.cantonnement}</p>
                )}
                <p>---------------------------------</p>
              </div>
              <div className="mt-2 text-left">
                <p>N° {pv.numero}/MINEF/CAB/DRN/CEF-DIMB</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center w-[45%]">
              <p className="font-bold uppercase">REPUBLIQUE DE COTE D'IVOIRE</p>
              <p className="italic">Union – Discipline – Travail</p>
              <p>-----------------</p>
              <div className="mt-4">
                <p>{pv.ville}, le {format(new Date(pv.date_creation), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mt-6 mb-6">
            <h1 className="text-xl font-bold underline underline-offset-4 tracking-widest">PROCES-VERBAL DE SAISIE</h1>
          </div>

          {/* Body Text */}
          <div className="mb-3 text-justify" style={{ fontSize: '12pt', lineHeight: '1.8' }}>
            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">L'an deux mil</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.annee}
              </span>
              <span className="whitespace-nowrap mx-2">et le</span>
              <span className="w-32 border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.jour}
              </span>
              <span className="whitespace-nowrap mx-2">du mois de</span>
              <span className="w-40 border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.mois}
              </span>
            </div>
            
            <div className="w-full mb-3">
              <span>Nous soussigné,</span>
            </div>

            {/* Agents */}
            {[0, 1, 2, 3].map((index) => (
              <div key={`agent-${index}`} className="flex items-end w-full mb-3">
                <span className="whitespace-nowrap mr-2">{index + 1}</span>
                <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                  {pv.agents[index] || ''}
                </span>
              </div>
            ))}

            <div className="w-full mb-3">
              <span>Avons, en vertu des articles 84, 85, 86 de la loi n°2019-675 du 23 juillet 2019 portant Code forestier,</span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">signifie au (x) sieur (s)</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.sieur}
              </span>
            </div>

            <div className="w-full mb-3">
              <span>Que les produits ou matériels suivants :</span>
            </div>

            {/* Produits */}
            {[0, 1].map((index) => (
              <div key={`produit-${index}`} className="flex items-end w-full mb-3">
                <span className="whitespace-nowrap mr-2">{index + 1}</span>
                <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                  {pv.produits[index] || ''}
                </span>
              </div>
            ))}

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">Sont saisis et confiés à la garde de</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.gardien}
              </span>
            </div>

            <div className="w-full mb-3">
              <span>A charge pour lui de les présenter à tout moment sur réquisition des agents de l'administration des Eaux et Forêts.</span>
            </div>

            <div className="w-full mb-3">
              <span>Infraction(s) relevée(s) :</span>
            </div>

            {/* Infractions */}
            {[0, 1, 2].map((index) => (
              <div key={`infraction-${index}`} className="flex items-end w-full mb-3">
                <span className="whitespace-nowrap mr-2">{index + 1}</span>
                <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                  {pv.infractions[index] || ''}
                </span>
              </div>
            ))}

            <div className="w-full mb-3">
              <span>Nous lui avons fait connaitre qu'en cas de détournement de ces produits, il tomberait sous l'application de l'article 469 alinéa 1 du Code Pénal. Afin qu'il n'en ignore, nous lui avons remis un exemplaire du présent procès-verbal qu'il a :</span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.remis_a}
              </span>
            </div>

            <div className="flex items-end w-full mb-3">
              <span className="whitespace-nowrap mr-2">Fait et clos à</span>
              <span className="flex-grow border-b-[2px] border-dotted border-black text-center font-bold pb-0.5">
                {pv.lieu_cloture}
              </span>
              <span className="whitespace-nowrap ml-2">les jours, mois et an que dessus.</span>
            </div>
          </div>

          {/* Footer / Signature */}
          <div className="flex justify-between mt-12 px-4" style={{ fontSize: '11pt' }}>
            <div className="text-center">
              <p>GARDIEN DE SAISIE</p>
            </div>
            <div className="text-center">
              <p>MISE EN CAUSE</p>
            </div>
            <div className="text-center">
              <p>SIGNATURE DE L'AGENT</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
