import React from 'react'
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
const Home = () => {

  // const [searchQuery, setSearchQuery] = useState("");

  // const handleSearch = async () => {
  //   try{

  //     const apiKey = "3693e400eeed619c5516f1126ed0e659";
  //     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=Metric&appid=${apiKey}`;

  //     const response = await fetch(apiUrl);
  //     const data = await response.json();

  //   }catch(error){
  //     console.log("Error: ", error);
  //   }
  // }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header/>
    <div className='flex-grow flex items-center justify-center'>
      <div className='max-w-6xl mx-auto'>
      <div className='text-center'>
      <h1 className='text-5xl text-slate-400 mb-4 font-sans font-semibold'>Weather Insights at Your Fingertips</h1>
      {/* <form className='mb-4'>
        <input type='text' placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='p-2 border border-gray-300 rounded-md w-64'/>
  </form> */}
      <Link to={"/weather-info"}>
        <button className='bg-amber-500 text-white text-4xl px-10 py-3 rounded-md uppercase hover:opacity-90 mt-5'>GO</button>
      </Link>
      </div>
      </div>
    </div>
    </div>
  )
}

export default Home;