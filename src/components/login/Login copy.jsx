import { useState } from "react";
import Loginimg from "../../assets/Images/Login.png";
import logo from "../../assets/Images/loginlogo.png";

import apple from "../../assets/Images/apple.png";
import google from "../../assets/Images/google.png";
import { Link } from "react-router-dom";
import Singup from "./Singup";

const Login = () => {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <section className="Login-sec">
                <div className="Login-main">
                    <div className="Login-form-box">
                        <div className="Login-form-logo">
                            <Link to="/">
                                <img src={logo} alt="Fly Arzan" />
                            </Link>
                        </div>
                        <div className="Login-form-tital">
                            <h2>Welcome 👋 </h2>
                            <p>please enter your details</p>
                        </div>
                        <div className="Login-form-group">
                            <div className="Login-form-group-box">
                                <div className="Login-form-input-group">
                                    <label htmlFor="">Email Address/User Name</label>
                                    <input type="text" placeholder="info@example.com" />
                                </div>
                                <div className="Login-form-input-group">
                                    <label htmlFor="">Password</label>
                                    <input type="Password" placeholder="**************" />
                                </div>
                            </div>
                            <div className="Login-form-Forgot-box">
                                <div className="Remember-box">
                                    <input type="checkbox" />
                                    <p>Remember Me</p>
                                </div>
                                <a>Forgot Password?</a>
                            </div>
                            <div className="Login-form-btn">
                                <button>Login</button>
                            </div>
                            <div className="Or-box">
                                <div className="Or-line"></div>
                                <h2>Or Continue With</h2>
                                <div className="Or-line"></div>
                            </div>
                            <div className="google-btn-box">
                                <button type="button">
                                  <img src={google} alt="Continue with Google" />
                                </button>
                                <h2>or  </h2>
                                <button type="button">
                                  <img src={apple} alt="Continue with Apple" />
                                </button>
                            </div>
                            <div className="an-account-box">
                            <p>
          Don’t have an account?{" "}
          <Link onClick={() => setShowSignup(true)}>Sign Up</Link>
        </p>

                            </div>




      {/* Signup Popup */}
      {showSignup && (
        <div className="popup-overlay">
          <div className="popup-main-box">
            <button className="close-btn" onClick={() => setShowSignup(false)}>✖</button>
            <Singup />
            <div className="an-account-box">
            <p>
              Already have an account?{" "}
              <Link className="popup-link" onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}>
                Login
                </Link>
            </p>

            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLogin && (
        <div className="popup-overlay">
          <div className="popup-main-box">
            <button className="close-btn" onClick={() => setShowLogin(false)}>✖</button>
            <Login />
          </div>
        </div>
      )}
                        </div>

                    </div>

                    
                </div>




                
         
            </section>
        </>
    )



}


export default Login