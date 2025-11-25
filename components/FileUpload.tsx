
import React, { useState } from 'react';
import { DisassemblyStatus } from '../types';

interface FileUploadProps {
  onFilesSelect: (imageFile: File, pdfFile?: File) => void;
  status: DisassemblyStatus;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, status }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (imageFile) {
      onFilesSelect(imageFile, pdfFile || undefined);
    }
  };

  const isProcessing = status === DisassemblyStatus.ANALYZING || status === DisassemblyStatus.PLANNING;

  if (isProcessing) {
    return (
      <div className="w-full p-10 border-2 border-dashed border-cyan-500/30 bg-slate-900/50 rounded-2xl flex flex-col items-center justify-center animate-pulse">
        <div className="w-16 h-16 mb-4 rounded-full border-4 border-t-cyan-500 border-slate-700 animate-spin"></div>
        <h3 className="text-xl font-bold text-cyan-400 tracking-widest">PROCESSING DATA STREAMS</h3>
        <p className="text-slate-400 mt-2 text-sm">Querying Global Markets & Analyzing Structural Integrity...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Image Upload Area */}
      <div className="w-full p-8 border-2 border-dashed border-cyan-900/50 bg-slate-900/50 rounded-2xl hover:border-cyan-500/50 transition-all group relative overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-4 text-center z-0">
          <div className="p-4 rounded-full bg-slate-800 group-hover:bg-slate-700 group-hover:scale-110 transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-100 group-hover:text-cyan-50 transition-colors">
              {imageFile ? imageFile.name : "1. Upload Device Image"}
            </h3>
            <p className="text-slate-400 text-xs mt-2 font-mono uppercase tracking-wider">Vision Analysis Target</p>
          </div>
        </div>
      </div>

      {/* PDF Upload Area (RAG) */}
      <div className="w-full p-5 border border-dashed border-slate-700 bg-slate-900/30 rounded-xl hover:border-slate-500 hover:bg-slate-900/50 transition-all relative">
         <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="bg-slate-800 p-2 rounded text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
           <div className="text-left">
            <h3 className="text-sm font-bold text-slate-300">
              {pdfFile ? pdfFile.name : "2. Upload Manual / Datasheet (RAG)"}
            </h3>
            <p className="text-slate-500 text-[10px] mt-0.5">Helps the AI find hidden screws and specific material grades.</p>
          </div>
        </div>
      </div>

      {imageFile && (
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-[0.2em] uppercase rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-0.5"
        >
          Initialize Analysis Sequence
        </button>
      )}
    </div>
  );
};
