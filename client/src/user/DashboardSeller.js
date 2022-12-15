import { useState, useEffect } from "react";
import DashboardNav from "../components/DashboardNav";
import ConnectNav from "../components/ConnectNav";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
import { createConnectAccount } from "../actions/stripe";
import { sellerHotels, deleteHotel } from "../actions/hotel";
import { toast } from "react-toastify";
import SmallCard from "../components/cards/SmallCard";

const DashboardSeller = () => {
 // const { auth } = useSelector((state) => ({ ...state }));
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user,setUser] = useState({"name":"","email":""})

  useEffect(() => {
    //loadSellersHotels();
    const data=JSON.parse(window.localStorage.getItem('auth'))
    const newData = {"name":data.user.name,"email":data.user.email}
    setUser(newData)
  });

  //const loadSellersHotels = async () => {
  //  //let { data } = await sellerHotels(auth.token);
  //  //setHotels(data);
  //  const data=JSON.parse(window.localStorage.getItem('auth'))
  //  console.log(data.user)
  //  //setUser(data)
  //};

  //const handleClick = async () => {
  //  setLoading(true);
  //  try {
  //    let res = await createConnectAccount(auth.token);
  //    console.log(res); // get login link
  //    window.location.href = res.data;
  //  } catch (err) {
  //    console.log(err);
  //    toast.error("Stripe connect failed, Try again.");
  //    setLoading(false);
  //  }
  //};

  //const handleHotelDelete = async (hotelId) => {
  //  if (!window.confirm("Are you sure?")) return;
  //  deleteHotel(auth.token, hotelId).then((res) => {
  //    toast.success("Hotel Deleted");
  //    loadSellersHotels();
  //  });
  //};

  //const connected = () => (
  //  <div className="container-fluid">
  //    <div className="row">
  //      <div className="col-md-10">
  //        <h2>Your Hotels</h2>
  //      </div>
  //      <div className="col-md-2">
  //        <Link to="/hotels/new" className="btn btn-primary">
  //          + Add New
  //        </Link>
  //      </div>
  //    </div>
//
  //    <div className="row">
  //      {hotels.map((h) => (
  //        <SmallCard
  //          key={h._id}
  //          h={h}
  //          showViewMoreButton={false}
  //          owner={true}
  //          handleHotelDelete={handleHotelDelete}
  //        />
  //      ))}
  //    </div>
  //  </div>
  //);

  //const notConnected = () => (
  //  <div className="container-fluid">
  //    <div className="row">
  //      <div className="col-md-6 offset-md-3 text-center">
  //        <div className="p-5 pointer">
  //          <HomeOutlined className="h1" />
//
  //        </div>
  //      </div>
  //    </div>
  //  </div>
  //);

  return (
    <>
      <div className="container-fluid p-5">
        <ConnectNav />
      </div>

      <div className="container-fluid p-4">
        <DashboardNav />
      </div>

      <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <div className="p-5 pointer">
            <HomeOutlined className="h1" />
            <h4>Name : {user.name} </h4>
            <h4>Email : {user.email} </h4>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default DashboardSeller;
