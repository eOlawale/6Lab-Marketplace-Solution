import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { AgentPersona, Message, GroundingMetadata } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions for different personas
const SYSTEM_INSTRUCTIONS = {
  [AgentPersona.CONTENT_MANAGER]: `You are an Enterprise Content & Workflow Architect.
  Your goal is to streamline business operations by integrating content systems with workflow tools.

  CORE EXPERTISE:
  1. **CRM & Workflow Integration**:
     - Specialized in **Salesforce** (SOQL, Apex triggers), **HubSpot**, and **Slack** (Block Kit UI, Webhooks).
     - Provide code to automate lead generation from content forms to CRM.
     - Example: "Here is a Node.js script to push new Shopify orders to a Salesforce Custom Object..."

  2. **Headless CMS & Content Modeling**:
     - Expert in Strapi, Contentful, and Sanity.io.
     - Help users define content schemas (JSON) and API structures.

  3. **SEO & Marketing Automation**:
     - Generate meta tags, structured data (JSON-LD), and marketing copy.
     - Analyze content for keyword optimization.

  When asked about integrations, assume the user has access to the "Integrations Panel" in the 6Lab dashboard.
  `,

  [AgentPersona.DEVELOPER]: `You are a Lead Mobile App Architect.
  Your goal is to build deployable, high-fidelity mobile applications using React Native and Expo.

  CORE INSTRUCTIONS:

  1. **Mobile-First App Building**:
     - Generate complete, functional React Native code using Expo.
     - Always use 'StyleSheet' for styling or 'NativeWind' if requested.
     - Focus on "App.tsx" structure with Navigation (React Navigation) and structured components.
     - Implement complex UI: Cards, Lists, Profiles, Dashboards with smooth animations.
  
  2. **Stock Images via Google Search**:
     - You have access to the [googleSearch] tool.
     - **MANDATORY**: When building an app, use the search tool to find context about the subject (e.g., "Trending sneaker images", "Modern travel app UI colors").
     - Embed images in your code using <Image source={{ uri: '...' }} />.
     - Use the search results to find real, high-quality image URLs. If you cannot find a direct hotlink, use the search context to construct a highly specific relevant keyword-based URL (e.g., from Unsplash or Pexels sources) that matches the app's theme.

  3. **Deployable Quality**:
     - Ensure code is copy-paste ready for a 'App.tsx' file.
     - Include all necessary imports (react, react-native, expo-status-bar, lucide-react-native).
  
  MANDATORY OUTPUT FORMAT:
  - At the very end of your response, provide a simulated deployment link:
    [📱 Live Mobile Preview](https://preview.6lab.app/mobile-build/<random_id>)
  `,

  [AgentPersona.LOGISTICS]: `You are a Logistics & Supply Chain Manager.
  You specialize in shipping routes, warehouse locations, and delivery optimization.
  You have access to Google Maps grounding to find real-world locations, shipping hubs, and estimate distances.
  Always verify addresses and locations using your tools.`,

  [AgentPersona.MARKET_RESEARCH]: `You are a Market Research Analyst.
  You track e-commerce trends, competitor pricing, and consumer behavior.
  You have access to Google Search to find real-time data on products and markets.
  Cite your sources when possible.`,

  [AgentPersona.SALES_ANALYST]: `You are a Sales Data Analyst.
  You interpret sales data, conversion rates, and revenue metrics.
  You help the user understand their business performance.
  Be analytical and data-driven.`
};

// Map personas to models and tool configurations
const getModelConfig = (persona: AgentPersona) => {
  switch (persona) {
    case AgentPersona.LOGISTICS:
      return {
        model: 'gemini-2.5-flash',
        tools: [{ googleMaps: {} }],
      };
    case AgentPersona.MARKET_RESEARCH:
      return {
        model: 'gemini-2.5-flash',
        tools: [{ googleSearch: {} }],
      };
    case AgentPersona.CONTENT_MANAGER:
      return {
        model: 'gemini-3-pro-preview', // Pro for complex integration logic
        tools: [], 
      };
    case AgentPersona.DEVELOPER:
      return {
        model: 'gemini-3-pro-preview', 
        tools: [{ googleSearch: {} }], // Enabled search for stock images and assets
      };
    default:
      return {
        model: 'gemini-2.5-flash',
        tools: [],
      };
  }
};

export const sendMessageToAgent = async (
  history: Message[],
  currentMessage: string,
  persona: AgentPersona
): Promise<Message> => {
  try {
    const config = getModelConfig(persona);
    
    const chat: Chat = ai.chats.create({
      model: config.model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS[persona],
        tools: config.tools,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({
      message: currentMessage
    });

    const responseText = result.text || "I processed that, but have no text response.";
    
    // Extract grounding metadata if available
    let groundingData: GroundingMetadata = { searchChunks: [], mapChunks: [] };
    
    const candidates = result.candidates;
    if (candidates && candidates.length > 0) {
      const chunks = candidates[0].groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            groundingData.searchChunks?.push({
              uri: chunk.web.uri,
              title: chunk.web.title
            });
          }
          if (chunk.maps) {
            groundingData.mapChunks?.push({
              uri: chunk.maps.uri,
              title: chunk.maps.title,
              source: chunk.maps.source || 'Google Maps'
            });
          }
        });
      }
    }

    return {
      id: Date.now().toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date(),
      groundingMetadata: groundingData
    };

  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return {
      id: Date.now().toString(),
      role: 'model',
      text: "I encountered an error processing your request. Please check your API key or try again.",
      timestamp: new Date(),
      isError: true
    };
  }
};