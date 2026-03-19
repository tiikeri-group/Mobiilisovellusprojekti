const BASE_URL = 'https://api.api-ninjas.com/v1/exercises'
const API_KEY = process.env.EXPO_PUBLIC_API_KEY


export const fetchFromApi = async (endpoint:string) => 
{
    if (!API_KEY) {
        console.error("API key is missing");
        throw new Error ("API key is missing")
    }
try {
    
    const url = `${BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY, 
        'Content-Type': 'application/json', 
      },
    });
        if (!response.ok) {
            throw new Error(`Api Request failed: ${response.status}`)
        }

return await response.json();
} catch (error){
    console.error(`Error fetchinc ${endpoint}:`,error)
    throw error;
}};