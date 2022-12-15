import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {Button, Container, Navbar} from 'react-bootstrap';
import '../index.css';

const TopNav = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({ ...state }));
  const history = useHistory();

  const logout = () => {
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    window.localStorage.removeItem("auth");
    history.push("/");
  };

  return (
    <>
    <Navbar expand="sm" className="navbackground">
      <Navbar.Brand >
        <Link className="nav-link d-flex align-items-center navbarcolor" to="/">
          <h1>Hotels</h1>
        </Link>
     </Navbar.Brand> 
     <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end nav">  
        {auth !== null && (
          <Link className="nav-link d-flex align-items-center navbarcolor" to="/dashboard">
            Dashboard
          </Link>
        )}

        {auth !== null && (
          <a className="nav-link pointer d-flex align-items-center navbarcolor" href="#" onClick={logout}>
            Logout
          </a>
        )}

        {auth === null && (
          <>
            <Link className="nav-link d-flex align-items-center navbarcolor" to="/login">
              Login
            </Link>
            <Link className="nav-link d-flex align-items-center navbarcolor" to="/register">
             Register
            </Link>
          </>
        )} 
      </Navbar.Collapse>
    </Navbar>
    </>
  );
};

export default TopNav;
