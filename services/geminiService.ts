
import { GoogleGenAI, Type } from "@google/genai";
import { Address } from '../types';

// Fix: The API key must be obtained from `process.env.API_KEY` as per coding guidelines, which resolves the TypeScript error.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function extractAddressesFromImage(
  base64Image: string,
  mimeType: string
): Promise<Address[]> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an expert OCR and data extraction tool specializing in German administrative documents.
    Analyze the provided image, which is a "Begehungsplan" (inspection plan), and extract all address rows into a structured JSON array.

    Each object in the array must represent a single row from the document's table and have the following keys:
    - "plz": The postal code from the 'PLZ' column. This should be a string.
    - "street": The street name from the 'Straße, Platz usw.' column.
    - "houseNumbers": A single string containing all house numbers and identifiers from the 'HNr' column for that row.
    - "city": The city or locality from the 'Ort' column.

    Rules:
    1. Accurately transcribe all data, paying close attention to special German characters (e.g., ä, ö, ü, ß).
    2. Ignore the document's main title, header metadata (like NL, ZSPL, Datum, etc.), and the table column headers.
    3. Ensure the output is only the raw JSON array. Do not include any explanatory text, markdown formatting like \`\`\`json, or any other content outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              plz: { type: Type.STRING },
              street: { type: Type.STRING },
              houseNumbers: { type: Type.STRING },
              city: { type: Type.STRING },
            },
            required: ["plz", "street", "houseNumbers", "city"],
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const extractedData = JSON.parse(jsonText);

    if (!Array.isArray(extractedData) || extractedData.some(item => !item.street)) {
        throw new Error("The AI returned data in an unexpected format.");
    }

    return extractedData as Address[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to extract addresses from the image. The AI model may be temporarily unavailable or the image format is not supported.");
  }
}