import {Link} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {useHistory} from 'react-router-dom';


/**Navigation */
const TopNav = () => {

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({ ...state }));

  const navigate = useNavigate();

  const logout = () => {
      dispatch({
        type: "LOGOUT",
        payload: null, 
      });
      console.log('deleting auth');
      window.localStorage.removeItem("auth");

      
      
      console.log('auth deleted');
      navigate('/login');
    }

  return(
    <div className="nav bg-light d-flex justify-content-between">
      
      <Link className="nav-link" to="/">
        
      <img src = 'https://www.pngitem.com/pimgs/m/176-1760489_svg-library-download-wave-hatenylo-com-png-transparent.png' alt="Home-logo" width="70"
              height="50"/>

      </Link>
      
      {auth !== null && (
        <a className="nav-link pointer" onClick = {logout} > Logout </a> 
      )}

      {auth === null && (
      <> 
      <Link className="nav-link" to="/login">Login</Link>
      <Link className="nav-link" to="/register">Register</Link> 
      </>)
      }
    </div>
  );
}

  
  export default TopNav;