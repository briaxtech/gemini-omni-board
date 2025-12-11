import { GoogleGenerativeAI } from "@google/generative-ai";
import { blobToBase64 } from "../utils/drawUtils";

// Vite replaces process.env.API_KEY with the value from define in vite.config.ts
const apiKey = process.env.API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const FALLBACK_IDEAS = [
  "¡Koki, dibuja un Creeper de Minecraft explotando de risa! 🟩💥",
  "¿Qué tal un autobús de batalla de Fortnite con ruedas de pizza? 🍕🚌",
  "Imagina a tu personaje de Roblox ganando una carrera en Rocket League. 🏎️🏆",
  "¡Dibuja a un Fall Guy intentando no caerse de un arcoíris! 🌈👑",
  "Dibuja el coche más rápido de Rocket League volando por el espacio. 🚀✨",
  "¡Haz una espada de diamante de Minecraft pero de fuego! 🔥⚔️",
  "Imagina una skin legendaria para ti, ¡dibújala! 👕🎨",
  "¿Cómo sería una mansión de Roblox en la vida real? 🏠😲",
  "Dibuja una victoria magistral con confeti de colores. 🏆🎉",
  "¡Un cerdo de Minecraft conduciendo un coche de Rocket League! 🐷🚗"
];

const FALLBACK_ERRORS = [
  "Ups, mi radar de gamer falló. ¿Probamos otra vez? 🎮📡",
  "¡Lag! No te escuché bien, Koki. Repítelo, crack. 📶⚠️",
  "Mis circuitos se cruzaron. ¡Dame otra oportunidad! 🤖⚡",
  "No pude procesar esa jugada maestra. ¿De nuevo? 🔁🕹️",
  "¡Vaya glitcheo! Intenta enviarlo otra vez. 🐛💻"
];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const analyzeDrawing = async (imageBlob: Blob, promptText: string): Promise<string> => {
  // If no API key is set, simulate a delay and return a creative error/placeholder
  if (!apiKey) {
    await new Promise(r => setTimeout(r, 1000));
    return "Koki, parece que no tengo mi llave maestra (API Key). ¡Dile a un adulto que nos ayude a conectarnos para jugar! 🔑🎮";
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
        text: "Eres Pepito, un asistente creativo 'Gamer' y compañero de arte. Estás entrenado con las mejores prácticas de psicopedagogía pero con un estilo fresco.\n\n**PERFIL DE KOKI (8 AÑOS):**\n- Le encanta: **Minecraft**, **Roblox**, **Fortnite**, **Fall Guys** y **Rocket League**.\n- Es un 'crack' dibujando y le gusta que le hablen como a un compañero de equipo, no como a un bebé.\n\nTus principios son:\n1. **Estilo Gamer/Youtuber**: Usa términos como 'pro', 'noob', 'loot', 'skin', 'victoria magistral', 'glitch', 'spawnear'. Sé muy entusiasta.\n2. **Refuerzo Positivo ('Growth Mindset')**: Valora el esfuerzo. '¡Esa construcción te quedó épica!'.\n3. **Andamiaje**: Da consejos de arte usando metáforas de juegos.\n4. **Seguridad**: Temas sanos. Si menciona Fortnite/armas, enfócate en la estrategia, construcción o skins, no en la violencia.\n\nResponde siempre en Español. Dirígete a él como 'Koki'. Sé breve (max 2-3 frases), divertido y usa emojis gamers."
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
    const result = await model.generateContent("Dame una idea corta y súper creativa para que Koki (8 años, fan de Minecraft, Roblox, Fortnite, Rocket League) dibuje. Algo 'pro' pero divertido. Una sola frase en Español. Dirígete a él por su nombre.");
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getRandom(FALLBACK_IDEAS);
  }
};