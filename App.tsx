
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { analyzeDisassembly } from './services/geminiService';
import { AnalysisResult, DisassemblyStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<DisassemblyStatus>(DisassemblyStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Convert file to base64
  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Strip header (data:image/xxx;base64,)
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFilesSelect = async (imageFile: File, pdfFile?: File) => {
    try {
      setError(null);
      setStatus(DisassemblyStatus.ANALYZING);
      
      // Show preview immediately
      const objectUrl = URL.createObjectURL(imageFile);
      setSelectedImage(objectUrl);

      const imageBase64 = await processFile(imageFile);
      let pdfBase64: string | undefined = undefined;

      if (pdfFile) {
        pdfBase64 = await processFile(pdfFile);
      }
      
      const analysisData = await analyzeDisassembly(imageBase64, pdfBase64);
      
      setResult(analysisData);
      setStatus(DisassemblyStatus.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure your API Key is valid and the inputs are clear.");
      setStatus(DisassemblyStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(DisassemblyStatus.IDLE);
    setResult(null);
    setSelectedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col relative overflow-x-hidden">
      
      {/* Background Grid Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur border-b border-cyan-900/30 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
             <div className="w-4 h-4 bg-slate-900 -rotate-45"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white">
            DECONSTRUCT<span className="text-cyan-400">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="hidden md:inline text-xs font-mono text-slate-500">V2.5 + WEB GROUNDING</span>
            {status === DisassemblyStatus.COMPLETE && (
              <button 
                onClick={handleReset}
                className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded transition-colors"
              >
                NEW SCAN
              </button>
            )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {status === DisassemblyStatus.IDLE && (
          <div className="flex flex-col items-center justify-center mt-20 space-y-12 animate-fade-in-up">
             <div className="text-center max-w-2xl space-y-4">
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                  Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Disassembly</span>
                </h2>
                <p className="text-slate-400 text-lg">
                  The Intelligent Circular Economy Agent. <br/> 
                  <span className="text-sm text-slate-500">Upload device image + (Optional) PDF Manual for RAG-enhanced precision.</span>
                </p>
             </div>
             <div className="w-full max-w-md">
                <FileUpload onFilesSelect={handleFilesSelect} status={status} />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-12">
                {[
                  { title: 'Vision + RAG', desc: 'Combines Visual analysis with PDF manual data.' },
                  { title: 'Market Grounding', desc: 'Real-time Web Search for material pricing & resale value.' },
                  { title: 'Re-X Taxonomy', desc: 'Strategic decision matrix: Reuse, Remanufacture, or Recycle?' }
                ].map((item, i) => (
                  <div key={i} className="p-4 border border-slate-800 bg-slate-900/50 rounded hover:border-cyan-900 transition-colors">
                    <h3 className="font-bold text-cyan-100 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {(status === DisassemblyStatus.ANALYZING || status === DisassemblyStatus.PLANNING) && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
            <div className="relative w-32 h-32">
               <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
               <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
               {selectedImage && (
                 <div className="absolute inset-2 rounded-full overflow-hidden opacity-50">
                    <img src={selectedImage} alt="analyzing" className="w-full h-full object-cover" />
                 </div>
               )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white animate-pulse">Analyzing Lifecycle...</h3>
              <p className="text-slate-400 font-mono">Querying Web Markets & Analyzing Structural Integrity</p>
            </div>
            {/* Fake terminal logs for effect */}
            <div className="w-full max-w-md bg-black p-4 rounded font-mono text-xs text-green-500 opacity-80">
               <p className="typing-effect">&gt; Vision_System_Active... OK</p>
               <p className="typing-effect delay-100">&gt; Reading_Docs(RAG_Layer)... PENDING</p>
               <p className="typing-effect delay-200">&gt; Google_Search(Pricing_Data)... SEARCHING</p>
               <p className="typing-effect delay-300">&gt; Calculating_Economic_Viability...</p>
            </div>
          </div>
        )}

        {status === DisassemblyStatus.COMPLETE && result && (
          <AnalysisDashboard result={result} />
        )}

        {status === DisassemblyStatus.ERROR && (
          <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4">
             <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg max-w-md">
               <h3 className="text-xl font-bold text-red-400 mb-2">System Malfunction</h3>
               <p className="text-slate-300">{error}</p>
             </div>
             <button 
               onClick={handleReset}
               className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold transition-all"
             >
               Return to Idle
             </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>DECONSTRUCT_AI // Powered by Gemini 2.5 + Google Search</p>
          <p className="mt-1 text-xs">Circular Economy Intelligence System</p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
