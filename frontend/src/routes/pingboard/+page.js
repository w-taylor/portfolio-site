export async function load({ fetch }) {
  try {
    const baseUrl = import.meta.env.SSR 
      ? 'http://backend:3000'  // Docker internal (server-side)
      : '';                    // Same origin (client-side)

    const response = await fetch(`${baseUrl}/api/pingboard/services`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      loadedServices: data,
      loadError: null
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      loadedServices: [],
      loadError: 'Failed to fetch data from server'
    };
  }
}
