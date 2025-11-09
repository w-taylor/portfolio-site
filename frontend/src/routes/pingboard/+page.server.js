export async function load({ fetch }) {
  try {
    // Use Docker service name for internal communication during SSR
    const response = await fetch('http://backend:3000/api/pingboard/services');
    
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
