import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const hotelSchema = new Schema(
  {
    title: {
      type: String,
      required: "Title is required",
    },
    content: {
      type: String,
      required: "Content is required",
      maxlength: 10000,
    },
    location: {
      type: String,
    },
    price: {
      type: Number,
      required: "Price is required",
      trim: true,
    },
    image: {
      contentType: {
        type: String,
        required: true
      },
      link: {
        type: String,
        required: true
      }
    },
    searchedBy: {
      type: String,
      required: false
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    bed: {
      type: Number,
    },
    rooms: {
      type: Number
    },
    currency: {
      type: String,
    },
    isBooked:{
      type:Boolean,
      default:false,
      required:true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
