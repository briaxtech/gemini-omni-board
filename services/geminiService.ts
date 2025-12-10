import { GoogleGenerativeAI } from "@google/generative-ai";
import { blobToBase64 } from "../utils/drawUtils";

// Vite replaces process.env.API_KEY with the value from define in vite.config.ts
const apiKey = process.env.API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const FALLBACK_IDEAS = [
  "Koki, ¡dibuja un perro astronauta en la luna! 🐶🌕",
  "¿Qué tal si dibujas un castillo hecho de helado? 🍦🏰",
  "Dibuja tu superhéroe favorito salvando un gatito. 🦸‍♂️🐱",
  "¡Imagina un coche que puede volar! Dibújalo. 🚗✈️",
  "Dibuja un bosque mágico con árboles de colores. 🌳🌈",
  "Trata de dibujar un robot cocinando una pizza. 🤖🍕",
  "Dibuja el animal más raro que puedas imaginar. 🦄🐉",
  "¡Koki, dibuja cómo te sientes hoy con colores! 🎨😊",
  "Dibuja una casa bajo el mar. 🏠🌊",
  "¡Haz un dibujo de tu familia convertida en dibujos animados! 👨‍👩‍👧‍👦✏️"
];

const FALLBACK_ERRORS = [
  "Uy Koki, se me empañaron las gafas mágicas. ¿Lo intentamos de nuevo? 👓✨",
  "¡Vaya! Mi cerebro de robot está un poco dormido. Dímelo otra vez. 🤖💤",
  "Koki, no pude escuchar tu dibujo. ¡Intenta enviarlo de nuevo! 👂🎨",
  "Parece que hay nubes en mi conexión mágica. Prueba otra vez. ☁️📶",
  "¡Ups! Me distraje persiguiendo una mariposa digital. ¿Qué decías? 🦋💻"
];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const analyzeDrawing = async (imageBlob: Blob, promptText: string): Promise<string> => {
  // If no API key is set, simulate a delay and return a creative error/placeholder
  if (!apiKey) {
    await new Promise(r => setTimeout(r, 1000));
    return "Koki, parece que no tengo mi llave mágica (API Key) configurada. Pide ayuda a un adulto para arreglarlo. 🔑🔧";
  }

  try {
    const base64Data = await blobToBase64(imageBlob);

    // Increase creativity with higher temperature
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      }
    });

    const result = await model.generateContent([
      promptText || "Describe qué ves en el dibujo de Koki.",
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png"
        }
      },
      {
        text: "Eres Pepito, un asistente creativo y compañero de arte para niños. Estás entrenado con las mejores prácticas de psicopedagogía.\n\nTus principios son:\n1. **Refuerzo Positivo**: Valora el esfuerzo y la imaginación, no solo el resultado. Usa 'Growth Mindset' ('¡Veo que te has esforzado mucho!').\n2. **Andamiaje (Scaffolding)**: Si Koki no sabe qué dibujar, dale pistas paso a paso, no la solución completa.\n3. **Inteligencia Emocional**: Pregunta cómo se siente el dibujo o qué historia cuenta.\n4. **Seguridad**: Promueve temas sanos, naturaleza, amistad y valores.\n\nResponde siempre en Español. Dirígete a él como 'Koki'. Sé breve, muy entusiasta y usa emojis."
      }
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getRandom(FALLBACK_ERRORS);
  }
};

export const generateIdea = async (): Promise<string> => {
  if (!apiKey) {
    await new Promise(r => setTimeout(r, 500));
    return getRandom(FALLBACK_IDEAS);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Dame una idea corta y creativa para que Koki (un niño) dibuje en una pizarra blanca. Algo divertido y visual en una sola frase en Español. Dirígete a él por su nombre.");
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getRandom(FALLBACK_IDEAS);
  }
};