import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }) => {
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '6');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';

    // Obtener todos los posts
    const allPosts = await getCollection('blog');
    
    // Filtrar posts según búsqueda y categoría
    let filteredPosts = allPosts;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.data.title.toLowerCase().includes(searchLower) ||
        post.data.description.toLowerCase().includes(searchLower) ||
        post.data.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => 
        post.data.tags?.includes(category)
      );
    }

    // Ordenar por fecha
    filteredPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    // Calcular paginación
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const posts = filteredPosts.slice(start, end);

    // Formatear respuesta
    const formattedPosts = posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      tags: post.data.tags || [],
      slug: post.slug
    }));

    return new Response(JSON.stringify({
      posts: formattedPosts,
      totalPosts,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return new Response(JSON.stringify({
      error: 'Error al obtener los posts'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 