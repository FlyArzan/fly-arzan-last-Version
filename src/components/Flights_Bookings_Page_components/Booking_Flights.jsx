import React from 'react'
import Flydubia from '../../assets/Images/fly-logo.png';

const Booking_Flights = () => {
  return (
    <section className='Flights_Booking_Sec'>
      <div className="container">
        <div className="Flights_Booking_main">
          <div className="Flights_Booking_Top">
            <div className="Contact--details">
              <div className="Contact--details--heading">
                <h3>Contact Details</h3>
              </div>
              <div className="Contact--details--body">
                <div className="details--body--inputs">
                  <div className="details--body--inputs--number">
                    <label htmlFor="">Mobile Number</label>
                    <input type="nmuber" placeholder='XXXXXX' />
                  </div>

                  <div className="details--body--inputs--Email">
                    <div className="inputs--Email--head">

                      <label htmlFor="">Email</label>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                        <g clipPath="url(#clip0_381_2669)">
                          <path d="M8.41016 -0.00585938C4.26491 -0.00585938 0.910156 3.34852 0.910156 7.49414C0.910156 11.6393 4.26453 14.9941 8.41016 14.9941C12.5554 14.9941 15.9102 11.6398 15.9102 7.49414C15.9102 3.34896 12.5558 -0.00585938 8.41016 -0.00585938ZM8.41016 13.9476C4.8517 13.9476 1.95667 11.0526 1.95667 7.49414C1.95667 3.93565 4.8517 1.04065 8.41016 1.04065C11.9686 1.04065 14.8636 3.93565 14.8636 7.49414C14.8636 11.0526 11.9686 13.9476 8.41016 13.9476Z" fill="#939393" />
                          <path d="M8.41056 6.24609C7.9663 6.24609 7.65039 6.43371 7.65039 6.71013V10.4714C7.65039 10.7084 7.9663 10.9453 8.41056 10.9453C8.83507 10.9453 9.18057 10.7084 9.18057 10.4714V6.71007C9.18057 6.43368 8.83507 6.24609 8.41056 6.24609Z" fill="#939393" />
                          <path d="M8.41106 3.92578C7.95693 3.92578 7.60156 4.25156 7.60156 4.62671C7.60156 5.00188 7.95696 5.33754 8.41106 5.33754C8.85532 5.33754 9.21075 5.00188 9.21075 4.62671C9.21075 4.25156 8.85529 3.92578 8.41106 3.92578Z" fill="#939393" />
                        </g>
                        <defs>
                          <clipPath id="clip0_381_2669">
                            <rect width="15" height="15" fill="white" transform="translate(0.910156 -0.00585938)" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span>(your ticket will be emailed here)</span>
                    </div>
                    <input type="email" placeholder='Enter your email' />
                  </div>

                </div>
              </div>
            </div>

            <div className="Booked_Flights_Details">
              <div className="Booking_Details_heading">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <g clipPath="url(#clip0_381_2568)">
                    <path d="M9.20861 0.974609H8.28754V1.89568C8.28754 2.07989 8.13403 2.2027 7.98052 2.2027C7.82701 2.2027 7.6735 2.07989 7.6735 1.89568V0.974609H2.76112V1.89568C2.76112 2.07989 2.6076 2.2027 2.45409 2.2027C2.30058 2.2027 2.14707 2.07989 2.14707 1.89568V0.974609H1.226C0.76546 0.974609 0.427734 1.37374 0.427734 1.89568V3.00097H10.2525V1.89568C10.2525 1.37374 9.69985 0.974609 9.20861 0.974609ZM0.427734 3.64572V9.26425C0.427734 9.81689 0.765461 10.1853 1.2567 10.1853H9.23932C9.73055 10.1853 10.2832 9.78619 10.2832 9.26425V3.64572H0.427734ZM3.16025 8.80371H2.42339C2.30058 8.80371 2.17777 8.71161 2.17777 8.5581V7.79054C2.17777 7.66773 2.26988 7.54492 2.42339 7.54492H3.19095C3.31376 7.54492 3.43657 7.63702 3.43657 7.79054V8.5581C3.40586 8.71161 3.31376 8.80371 3.16025 8.80371ZM3.16025 6.0405H2.42339C2.30058 6.0405 2.17777 5.94839 2.17777 5.79488V5.02732C2.17777 4.90451 2.26988 4.7817 2.42339 4.7817H3.19095C3.31376 4.7817 3.43657 4.87381 3.43657 5.02732V5.79488C3.40586 5.94839 3.31376 6.0405 3.16025 6.0405ZM5.61644 8.80371H4.84888C4.72607 8.80371 4.60326 8.71161 4.60326 8.5581V7.79054C4.60326 7.66773 4.69536 7.54492 4.84888 7.54492H5.61644C5.73925 7.54492 5.86206 7.63702 5.86206 7.79054V8.5581C5.86206 8.71161 5.76995 8.80371 5.61644 8.80371ZM5.61644 6.0405H4.84888C4.72607 6.0405 4.60326 5.94839 4.60326 5.79488V5.02732C4.60326 4.90451 4.69536 4.7817 4.84888 4.7817H5.61644C5.73925 4.7817 5.86206 4.87381 5.86206 5.02732V5.79488C5.86206 5.94839 5.76995 6.0405 5.61644 6.0405ZM8.07263 8.80371H7.30507C7.18226 8.80371 7.05945 8.71161 7.05945 8.5581V7.79054C7.05945 7.66773 7.15155 7.54492 7.30507 7.54492H8.07263C8.19544 7.54492 8.31825 7.63702 8.31825 7.79054V8.5581C8.31825 8.71161 8.22614 8.80371 8.07263 8.80371ZM8.07263 6.0405H7.30507C7.18226 6.0405 7.05945 5.94839 7.05945 5.79488V5.02732C7.05945 4.90451 7.15155 4.7817 7.30507 4.7817H8.07263C8.19544 4.7817 8.31825 4.87381 8.31825 5.02732V5.79488C8.31825 5.94839 8.22614 6.0405 8.07263 6.0405Z" fill="#353978" />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_2568">
                      <rect width="10.4388" height="10.4388" fill="white" transform="translate(0.121094 0.361328)" />
                    </clipPath>
                  </defs>
                </svg>
                <h3>04 Jan, 2025</h3>
              </div>
              <div className="Booking_Details_body">
                <div className="Booking_Details_body--right">
                  <div className="Booking_Details_body--right--img">
                    <img src={Flydubia} alt="flydubai airline logo" />
                  </div>
                  <div className="Booking_Details_body--right--details">
                    <span>
                      <p>flydubai</p>
                      <p>FZ-329</p>
                    </span>
                  </div>

                </div>
                <div className="Booking_Details_body--left">
                  <div className="Booking_Details_body--left--top">
                    <h2>07:45 PM </h2>
                    <h5>2h 5m</h5>
                    <h2>07:45 PM </h2>
                  </div>
                  <div className="Booking_Details_body--left--top">
                    <p>Dubai (DXB)</p>
                    <p>Nonstop</p>
                    <p>London (LDN)</p>
                  </div>
                  <div className="Booking_Details_body--left--top">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                        <g clipPath="url(#clip0_381_2554)">
                          <path d="M8.48881 2.99667H7.84512V1.05068C7.84512 0.590929 7.47107 0.216797 7.01124 0.216797H4.76434C4.30459 0.216797 3.93041 0.590929 3.93041 1.05068V2.99663H3.28677C2.88464 2.99663 2.55859 3.32267 2.55859 3.7248V9.22271C2.55859 9.62501 2.88472 9.95097 3.28677 9.95097H3.38441V10.4796C3.38441 10.5769 3.46326 10.6556 3.56036 10.6556H4.39307C4.49037 10.6556 4.5691 10.5768 4.5691 10.4796V9.95097H7.20627V10.4796C7.20627 10.5769 7.28521 10.6556 7.3823 10.6556H8.21493C8.31232 10.6556 8.39096 10.5768 8.39096 10.4796V9.95097H8.48873C8.89085 9.95097 9.2169 9.62492 9.2169 9.22271V3.72484C9.21698 3.32263 8.89094 2.99667 8.48881 2.99667ZM7.28907 2.99663H4.48625V1.05068C4.48625 0.897431 4.61096 0.772721 4.76421 0.772721H7.01111C7.16436 0.772721 7.28907 0.897431 7.28907 1.05068V2.99663Z" fill="#353978" />
                        </g>
                        <defs>
                          <clipPath id="clip0_381_2554">
                            <rect width="10.4388" height="10.4388" fill="white" transform="translate(0.667969 0.216797)" />
                          </clipPath>
                        </defs>
                      </svg>

                      <p>Total: 30kg</p>
                    </span>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                        <g clipPath="url(#clip0_381_2596)">
                          <path d="M5.28893 0.917969C5.08463 0.917969 4.91902 1.08486 4.91902 1.29078H4.91611V4.27331C4.91611 4.47921 4.74922 4.64612 4.54329 4.64612C4.33736 4.64612 4.17047 4.47921 4.17047 4.27331V1.29078H4.16756C4.16756 1.08486 4.00195 0.917969 3.79768 0.917969C3.59338 0.917969 3.42777 1.08486 3.42777 1.29078H3.42486V4.27331C3.42486 4.47921 3.25797 4.64612 3.05204 4.64612C2.84612 4.64612 2.67922 4.47921 2.67922 4.27331V1.29078C2.67922 1.08486 2.51361 0.917969 2.30932 0.917969C2.10503 0.917969 1.93942 1.08486 1.93942 1.29078H1.93359V5.01892C1.93359 5.47755 2.39373 5.87162 3.05204 6.04423V10.6111C3.05204 11.0229 3.38589 11.3568 3.79768 11.3568C4.20945 11.3568 4.54329 11.0229 4.54329 10.6111V6.04423C5.20161 5.87162 5.66174 5.47755 5.66174 5.01892V1.29078H5.65883C5.65883 1.08486 5.49322 0.917969 5.28893 0.917969Z" fill="#353978" />
                          <path d="M9.20258 0.917969C7.86424 0.917969 6.7793 3.25476 6.7793 6.13737C6.7793 6.39054 6.78767 6.63946 6.80387 6.88301H7.89773V10.6111C7.89773 11.0229 8.23157 11.3568 8.64336 11.3568C9.05515 11.3568 9.389 11.0229 9.389 10.6111V0.933173C9.32748 0.923095 9.26532 0.917969 9.20258 0.917969Z" fill="#353978" />
                        </g>
                        <defs>
                          <clipPath id="clip0_381_2596">
                            <rect width="10.4388" height="10.4388" fill="white" transform="translate(0.441406 0.917969)" />
                          </clipPath>
                        </defs>
                      </svg>

                      <p>No Meal</p>
                    </span>

                  </div>
                </div>
              </div>
              <div className="Booking_Details_heading">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <g clipPath="url(#clip0_381_2568)">
                    <path d="M9.20861 0.974609H8.28754V1.89568C8.28754 2.07989 8.13403 2.2027 7.98052 2.2027C7.82701 2.2027 7.6735 2.07989 7.6735 1.89568V0.974609H2.76112V1.89568C2.76112 2.07989 2.6076 2.2027 2.45409 2.2027C2.30058 2.2027 2.14707 2.07989 2.14707 1.89568V0.974609H1.226C0.76546 0.974609 0.427734 1.37374 0.427734 1.89568V3.00097H10.2525V1.89568C10.2525 1.37374 9.69985 0.974609 9.20861 0.974609ZM0.427734 3.64572V9.26425C0.427734 9.81689 0.765461 10.1853 1.2567 10.1853H9.23932C9.73055 10.1853 10.2832 9.78619 10.2832 9.26425V3.64572H0.427734ZM3.16025 8.80371H2.42339C2.30058 8.80371 2.17777 8.71161 2.17777 8.5581V7.79054C2.17777 7.66773 2.26988 7.54492 2.42339 7.54492H3.19095C3.31376 7.54492 3.43657 7.63702 3.43657 7.79054V8.5581C3.40586 8.71161 3.31376 8.80371 3.16025 8.80371ZM3.16025 6.0405H2.42339C2.30058 6.0405 2.17777 5.94839 2.17777 5.79488V5.02732C2.17777 4.90451 2.26988 4.7817 2.42339 4.7817H3.19095C3.31376 4.7817 3.43657 4.87381 3.43657 5.02732V5.79488C3.40586 5.94839 3.31376 6.0405 3.16025 6.0405ZM5.61644 8.80371H4.84888C4.72607 8.80371 4.60326 8.71161 4.60326 8.5581V7.79054C4.60326 7.66773 4.69536 7.54492 4.84888 7.54492H5.61644C5.73925 7.54492 5.86206 7.63702 5.86206 7.79054V8.5581C5.86206 8.71161 5.76995 8.80371 5.61644 8.80371ZM5.61644 6.0405H4.84888C4.72607 6.0405 4.60326 5.94839 4.60326 5.79488V5.02732C4.60326 4.90451 4.69536 4.7817 4.84888 4.7817H5.61644C5.73925 4.7817 5.86206 4.87381 5.86206 5.02732V5.79488C5.86206 5.94839 5.76995 6.0405 5.61644 6.0405ZM8.07263 8.80371H7.30507C7.18226 8.80371 7.05945 8.71161 7.05945 8.5581V7.79054C7.05945 7.66773 7.15155 7.54492 7.30507 7.54492H8.07263C8.19544 7.54492 8.31825 7.63702 8.31825 7.79054V8.5581C8.31825 8.71161 8.22614 8.80371 8.07263 8.80371ZM8.07263 6.0405H7.30507C7.18226 6.0405 7.05945 5.94839 7.05945 5.79488V5.02732C7.05945 4.90451 7.15155 4.7817 7.30507 4.7817H8.07263C8.19544 4.7817 8.31825 4.87381 8.31825 5.02732V5.79488C8.31825 5.94839 8.22614 6.0405 8.07263 6.0405Z" fill="#353978" />
                  </g>
                  <defs>
                    <clipPath id="clip0_381_2568">
                      <rect width="10.4388" height="10.4388" fill="white" transform="translate(0.121094 0.361328)" />
                    </clipPath>
                  </defs>
                </svg>
                <h3>04 Jan, 2025</h3>
              </div>
              <div className="Booking_Details_body">
                <div className="Booking_Details_body--right">
                  <div className="Booking_Details_body--right--img">
                    <img src={Flydubia} alt="flydubai airline logo" />
                  </div>
                  <div className="Booking_Details_body--right--details">
                    <span>
                      <p>flydubai</p>
                      <p>FZ-329</p>
                    </span>
                  </div>

                </div>
                <div className="Booking_Details_body--left">
                  <div className="Booking_Details_body--left--top">
                    <h2>07:45 PM </h2>
                    <h5>2h 5m</h5>
                    <h2>07:45 PM </h2>
                  </div>
                  <div className="Booking_Details_body--left--top">
                    <p>Dubai (DXB)</p>
                    <p>Nonstop</p>
                    <p>London (LDN)</p>
                  </div>
                  <div className="Booking_Details_body--left--top">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                        <g clipPath="url(#clip0_381_2554)">
                          <path d="M8.48881 2.99667H7.84512V1.05068C7.84512 0.590929 7.47107 0.216797 7.01124 0.216797H4.76434C4.30459 0.216797 3.93041 0.590929 3.93041 1.05068V2.99663H3.28677C2.88464 2.99663 2.55859 3.32267 2.55859 3.7248V9.22271C2.55859 9.62501 2.88472 9.95097 3.28677 9.95097H3.38441V10.4796C3.38441 10.5769 3.46326 10.6556 3.56036 10.6556H4.39307C4.49037 10.6556 4.5691 10.5768 4.5691 10.4796V9.95097H7.20627V10.4796C7.20627 10.5769 7.28521 10.6556 7.3823 10.6556H8.21493C8.31232 10.6556 8.39096 10.5768 8.39096 10.4796V9.95097H8.48873C8.89085 9.95097 9.2169 9.62492 9.2169 9.22271V3.72484C9.21698 3.32263 8.89094 2.99667 8.48881 2.99667ZM7.28907 2.99663H4.48625V1.05068C4.48625 0.897431 4.61096 0.772721 4.76421 0.772721H7.01111C7.16436 0.772721 7.28907 0.897431 7.28907 1.05068V2.99663Z" fill="#353978" />
                        </g>
                        <defs>
                          <clipPath id="clip0_381_2554">
                            <rect width="10.4388" height="10.4388" fill="white" transform="translate(0.667969 0.216797)" />
                          </clipPath>
                        </defs>
                      </svg>

                      <p>Total: 30kg</p>
                    </span>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="12" viewBox="0 0 11 12" fill="none">
                        <g clipPath="url(#clip0_381_2596)">
                          <path d="M5.28893 0.917969C5.08463 0.917969 4.91902 1.08486 4.91902 1.29078H4.91611V4.27331C4.91611 4.47921 4.74922 4.64612 4.54329 4.64612C4.33736 4.64612 4.17047 4.47921 4.17047 4.27331V1.29078H4.16756C4.16756 1.08486 4.00195 0.917969 3.79768 0.917969C3.59338 0.917969 3.42777 1.08486 3.42777 1.29078H3.42486V4.27331C3.42486 4.47921 3.25797 4.64612 3.05204 4.64612C2.84612 4.64612 2.67922 4.47921 2.67922 4.27331V1.29078C2.67922 1.08486 2.51361 0.917969 2.30932 0.917969C2.10503 0.917969 1.93942 1.08486 1.93942 1.29078H1.93359V5.01892C1.93359 5.47755 2.39373 5.87162 3.05204 6.04423V10.6111C3.05204 11.0229 3.38589 11.3568 3.79768 11.3568C4.20945 11.3568 4.54329 11.0229 4.54329 10.6111V6.04423C5.20161 5.87162 5.66174 5.47755 5.66174 5.01892V1.29078H5.65883C5.65883 1.08486 5.49322 0.917969 5.28893 0.917969Z" fill="#353978" />
                          <path d="M9.20258 0.917969C7.86424 0.917969 6.7793 3.25476 6.7793 6.13737C6.7793 6.39054 6.78767 6.63946 6.80387 6.88301H7.89773V10.6111C7.89773 11.0229 8.23157 11.3568 8.64336 11.3568C9.05515 11.3568 9.389 11.0229 9.389 10.6111V0.933173C9.32748 0.923095 9.26532 0.917969 9.20258 0.917969Z" fill="#353978" />
                        </g>
                        <defs>
                          <clipPath id="clip0_381_2596">
                            <rect width="10.4388" height="10.4388" fill="white" transform="translate(0.441406 0.917969)" />
                          </clipPath>
                        </defs>
                      </svg>

                      <p>No Meal</p>
                    </span>

                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="Flights_Booking_bottom">
            <div className="traveller--details">
              <div className="traveller--details--heading">
                <h3>Travelers Details for Adult 1</h3>
              </div>
              <div className="traveller--details--body">
                <div className="traveller-details--groupbox">
                  <div className="traveller-details--inputgroup">
                    <h2> Select Title</h2>
                    <div className="radio--inputs">
                      <div className="radio--input">
                        <input type="radio" name="" id="" />
                        <label htmlFor="">Mr</label>
                      </div>
                      <div className="radio--input">
                        <input type="radio" name="" id="" />
                        <label htmlFor="">Mrs</label>
                      </div>
                      <div className="radio--input">
                        <input type="radio" name="" id="" />
                        <label htmlFor="">Ms</label>
                      </div>

                    </div>
                  </div>
                  <div className="traveller-details--inputgroup">
                    <h2> Date of  Birth</h2>
                    <input type="calender" placeholder='Select date' />
                  </div>
                  <div className="traveller-details--inputgroup">
                    <h2>Given Name </h2>
                    <input type="text" placeholder='Enter your name' />
                  </div>
                  <div className="traveller-details--inputgroup">
                    <h2>Surname</h2>
                    <input type="text" placeholder='Enter your surname' />
                  </div>
                  <div className="traveller-details--inputgroup">
                    <h2>Nationality</h2>
                    <input type="text" placeholder='Select nationality' />
                  </div>
                  <div className="traveller-details--inputgroup">
                    <h2>Enter Passport Number </h2>
                    <input type="text" placeholder='Your passport number' />
                  </div>
                  <div className="traveller-details--inputgroup full--width">
                    <h2>Frequent Flyer Number</h2>
                    <input type="number" placeholder='Enter number' />
                  </div>
                </div>
              </div>
            </div>
            <div className="payment--details">
              <div className="payment--details--heading">
                <h2>Price Summary</h2>
              </div>

              <div className="payment--details--body">
                <div className="payment--details--top1 extra--border">
                  <h3>Flydubai (Adult x1)</h3>
                  <p>£ 400.00</p>
                </div>

                <div className="payment--details--top1">
                  <h3>Withholding Tax</h3>
                  <p>£ 40.00</p>
                </div>
                <div className="payment--details--top1" >
                  <h3>Transaction Charges</h3>
                  <p>£ 40.00</p>
                </div>


                <div className="payment--details--end">
                  <h3>Price you pay</h3>
                  <h2>£ 450.00</h2>
                </div>
              </div>
            </div>

          </div>

          <div className="Flights_Booking_buttons">
            <div className="Flights_Booking_buttons1">
              <button>Go Back</button>
            </div>
            <div className="Flights_Booking_buttons1 extrabackground">
              <button>Continue</button>
            </div>
          </div>


        </div>
      </div>
    </section>
  )
}

export default Booking_Flights