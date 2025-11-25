
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeDisassembly = async (
  imageBase64: string, 
  pdfBase64?: string
): Promise<AnalysisResult> => {
  try {
    const parts: any[] = [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64
        }
      }
    ];

    if (pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: pdfBase64
        }
      });
    }

    const prompt = `
      You are DeconstructAI, a Circular Economy Architect and Robotic Process Automation (RPA) Engineer.
      
      INPUTS:
      1. Image of a device to process.
      2. (Optional) Technical Manual (PDF).

      YOUR TASKS:
      1. **IDENTIFY** the device strictly.
      2. **SEARCH THE WEB** (using googleSearch) for resale values, scrap prices, and disassembly guides.
      3. **DECIDE CIRCULAR STRATEGY**: Reuse, Remanufacture, or Recycle based on ROI.
      4. **PLAN AUTOMATION & VALIDATE**: 
         - Analyze every step for robotic feasibility (0-100 score).
         - **VALIDATION**: You MUST provide a "verificationNote" for each step explaining WHY a robot can do this (e.g., "Standard screw-driving process similar to smartphone assembly").
         - Assign specific robot types (Cobot, Industrial Arm, etc.) and End-of-Arm Tooling (EOAT).
         - Calculate the "Discipline Share": What % of the work is Mechanical Robotics, Chemical, Manual, vs Logistics.

      CRITICAL RULES:
      - If no data found on web, set 'dataQualityWarning' to 'NO_DATA_FOUND'.
      - **RANKING**: Ensure the steps are detailed enough to be ranked by automation score.
      - Output strictly valid JSON.

      JSON STRUCTURE:
      {
        "deviceName": "string",
        "complexityScore": number (1-10),
        "summary": "string",
        "dataQualityWarning": "string" | null,
        "circularStrategy": {
          "strategy": "REUSE" | "REPAIR" | "REMANUFACTURE" | "RECYCLE" | "DISPOSAL",
          "interventionType": "string",
          "confidenceScore": number (0-100),
          "economicViability": "PROFITABLE" | "BREAK_EVEN" | "LOSS",
          "reasoning": "string",
          "marketDemand": "LOW" | "MEDIUM" | "HIGH"
        },
        "disciplineBreakdown": {
          "roboticsAndAutomation": number, // Percentage (e.g. 45)
          "chemicalProcessing": number,   // Percentage (e.g. 20)
          "manualLabor": number,          // Percentage (e.g. 25)
          "logisticsAndTransport": number // Percentage (e.g. 10)
        },
        "primaryAutomationChallenge": "string (e.g. 'Flexible Cable Handling')",
        "steps": [
          {
            "stepId": number,
            "action": "string",
            "component": "string",
            "tool": "string",
            "roboticMotion": "string",
            "torqueLimit": number,
            "hazardLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "reasoning": "string (Physics/Geometry explanation)",
            "verificationNote": "string (Reference to standard industrial process for validation)",
            "automationScore": number, // 0-100 (100 is fully autonomous)
            "recommendedRobot": "INDUSTRIAL_ARM" | "COBOT" | "MOBILE_ROBOT" | "GANTRY_SYSTEM" | "HUMAN_ONLY",
            "endOfArmTooling": "string (e.g. Suction Cup, 2-Finger Gripper)",
            "timeEstimateSeconds": number
          }
        ],
        "materials": [
          {
            "material": "string",
            "percentage": number,
            "estimatedValueUsd": number,
            "recyclability": number
          }
        ],
        "generatedCode": "string (Python code)"
      }
    `;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4096 } // Increased budget for deep verification thinking
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    if (!jsonMatch) {
      console.error("Raw response:", text);
      throw new Error("Failed to parse JSON response from AI");
    }

    const result = JSON.parse(jsonMatch[1]) as AnalysisResult;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const citations = groundingChunks
      .map((chunk: any) => {
        if (chunk.web?.uri) {
          return { uri: chunk.web.uri, title: chunk.web.title || "Source Link" };
        }
        return null;
      })
      .filter((c: any) => c !== null);
    
    result.citations = citations;

    return result;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
