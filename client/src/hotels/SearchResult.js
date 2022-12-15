import { useState, useEffect } from "react";
import queryString from "query-string";
import { Link } from "react-router-dom";
import Search from "../components/forms/Search";
import { searchListings } from "../actions/hotel";
import SmallCard from "../components/cards/SmallCard";

const SearchResult = () => {
  // state
  const [hotels, setHotels] = useState([]);
  // when component mounts, get search params from url and use to send search query to backend
  useEffect(() => {
    const { location, date, bed } = queryString.parse(window.location.search);
    if(window.localStorage.getItem('auth')){
      const data = JSON.parse(window.localStorage.getItem('auth'))
      searchListings( location, date, bed, data.user.email ).then((res) => {
        setHotels(res.data);
      });
    }else{
      console.log('auth not present')
      searchListings( location, date, bed, null ).then((res) => {
        setHotels(res.data);
      });
    }
  }, [hotels,window.location.search]);

  return (
    <>
      <div className="col">
        <br />
        <Search />
      </div>
      <div className="container">
        <div className="row">
          {hotels.map((h) => (
            <SmallCard key={h._id} h={h} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResult;
