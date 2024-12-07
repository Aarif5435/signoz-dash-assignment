


export const FetchNews = async () => {
  try{
    const apikey = "8f6f9857c62340748b3fd1914f3e9f7d";
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apikey}`);
    
    if(!response.ok) throw new Error('Failed to fetch news')

    return response;

  }catch(err){
    throw new Error('something went wrong')
  }
}


export const FetchWeather = async (CITY='Delhi') => {
const API_KEY = '25dcf2151555f3f8251abb1031e425d4'
console.log('city---', CITY)
  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`)
    if(!response.ok) throw new Error('failed to fetch weather');
    
    return response;
  }catch(err){
      throw new Error('something went wrong')
  }
}


export const FetchStock = async (SYMBOL) => {

  const API_KEY = "ct80ruhr01qkgg0vgpfgct80ruhr01qkgg0vgpg0"

  try{
   const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${SYMBOL}&token=${API_KEY}`);
   if(!response.ok) throw new Error('failed to fetch weather');

   return response;
  }catch(err){
    throw new Error('something went wrong')
  }
}