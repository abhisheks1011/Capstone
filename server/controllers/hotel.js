import Hotel from "../models/hotel";
import Order from "../models/order";
import fs from "fs";
const axios = require('axios')
const datetime = require('node-datetime')
const timestamp = require('time-stamp');
export const create = async (req, res) => {
  //   console.log("req.fields", req.fields);
  //   console.log("req.files", req.files);
  try {
    let fields = req.fields;
    let files = req.files;

    let hotel = new Hotel(fields);
    hotel.postedBy = req.user._id;
    // handle image
    if (files.image) {
      hotel.image.data = fs.readFileSync(files.image.path);
      hotel.image.contentType = files.image.type;
    }

    hotel.save((err, result) => {
      if (err) {
        console.log("saving hotel err => ", err);
        res.status(400).send("Error saving");
      }
      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

export const hotels = async (req, res) => {
  const { user } = req.query
  console.log("user in search", user)
  let all = await Hotel.find({ isBooked: false, searchedBy: user }).exec();
  console.log("all API executed", all);
  res.json(all);
};

export const image = async (req, res) => {
  let hotel = await Hotel.findById(req.params.hotelId).exec();
  if (hotel && hotel.image && hotel.image.data !== null) {
    res.set("Content-Type", hotel.image.contentType);
    return res.send(hotel.image.data);
  }
};

export const sellerHotels = async (req, res) => {
  let all = await Hotel.find({ postedBy: req.user._id })
    .select("-image.data")
    .populate("postedBy", "_id name")
    .exec();
  // console.log(all);
  res.send(all);
};

export const remove = async (req, res) => {
  let removed = await Hotel.findByIdAndDelete(req.params.hotelId)
    .select("-image.data")
    .exec();
  res.json(removed);
};

export const read = async (req, res) => {
  let hotel = await Hotel.findById(req.params.hotelId)
    .populate("postedBy", "_id name")
    .select("-image.data")
    .exec();
  // console.log("SINGLE HOTEL", hotel);
  res.json(hotel);
};

export const update = async (req, res) => {
  try {
    let fields = req.fields;
    let files = req.files;

    let data = { ...fields };

    if (files.image) {
      let image = {};
      image.data = fs.readFileSync(files.image.path);
      image.contentType = files.image.type;

      data.image = image;
    }

    let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, {
      new: true,
    }).select("-image.data");

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(400).send("Hotel update failed. Try again.");
  }
};

export const userHotelBookings = async (req, res) => {
  const all = await Order.find({ orderedBy: req.user._id })
    .select("session")
    .populate("hotel", "-image.data")
    .populate("orderedBy", "_id name")
    .exec();
  res.json(all);
};

export const isAlreadyBooked = async (req, res) => {
  const { hotelId } = req.params;
  const hotelDetails = await Hotel.findById(hotelId).exec()
  if (hotelDetails.isBooked == true) {
    res.json(true)
  } else {
    res.json(false)
  }
  // find orders of the currently logged in user
  //const userOrders = await Order.find({ orderedBy: req.user._id })
  //  .select("hotel")
  //  .exec();
  //// check if hotel id is found in userOrders array
  //let ids = [];
  //for (let i = 0; i < userOrders.length; i++) {
  //  ids.push(userOrders[i].hotel.toString());
  //}
  //res.json({
  //  ok: ids.includes(hotelId),
  //});
};

export const bookHotel = async (req, res) => {
  const { hotelId, userId } = req.query
  const session_data = req.body
  const newOrder = await new Order({
    hotel: hotelId,
    session: session_data,
    orderedBy: userId
  }).save();
  const result = await Hotel.findByIdAndUpdate(hotelId, { isBooked: true }).exec()
  res.json(result)

}

export const searchListings = async (req, res) => {
  const { location, date, bed, user } = req.query;
  const region_search = {
    method: 'GET',
    url: 'https://hotels-com-provider.p.rapidapi.com/v2/regions',
    params: { query: req.query.location, locale: 'en_CA', domain: "CA" },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
    }
  }
  axios.request(region_search).then(function (resp1) {
    const date1 = date.split(",");
    const hotel_search = {
      method: 'GET',
      url: 'https://hotels-com-provider.p.rapidapi.com/v2/hotels/search',
      params: {
        checkin_date: date1[0],
        checkout_date: date1[1],
        sort_order: 'REVIEW',
        region_id: resp1.data.data[0].gaiaId,
        adults_number: bed,
        domain: "CA",
        locale: 'en_CA',
        currency: 'USD',
        children_ages: '4,0,15',
        price_min: '10',
        star_rating_ids: '3,4,5',
        accommodation_ids: '20,8,15,5,1',
        price_max: '500',
        page_number: '1',
        theme_ids: '14,27,25',
        amenity_ids: '527,2063',
        guest_rating_min: '8'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
      }
    };
    axios.request(hotel_search).then(function (response) {
      //console.log(response.data.propertySearchListings.length)
      const searchresult = []
      response.data.propertySearchListings.forEach((result) => {
        if (result.__typename == 'Property') {
          const tempResult = {}
          tempResult['title'] = result.name
          tempResult['starRating'] = result.star
          tempResult['price'] = result.price.lead.amount
          tempResult['currency'] = result.price.lead.currencyInfo.symbol
          tempResult['from'] = date1[0]
          tempResult['to'] = date1[1]
          tempResult['location'] = location
          tempResult['bed'] = bed
          tempResult['content'] = result.neighborhood.name
          tempResult['rooms'] = result.availability.available ? result.availability.minRoomsLeft : 0
          tempResult['image'] = {
            "contentType": "image/jpeg",
            "link": result.propertyImage.image.url
          }
          tempResult['searchedBy'] = user,
            tempResult['isBooked'] = false
          searchresult.push(tempResult)
        }
      })
      Hotel.insertMany(searchresult, { rawResult: true }).then(
        result => {
          res.json(result.ops)
        }
      ).catch(err => {
        throw error
      })
    }).catch(function (error) {
      throw error
    });

  }).catch(function (error) {
    console.log(error)
    res.status(400).json({ "msg": "No Hotels Found for provided location" })
  })
  // console.log(location, date, bed);
  // console.log(date);
  //// console.log(fromDate[0]);
  //let result = await Hotel.find({
  //  from: { $gte: new Date(fromDate[0]) },
  //  location,
  //})
  //  .select("-image.data")
  //  .exec();
  //console.log("SEARCH LISTINGS", result);
  //res.json({result});
};

/**
 * if you want to be more specific
 let result = await Listing.find({
  from: { $gte: new Date() },
  to: { $lte: to },
  location,
  bed,
})
 */
