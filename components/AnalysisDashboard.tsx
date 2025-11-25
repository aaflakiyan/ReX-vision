
import React, { useState } from 'react';
import { AnalysisResult, DisassemblyStep } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, CartesianGrid } from 'recharts';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'CIRCULAR_ECONOMY' | 'ROBOTIC_FEASIBILITY' | 'BLUEPRINT' | 'TERMINAL' | 'METRICS'>('CIRCULAR_ECONOMY');
  const [selectedStep, setSelectedStep] = useState<DisassemblyStep | null>(null);

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
  const DISCIPLINE_COLORS = ['#22d3ee', '#10b981', '#f59e0b', '#64748b']; // Cyan (Robots), Green (Chem), Amber (Manual), Slate (Logistics)

  // Data for Radar Chart (Decision Dimensions)
  const radarData = [
    { subject: 'Recyclability', A: result.materials.reduce((acc, m) => acc + m.recyclability, 0) / result.materials.length, fullMark: 100 },
    { subject: 'Econ Value', A: result.circularStrategy.economicViability === 'PROFITABLE' ? 90 : 40, fullMark: 100 },
    { subject: 'Demand', A: result.circularStrategy.marketDemand === 'HIGH' ? 95 : result.circularStrategy.marketDemand === 'MEDIUM' ? 60 : 30, fullMark: 100 },
    { subject: 'Confidence', A: result.circularStrategy.confidenceScore, fullMark: 100 },
    { subject: 'Complexity', A: (10 - result.complexityScore) * 10, fullMark: 100 },
  ];

  // Data for Discipline Breakdown
  const disciplineData = [
    { name: 'Robotics & Automation', value: result.disciplineBreakdown?.roboticsAndAutomation || 0 },
    { name: 'Chemical Processing', value: result.disciplineBreakdown?.chemicalProcessing || 0 },
    { name: 'Manual Labor', value: result.disciplineBreakdown?.manualLabor || 0 },
    { name: 'Logistics', value: result.disciplineBreakdown?.logisticsAndTransport || 0 },
  ].filter(d => d.value > 0);

  // Sort steps for Robotic Ranking (High to Low)
  const sortedSteps = [...result.steps].sort((a, b) => b.automationScore - a.automationScore);

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-20">
      
      {/* Trust & Data Quality Header */}
      {result.dataQualityWarning && (
        <div className="bg-amber-950/40 border border-amber-600/50 p-4 rounded-lg flex items-start gap-4 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <svg className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <h3 className="text-amber-400 font-bold text-sm tracking-wide uppercase">Data Confidence Alert</h3>
            <p className="text-amber-200/80 text-sm mt-1">
              {result.dataQualityWarning === 'NO_DATA_FOUND' 
                ? 'System could not verify pricing or disassembly guides in public databases. Strategy is based on generalized material physics models only.' 
                : result.dataQualityWarning}
            </p>
          </div>
        </div>
      )}

      {/* Main Header Info */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
            <span className="text-cyan-500">TARGET:</span> {result.deviceName}
          </h2>
          <p className="text-slate-400 mt-2 max-w-3xl leading-relaxed border-l-2 border-slate-700 pl-4">
            {result.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[180px]">
          <div className={`px-4 py-2 rounded font-mono font-bold text-lg border ${
             result.circularStrategy.strategy === 'REUSE' ? 'bg-green-950/50 border-green-500 text-green-400' :
             result.circularStrategy.strategy === 'RECYCLE' ? 'bg-cyan-950/50 border-cyan-500 text-cyan-400' :
             'bg-orange-950/50 border-orange-500 text-orange-400'
          }`}>
            {result.circularStrategy.strategy}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-widest">Recommended Action</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-8">
        {['CIRCULAR_ECONOMY', 'ROBOTIC_FEASIBILITY', 'BLUEPRINT', 'TERMINAL', 'METRICS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 text-xs font-mono font-bold tracking-[0.2em] transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            {tab.replace('_', ' ')}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]"></div>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {activeTab === 'CIRCULAR_ECONOMY' && (
             <div className="space-y-6 animate-fade-in">
                {/* Taxonomy & Strategy Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-xl border border-slate-700 relative overflow-hidden">
                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   
                   <div className="flex justify-between items-start mb-8 relative z-10">
                     <div>
                       <h3 className="text-xl font-bold text-white uppercase tracking-widest">Strategic Decision Matrix</h3>
                       <p className="text-slate-500 text-sm mt-1">Lifecycle Optimization Engine Output</p>
                     </div>
                     <div className="text-right">
                       <div className="text-3xl font-bold text-white">{result.circularStrategy.confidenceScore}%</div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-widest">Certainty Score</div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                      <div className="h-64 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                              <PolarGrid stroke="#334155" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                              <Radar name="Strategy" dataKey="A" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.2} />
                              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0'}} />
                            </RadarChart>
                         </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-6">
                         <div className="space-y-2">
                           <h4 className="text-xs text-cyan-500 uppercase font-bold tracking-wider">Reasoning Logic</h4>
                           <p className="text-slate-300 text-sm leading-6 border-l-2 border-cyan-500/30 pl-3">
                             {result.circularStrategy.reasoning}
                           </p>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-950/50 p-3 rounded border border-slate-700/50">
                               <div className="text-[10px] text-slate-500 uppercase">Intervention</div>
                               <div className="text-white font-medium text-sm">{result.circularStrategy.interventionType}</div>
                            </div>
                            <div className="bg-slate-950/50 p-3 rounded border border-slate-700/50">
                               <div className="text-[10px] text-slate-500 uppercase">Viability</div>
                               <div className={`font-bold text-sm ${
                                 result.circularStrategy.economicViability === 'PROFITABLE' ? 'text-emerald-400' : 'text-amber-400'
                               }`}>{result.circularStrategy.economicViability}</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Citations / Sources */}
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                     Verified Grounding Sources
                   </h3>
                   {result.citations && result.citations.length > 0 ? (
                     <div className="grid grid-cols-1 gap-2">
                       {result.citations.map((cite, idx) => (
                         <a 
                            key={idx} 
                            href={cite.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800 transition-all group"
                         >
                           <span className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-mono border border-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-500">
                             {idx + 1}
                           </span>
                           <span className="text-sm text-slate-300 truncate group-hover:text-cyan-100 flex-1">
                             {cite.title || cite.uri}
                           </span>
                           <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                         </a>
                       ))}
                     </div>
                   ) : (
                      <div className="text-slate-500 text-sm italic p-4 border border-dashed border-slate-700 rounded bg-slate-900/30">
                        No direct web links returned. Analysis generated using internal knowledge base of material properties and standard assembly techniques.
                      </div>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'ROBOTIC_FEASIBILITY' && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Row: Discipline Breakdown & Challenge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Pie Chart: Discipline Share */}
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Intervention Discipline Share</h3>
                    <div className="h-64">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie
                                data={disciplineData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                             >
                                {disciplineData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={DISCIPLINE_COLORS[index % DISCIPLINE_COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0', borderRadius: '8px'}} />
                             <Legend 
                                layout="vertical" 
                                verticalAlign="middle" 
                                align="right"
                                iconType="circle"
                                wrapperStyle={{fontSize: '10px'}}
                             />
                          </PieChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
                 
                 {/* Key Challenge Card */}
                 <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">Primary Automation Barrier</h3>
                    <div className="text-white text-lg font-bold mb-2">
                       {result.primaryAutomationChallenge || "Complex Non-Rigid Components"}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                       This bottleneck represents the highest risk for autonomous failure. Recommended mitigation: Hybrid human-in-the-loop cells or advanced computer vision guidance.
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                       <div className="h-1 flex-1 bg-slate-800 rounded overflow-hidden">
                          <div className="h-full bg-red-500/50 w-3/4 animate-pulse"></div>
                       </div>
                       <span className="text-[10px] text-red-400 font-mono">CRITICALITY: HIGH</span>
                    </div>
                 </div>
              </div>

              {/* Automation Ranking Matrix */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                 <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Robotic Opportunity Ranking</h3>
                      <p className="text-slate-500 text-[10px] mt-1">Sorted by feasibility score (High to Low)</p>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    {sortedSteps.map((step, idx) => (
                       <div 
                          key={step.stepId} 
                          onClick={() => setSelectedStep(step)}
                          className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                             selectedStep?.stepId === step.stepId
                             ? 'bg-cyan-950/20 border-cyan-500/50'
                             : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800'
                          }`}
                       >
                          <div className="flex items-center gap-4">
                             <div className="flex-shrink-0 font-mono text-xs text-slate-500 w-6">#{idx + 1}</div>
                             
                             <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                   <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-slate-200">{step.action} {step.component}</span>
                                      {step.automationScore > 80 && (
                                         <span className="px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-400 text-[10px] border border-cyan-800">
                                            HIGH ROI
                                         </span>
                                      )}
                                   </div>
                                   <span className="text-[10px] font-mono text-slate-400">{step.recommendedRobot.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full rounded-full transition-all duration-1000 ${
                                         step.automationScore > 80 ? 'bg-cyan-400' :
                                         step.automationScore > 50 ? 'bg-blue-500' : 
                                         'bg-slate-600'
                                      }`}
                                      style={{ width: `${step.automationScore}%` }}
                                   ></div>
                                </div>
                             </div>
                             
                             <div className="w-10 text-right font-mono text-sm font-bold text-white">
                                {step.automationScore}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'BLUEPRINT' && (
            <div className="space-y-4 animate-fade-in">
              {result.steps.map((step, idx) => (
                <div 
                  key={step.stepId}
                  onClick={() => setSelectedStep(step)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all duration-300 hover:translate-x-1 ${
                    selectedStep?.stepId === step.stepId 
                    ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">
                        {String(step.stepId).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-200">{step.action}</h3>
                        <p className="text-sm text-cyan-400">{step.component}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] font-bold rounded tracking-wider uppercase border ${
                      step.hazardLevel === 'CRITICAL' ? 'bg-red-950/50 text-red-400 border-red-800' :
                      step.hazardLevel === 'HIGH' ? 'bg-orange-950/50 text-orange-400 border-orange-800' :
                      'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {step.hazardLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'TERMINAL' && (
             <div className="bg-[#0c0c0c] p-6 rounded-xl border border-slate-800 font-mono text-xs md:text-sm h-[600px] overflow-y-auto shadow-2xl relative animate-fade-in">
              <div className="sticky top-0 right-0 p-2 text-right pointer-events-none">
                 <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded text-[10px] border border-green-900/50">PYTHON_ROS_BRIDGE_ACTIVE</span>
              </div>
              <pre className="text-blue-100/80 whitespace-pre-wrap leading-relaxed">
                <code>{`# DECONSTRUCT_AI v2.5
# CIRCULAR ECONOMY PROTOCOL
# TARGET: ${result.deviceName.replace(/\s+/g, '_').toUpperCase()}
# STRATEGY: ${result.circularStrategy.strategy}

import robolib
from safety_core import hazard_monitor
from circular_economy import MaterialDatabase

# Initialize Robotic Cell
robot = robolib.RobotArm(model="ARTHUR-6DOF")
vision = robolib.VisionSystem()

def disassemble_sequence():
    """
    Executes disassembly based on economic viability.
    Current Logic: ${result.circularStrategy.reasoning.substring(0, 50)}...
    """
    print("Initializing Safety Protocols...")
    hazard_monitor.active = True
    
${result.generatedCode}
`}
                </code>
              </pre>
            </div>
          )}

          {activeTab === 'METRICS' && (
             <div className="grid grid-cols-1 gap-6 animate-fade-in">
               <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Material Recovery Value</h3>
                    <span className="text-emerald-400 font-mono font-bold text-xl">
                       ${result.materials.reduce((acc, curr) => acc + curr.estimatedValueUsd, 0).toFixed(2)}
                    </span>
                 </div>
                 
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={result.materials} layout="vertical" barSize={20}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="material" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} />
                       <Tooltip 
                         cursor={{fill: 'rgba(255,255,255,0.05)'}}
                         contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0', borderRadius: '8px'}}
                         formatter={(value: number) => [`$${value.toFixed(2)}`, 'Est. Value']}
                       />
                       <Bar dataKey="estimatedValueUsd" radius={[0, 4, 4, 0]}>
                         {result.materials.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                     <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-widest">Composition Mass %</h3>
                     <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={result.materials as any[]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="percentage"
                            stroke="none"
                          >
                            {result.materials.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0', borderRadius: '8px'}} />
                        </PieChart>
                      </ResponsiveContainer>
                     </div>
                  </div>
                  
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center space-y-4">
                     <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Recyclability Index</h3>
                     {result.materials.map((mat, i) => (
                        <div key={i} className="space-y-1">
                           <div className="flex justify-between text-xs text-slate-400">
                              <span>{mat.material}</span>
                              <span>{mat.recyclability}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${mat.recyclability}%` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             </div>
          )}
        </div>

        {/* Right Panel: Details / Visualization */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
             {/* Step Detail Card */}
             <div className="bg-slate-900/90 backdrop-blur border border-slate-700 p-6 rounded-xl shadow-lg min-h-[300px] flex flex-col">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">
                 Micro-Task Analysis
               </h3>
               {selectedStep ? (
                 <div className="space-y-5 animate-fade-in flex-grow">
                   <div>
                     <div className="text-[10px] text-cyan-500 uppercase font-bold mb-1">Step Rationale</div>
                     <p className="text-white text-sm leading-relaxed font-medium">{selectedStep.reasoning}</p>
                   </div>
                   
                   {/* VALIDATION BOX */}
                   {selectedStep.verificationNote && (
                      <div className="bg-slate-950/80 p-3 rounded border-l-2 border-emerald-500">
                        <div className="flex items-center gap-2 mb-1">
                           <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           <span className="text-[10px] text-emerald-400 font-bold uppercase">Feasibility Verified</span>
                        </div>
                        <p className="text-slate-400 text-xs italic">
                           "{selectedStep.verificationNote}"
                        </p>
                      </div>
                   )}

                   <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-cyan-500/30 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Torque Limit</div>
                        <div className="text-cyan-400 font-mono text-lg">{selectedStep.torqueLimit} <span className="text-xs text-slate-600">Nm</span></div>
                     </div>
                     <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-cyan-500/30 transition-colors">
                        <div className="text-[10px] text-slate-500 uppercase mb-1">Tool Head</div>
                        <div className="text-purple-400 font-mono text-sm truncate">{selectedStep.tool}</div>
                     </div>
                   </div>

                   {selectedStep.automationScore !== undefined && (
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-[10px] text-slate-500 uppercase">Automation Capability</div>
                          <div className="text-xs font-bold text-cyan-400">{selectedStep.automationScore}%</div>
                        </div>
                        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-3">
                           <div className="h-full bg-cyan-400" style={{width: `${selectedStep.automationScore}%`}}></div>
                        </div>
                        <div className="space-y-2 font-mono text-xs text-slate-300">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Robot Type:</span>
                            <span className="text-white">{selectedStep.recommendedRobot || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">EOAT:</span>
                            <span className="text-white truncate max-w-[120px] text-right">{selectedStep.endOfArmTooling || "Standard"}</span>
                          </div>
                        </div>
                     </div>
                   )}

                   <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <div className="text-[10px] text-slate-500 uppercase mb-2">Robotic Parameters</div>
                      <div className="space-y-2 font-mono text-xs text-slate-300">
                        <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                          <span className="text-slate-500">Motion:</span>
                          <span className="text-white">{selectedStep.roboticMotion}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-slate-500">Hazard:</span>
                          <span className={selectedStep.hazardLevel === 'CRITICAL' ? 'text-red-400' : 'text-slate-300'}>{selectedStep.hazardLevel}</span>
                        </div>
                      </div>
                   </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 text-sm text-center py-10">
                   <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-dashed border-slate-700">
                     <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                   </div>
                   <p>Select a blueprint step or automation row to inspect robotic parameters.</p>
                 </div>
               )}
             </div>
             
             {/* System Status Log */}
             <div className="bg-black p-5 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-500 h-48 overflow-hidden relative shadow-inner">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black to-transparent pointer-events-none z-10"></div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>
                
                <div className="space-y-1.5 opacity-80">
                  <p>> SYSTEM_INIT... OK</p>
                  <p>> CONNECTED_TO_GEMINI_V2.5</p>
                  {result.citations?.length > 0 ? (
                    <p className="text-cyan-700">> GROUNDING_DATA_FOUND [{result.citations.length} SOURCES]</p>
                  ) : (
                    <p className="text-amber-900">> GROUNDING_DATA_MISSING... USING_INTERNAL_MODELS</p>
                  )}
                  {result && <p>> ANALYSIS_COMPLETE</p>}
                  {result && <p className="text-green-800">> STRATEGY_LOCKED: {result.circularStrategy.strategy}</p>}
                  {result.primaryAutomationChallenge && <p className="text-red-800">> WARN: {result.primaryAutomationChallenge.toUpperCase().replace(/\s/g, '_')}</p>}
                  <p className="animate-pulse text-cyan-500">> WAITING_FOR_OPERATOR_CMD...</p>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
