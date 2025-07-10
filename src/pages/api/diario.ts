import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

const DIARIO_FILE = path.join(process.cwd(), 'src', 'data', 'diario.json');

interface DiarioEntry {
  id: string;
  content: string;
  timestamp: string;
  date: string;
}

// Asegurar que el directorio y archivo existan
async function ensureDiarioFile() {
  const dir = path.dirname(DIARIO_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  
  try {
    await fs.access(DIARIO_FILE);
  } catch {
    await fs.writeFile(DIARIO_FILE, JSON.stringify([], null, 2));
  }
}

// Leer entradas del diario
async function readDiario(): Promise<DiarioEntry[]> {
  await ensureDiarioFile();
  const data = await fs.readFile(DIARIO_FILE, 'utf-8');
  return JSON.parse(data);
}

// Escribir entradas del diario
async function writeDiario(entries: DiarioEntry[]) {
  await ensureDiarioFile();
  await fs.writeFile(DIARIO_FILE, JSON.stringify(entries, null, 2));
}

export const GET: APIRoute = async () => {
  try {
    const entries = await readDiario();
    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al leer el diario' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'El contenido es requerido' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const entries = await readDiario();
    const now = new Date();
    const newEntry: DiarioEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content: content.trim(),
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    entries.unshift(newEntry); // Agregar al inicio (más reciente primero)
    await writeDiario(entries);

    return new Response(JSON.stringify(newEntry), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear la entrada' }), {
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

    const entries = await readDiario();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length === entries.length) {
      return new Response(JSON.stringify({ error: 'Entrada no encontrada' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    await writeDiario(filteredEntries);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al eliminar la entrada' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 