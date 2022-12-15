import { useState, useEffect } from "react";
import { allHotels } from "../actions/hotel";
import SmallCard from "../components/cards/SmallCard";
import Search from "../components/forms/Search";
import '../index.css';
import CardGroup from 'react-bootstrap/CardGroup';

const Home = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    loadAllhotels();
  }, []);

  const loadAllhotels = async () => {
    if(window.localStorage.getItem('auth')){
      const data = JSON.parse(window.localStorage.getItem('auth'))
      const user = data.user.email
      let res = await allHotels(user);
      setHotels(res.data);
    }else{
      const user = null
      let res = await allHotels(user);
      setHotels(res.data);
    }
  };

  return (
    <>
      <div className="showcase">
      <div class="container">
        <h1>Find your next stay</h1>
        <h3>Search hotels, homes, and much more...</h3>
      </div>
      </div>
      <div className="col">
        <br />
        <Search />
      </div>
      <div className="container-fluid">
        <br />
        {/* <pre>{JSON.stringify(hotels, null, 4)}</pre> */}
        <CardGroup> 
        {hotels.map((h) => (
          <SmallCard key={h._id} h={h} />
        ))}
        </CardGroup>
      </div>
    </>
  );
};

export default Home;
