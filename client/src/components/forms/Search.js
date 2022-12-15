import React, { useState } from "react";
import { DatePicker, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AlgoliaPlaces from "algolia-places-react";
import moment from "moment";
import { useHistory } from "react-router-dom";


// destructure values from ant components
const { RangePicker } = DatePicker;
const { Option } = Select;

const config = {
  appId: process.env.REACT_APP_ALGOLIA_APP_ID,
  apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
  language: "en",
  // countries: ["au"],
};

const Search = () => {
  // state
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [bed, setBed] = useState("");
  // route
  const history = useHistory();

  const handleSubmit = () => {
    history.push(`/search-result?location=${location}&date=${date}&bed=${bed}`);
  };

  return (
    <div className="d-flex flex-row pb-4 m-3">
      <div className="w-100">
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => {setLocation(e.target.value)}}
          

      onSuggestions={({ rawAnswer, query, suggestions }) => 
      console.log(rawAnswer,query,suggestions)}
          style={{ height: "50px" }}
        />
      </div>

      <RangePicker
        onChange={(value, dateString) => setDate(dateString)}
        disabledDate={(current) =>
          current && current.valueOf() < moment().subtract(1, "days")
        }
        className="w-100"
      />

      <Select
        onChange={(value) => setBed(value)}
        className="w-100"
        size="large"
        placeholder="Number of beds"
      >
        <Option key={1}>{1}</Option>
        <Option key={2}>{2}</Option>
        <Option key={3}>{3}</Option>
        <Option key={4}>{4}</Option>
      </Select>

      <SearchOutlined
        onClick={handleSubmit}
        className="btn btn-primary p-3 btn-square"
      />
    </div>
  );
};

export default Search;
