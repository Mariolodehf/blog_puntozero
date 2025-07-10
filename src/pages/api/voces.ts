import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const VOCES_FILE = path.join(process.cwd(), 'src', 'data', 'voces.json');
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');

interface VozEntry {
  id: string;
  title: string;
  description: string;
  category: 'entrevista' | 'historia' | 'musica' | 'sonido' | 'conversacion';
  audioUrl: string;
  duration?: number;
  timestamp: string;
  date: string;
  author?: string;
}

// Asegurar que los directorios y archivos existan
async function ensureVocesFile() {
  const dir = path.dirname(VOCES_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  
  try {
    await fs.access(VOCES_FILE);
  } catch {
    await fs.writeFile(VOCES_FILE, JSON.stringify([], null, 2));
  }
}

// Asegurar que el directorio de audio exista
async function ensureAudioDir() {
  try {
    await fs.access(AUDIO_DIR);
  } catch {
    await fs.mkdir(AUDIO_DIR, { recursive: true });
  }
}

// Leer voces
async function readVoces(): Promise<VozEntry[]> {
  await ensureVocesFile();
  const data = await fs.readFile(VOCES_FILE, 'utf-8');
  return JSON.parse(data);
}

// Escribir voces
async function writeVoces(voces: VozEntry[]) {
  await ensureVocesFile();
  await fs.writeFile(VOCES_FILE, JSON.stringify(voces, null, 2));
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const voces = await readVoces();
    const category = url.searchParams.get('category');
    
    let filteredVoces = voces;
    if (category) {
      filteredVoces = voces.filter(voz => voz.category === category);
    }

    return new Response(JSON.stringify(filteredVoces), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al leer las voces' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const author = formData.get('author') as string;
    const audioFile = formData.get('audio') as File;

    if (!title || !description || !category || !audioFile) {
      return new Response(JSON.stringify({ error: 'Todos los campos son requeridos' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validar tipo de archivo
    if (!audioFile.type.startsWith('audio/')) {
      return new Response(JSON.stringify({ error: 'Solo se permiten archivos de audio' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Guardar archivo de audio
    await ensureAudioDir();
    const fileName = `${Date.now()}-${audioFile.name}`;
    const audioPath = path.join(AUDIO_DIR, fileName);
    const audioBuffer = await audioFile.arrayBuffer();
    await fs.writeFile(audioPath, Buffer.from(audioBuffer));

    // Crear nueva entrada
    const voces = await readVoces();
    const now = new Date();
    const newVoz: VozEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: description.trim(),
      category: category as VozEntry['category'],
      audioUrl: `/audio/${fileName}`,
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      author: author?.trim() || 'Anónimo'
    };

    voces.unshift(newVoz);
    await writeVoces(voces);

    return new Response(JSON.stringify(newVoz), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear la voz' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID es requerido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const voces = await readVoces();
    const vozToDelete = voces.find(voz => voz.id === id);
    
    if (!vozToDelete) {
      return new Response(JSON.stringify({ error: 'Voz no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Eliminar archivo de audio
    try {
      const audioPath = path.join(process.cwd(), 'public', vozToDelete.audioUrl);
      await fs.unlink(audioPath);
    } catch (error) {
      console.error('Error al eliminar archivo de audio:', error);
    }

    const filteredVoces = voces.filter(voz => voz.id !== id);
    await writeVoces(filteredVoces);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar la voz' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 