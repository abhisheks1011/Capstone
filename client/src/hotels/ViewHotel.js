import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { read, diffDays, isAlreadyBooked, bookHotel } from "../actions/hotel";
import { getSessionId } from "../actions/stripe";
import moment from "moment";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const ViewHotel = ({ match, history }) => {
  const [hotel, setHotel] = useState({});
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [show, setShow] = useState(false)
  const [success, setSuccess] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [orderID, setOrderID] = useState();

  const { auth } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadSellerHotel();
  }, []);

  const loadSellerHotel = async () => {
    let res = await read(match.params.hotelId);
    setHotel(res.data);
    setImage(res.data.image.link);
    if (auth && auth.token) {
      isAlreadyBooked(auth.token, match.params.hotelId).then((res) => {
        if (res.data){
          setAlreadyBooked(true)
        } ;
      });
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!auth || !auth.token) {
      history.push("/login");
      setLoading(true);
    } else {
      setShow(true)
    }
  };

  // creates a paypal order
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: hotel.name,
            amount: {
              currency_code: "CAD",
              value: hotel.price,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        setOrderID(orderID);
        return orderID;
      });
  };
  // check Approval
  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const data = JSON.parse(window.localStorage.getItem('auth'))
      bookHotel(data.token,data.user._id,hotel._id,details).then(
        res=>{
          history.push('/dashboard')
        }
      )
    });
  };
  //capture likely error
  const onError = (data, actions) => {
    console.log("on error block executed")
    setErrorMessage("An Error occured with your payment ");
  };

  return (
    <>  <PayPalScriptProvider
      options={{
        "client-id": "test",
        currency: "CAD"
      }}
    >
      <div className="container-fluid bg-secondary p-5 text-center">
        <h1>{hotel.title}</h1>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <br />
            <img src={image} alt={hotel.title} className="img img-fluid m-2" />
          </div>

          <div className="col-md-6">
            <br />
            <b>{hotel.content}</b>
            <p className="alert alert-info mt-3">${hotel.price}</p>
            <p className="card-text">
              <span className="float-right text-primary">
                for {diffDays(hotel.from, hotel.to)}{" "}
                {diffDays(hotel.from, hotel.to) <= 1 ? " day" : " days"}
              </span>
            </p>
            <p>
              From <br />{" "}
              {moment(new Date(hotel.from)).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <p>
              To <br />{" "}
              {moment(new Date(hotel.to)).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <i>Posted by {hotel.postedBy && hotel.postedBy.name}</i>
            <br />
            {show ? (
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={createOrder}
                onApprove={onApprove}
              />
            ) : <button
              onClick={handleClick}
              className="btn btn-block btn-lg btn-primary mt-3"
              disabled={loading || alreadyBooked}
            >
              {loading
                ? "Loading..."
                : alreadyBooked
                  ? "Already Booked"
                  : auth && auth.token
                    ? "Book Now"
                    : "Login to Book"}
            </button>}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
    </>
  );
};

export default ViewHotel;
