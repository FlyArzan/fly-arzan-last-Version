import React from "react";
import { Helmet } from "react-helmet-async";
import Loginimg from "../../assets/Images/Login.png";
import logo from "../../assets/Images/loginlogo.png";

import apple from "../../assets/Images/apple.png";
import google from "../../assets/Images/google.png";
import { Link } from "react-router-dom";

const Singup = () => {


  return (
    <>
      <Helmet>
        <title>Sign Up | FlyArzan</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="Login-sec">
        <div className="Login-main">
          <div className="Login-form-box">
            <div className="Login-form-logo">
              <Link to="/">
                <img src={logo} alt="Fly Arzan" />
              </Link>
            </div>

            <div className="Login-form-tital">
              <h2>Sign up your account 👋 </h2>

            </div>
            <div className="Login-form-group">
              <div className="Login-form-group-box">

                <div className="Login-form-input-group more-group-with">
                  <label htmlFor="">Name</label>
                  <input type="text" placeholder="John doe" />
                </div>

                <div className="Login-form-input-group more-group-with">
                  <label htmlFor="">Email</label>
                  <input type="Email" placeholder="Info@gmail.com" />
                </div>

                <div className="Login-form-input-group more-group-with">
                  <label htmlFor="">Password</label>
                  <input type="Password" placeholder="**************" />
                </div>

                <div className="Login-form-input-group more-group-with">
                  <label htmlFor="">Contact</label>
                  <input type="number" placeholder="09812761" />
                </div>

                <div className="Login-form-input-group more-group-with">
                  <label htmlFor="">Date Of Birth</label>
                  <input type="Date" placeholder="Date" />
                </div>

                <div className="Login-form-input-group more-group-with">
                  <label htmlFor="">Gender</label>
                  <input type="text" placeholder="Physiotherapist" />
                </div>
              </div>

              <div className="Login-form-Forgot-box">
                <div className="Remember-box more-withd-Forgot">
                  <input type="checkbox" />
                  <p>I agree to platforms <a>Terms of Service</a> and <a >Privacy Policy</a></p>
                </div>

              </div>
              <div className="Login-form-btn">
                <Link to="/Login">
                <button>Create Account</button>
                </Link>
        
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
              {/* <div className="an-account-box">
                <p>Already have an account<Link to="/login">Log in</Link></p>
              </div> */}
            </div>

          </div>


        </div>
      </section>
    </>
  )



}


export default Singup