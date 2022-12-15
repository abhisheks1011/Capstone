import { currencyFormatter } from "../../actions/stripe";
import { diffDays } from "../../actions/hotel";
import { useHistory, Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

const SmallCard = ({
  h,
  handleHotelDelete = (f) => f,
  owner = false,
  showViewMoreButton = true,
}) => {
  const history = useHistory();
  return (
    <>
         <div className="col-lg-4 col-md-6"> 
         <CardGroup> 
        <Card className="text-center m-1">
            {h.image && h.image.contentType ? (
              <img
                src={h.image.link}
                alt="default hotel image"
                className="card-image img img-fluid"
              />
            ) : (
              <img
                src="https://via.placeholder.com/900x500.png?text=MERN+Booking"
                alt="default hotel image"
                className="card-image img img-fluid"
              />
            )}
         <Card.Body>
        <Card.Title>
                {h.title}{" "}
                <span className="float-right text-primary">
                  {currencyFormatter({
                    amount: h.price*100,
                    currency: "CAD",
                  })}
                </span>{" "}</Card.Title>
      
                <Card.Text>{h.location}</Card.Text>
                <Card.Text>{h.content}</Card.Text>
             
                <Card.Text> <span>
                  for {diffDays(h.from, h.to)}{" "}
                  {diffDays(h.from, h.to) <= 1 ? " day" : " days"}
                </span></Card.Text>
              
                <Card.Text>{h.bed} bed</Card.Text>
                <Card.Text>
                Available from {new Date(h.from).toLocaleDateString()}
                </Card.Text>

              <div className="d-flex justify-content-between h4">
                {showViewMoreButton && (
                  <button
                    onClick={() => history.push(`/hotel/${h._id}`)}
                    className="btn btn-primary"
                  >
                    Show more
                  </button>
                )}
                {owner && (
                  <>
                    <Link to={`/hotel/edit/${h._id}`}>
                      <EditOutlined className="text-warning" />
                    </Link>
                    <DeleteOutlined
                      onClick={() => handleHotelDelete(h._id)}
                      className="text-danger"
                    />
                  </>
                )}
              </div>
           </Card.Body>
           </Card>
           </CardGroup>  
           </div>
    </>
  );
};

export default SmallCard;
