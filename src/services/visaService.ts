import { OpenAI } from 'openai';
import { countries } from 'country-data';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

interface VisaRequirement {
  type: string;
  requirements: string[];
  processingTime: string;
  validity: string;
  fees: string;
}

interface EntryRules {
  visaRequirement: VisaRequirement;
  healthRequirements: string[];
  customsRegulations: string[];
  travelRestrictions: string[];
  requiredDocuments: string[];
}

export const getVisaAndEntryRules = async (
  fromCountry: string,
  toCountry: string
): Promise<EntryRules> => {
  try {
    const countryInfo = countries[toCountry];
    
    // Get up-to-date visa and entry requirements using GPT
    const response = await openai.chat.completions.create({
      model: "gpt-4.5-preview-2025-02-27",
      messages: [
        {
          role: "system",
          content: "You are a travel visa and entry requirements expert. Provide accurate and current information."
        },
        {
          role: "user",
          content: `What are the current visa and entry requirements for a citizen of ${fromCountry} traveling to ${toCountry}?`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    // Parse the GPT response
    const requirements = JSON.parse(response.choices[0].message.content);

    return {
      visaRequirement: {
        type: requirements.visaType,
        requirements: requirements.visaRequirements,
        processingTime: requirements.processingTime,
        validity: requirements.validity,
        fees: requirements.fees
      },
      healthRequirements: requirements.healthRequirements,
      customsRegulations: requirements.customsRegulations,
      travelRestrictions: requirements.travelRestrictions,
      requiredDocuments: requirements.requiredDocuments
    };
  } catch (error) {
    console.error('Error fetching visa requirements:', error);
    throw error;
  }
};

export default {
  getVisaAndEntryRules
};