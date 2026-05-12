import React, { useState, useRef, useEffect } from "react";
import { Select } from "antd";
import uploadImg from "../../../assets/Images/uploadImg.png";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { flightSchema } from "../../Schemas/Schemas";
import { usePost } from "../../../utils/ApiMethod";
import { BackendUrl } from "../../../baseUrl";
import { useNavigate } from "react-router-dom";

function AddFlight() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    trigger, // ✅ Add this

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(flightSchema),
    criteriaMode: "firstError",
  });
  const { postData, loading, error } = usePost("/flight", BackendUrl);

  const [imgUrl, setImgUrl] = useState(null);
  const fileInputRef = useRef(null);
  const flightType = watch("flightType");
  const navigate = useNavigate("");
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // ✅ Open dialog!
    }
  };

  const hanldeFlightSubmit = async (values) => {
    const formData = new FormData();
    formData.append("fromCountry", values?.fromCountry);
    formData.append("toCountry", values?.toCountry);
    formData.append("allCityInfo[fromCity]", values?.fromCity);
    formData.append("allCityInfo[fromCityIataCode]", values?.fromCityIataCode);
    formData.append("allCityInfo[toCity]", values?.toCity);
    formData.append("allCityInfo[toCityIataCode]", values?.toCityIataCode);
    formData.append("title", values?.title);
    values?.amenities?.forEach((data, index) =>
      formData.append(`amenities[${index}]`, data)
    );
    formData.append("price[currency]", values?.currency);
    formData.append("price[amount]", values?.amount);
    formData.append("price[at]", values?.at);
    formData.append("flightType", values?.flightType);
    formData.append("departureDate", values?.departureDate);
    if (values?.flightType === "Return") {
      formData.append("returnDate", values?.returnDate);
    }
    formData.append("cabin", values?.cabin);
    formData.append("image", values?.image);

    const response = await postData(formData);
    if (response?.data) {
      navigate("/Dashboard/ManageCotent");
    }
  };

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="add-flight-section">
        <p>Add a New Flight</p>
        <form onSubmit={handleSubmit(hanldeFlightSubmit)}>
          <div className="row input-section">
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                From Country <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="From Country"
                className="input-main-class"
                {...register("fromCountry")}
              />
              {errors.fromCountry && (
                <p style={{ color: "red" }}>*{errors.fromCountry.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                From City <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="From City"
                className="input-main-class"
                {...register("fromCity")}
              />
              {errors.fromCity && (
                <p style={{ color: "red" }}>*{errors.fromCity.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                From City Iata Code <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="From City Iata Code"
                className="input-main-class"
                {...register("fromCityIataCode")}
              />
              {errors.fromCityIataCode && (
                <p style={{ color: "red" }}>
                  *{errors.fromCityIataCode.message}
                </p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                To Country <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="To Country"
                className="input-main-class"
                {...register("toCountry")}
              />
              {errors.toCountry && (
                <p style={{ color: "red" }}>*{errors.toCountry.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                To City <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="To City"
                className="input-main-class"
                {...register("toCity")}
              />
              {errors.toCity && (
                <p style={{ color: "red" }}>*{errors.toCity.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                To City Iata Code <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="To City Iata Code"
                className="input-main-class"
                {...register("toCityIataCode")}
              />
              {errors.toCityIataCode && (
                <p style={{ color: "red" }}>*{errors.toCityIataCode.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Title <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="Title"
                className="input-main-class"
                {...register("title")}
              />
              {errors.title && (
                <p style={{ color: "red" }}>*{errors.title.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Currency <span className="mark-sec">*</span>
              </div>
              <input
                type="text"
                placeholder="Currency"
                className="input-main-class"
                {...register("currency")}
              />
              {errors.currency && (
                <p style={{ color: "red" }}>*{errors.currency.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Amount <span className="mark-sec">*</span>
              </div>
              <input
                type="number"
                placeholder="Amount"
                className="input-main-class"
                {...register("amount")}
              />
              {errors.amount && (
                <p style={{ color: "red" }}>*{errors.amount.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Flight At <span className="mark-sec">*</span>
              </div>
              <select className="input-main-class" {...register("at")}>
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>

              {errors.at && (
                <p style={{ color: "red" }}>*{errors.at.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Flight Type <span className="mark-sec">*</span>
              </div>
              <select className="input-main-class" {...register("flightType")}>
                <option value="Direct">Direct</option>
                <option value="Return">Return</option>
              </select>
              {errors.flightType && (
                <p style={{ color: "red" }}>*{errors.flightType.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Departure Date <span className="mark-sec">*</span>
              </div>
              <input
                type="date"
                placeholder="Departure Date"
                className="input-main-class"
                min={today}
                {...register("departureDate")}
              />
              {errors.departureDate && (
                <p style={{ color: "red" }}>*{errors.departureDate.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>Return Date</div>
              <input
                type="date"
                placeholder="return Date"
                className="input-main-class"
                min={today}
                disabled={flightType === "Direct"}
                {...register("returnDate")}
              />
              {errors.returnDate && (
                <p style={{ color: "red" }}>*{errors.returnDate.message}</p>
              )}
            </div>

            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Cabin <span className="mark-sec">*</span>
              </div>
              <select className="input-main-class" {...register("cabin")}>
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First Class</option>
              </select>
              {errors.cabin && (
                <p style={{ color: "red" }}>*{errors.cabin.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Amenities <span className="mark-sec">*</span>
              </div>
              <Controller
                name="amenities"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    mode="multiple"
                    placeholder="Select Amenities"
                    className="input-main-class"
                    style={{backgroundColor:"transparent"}}
                    options={[
                      { value: "Beaches", label: "Beaches" },
                      { value: "Snorkeling", label: "Snorkeling" },
                      { value: "Food", label: "Food" },
                    ]}
                  />
                )}
              />
              {errors.amenities && (
                <p style={{ color: "red" }}>*{errors.amenities.message}</p>
              )}
            </div>
            <div className="col-12 col-lg-4 col-md-4">
              <div>
                Upload Image <span className="mark-sec">*</span>
              </div>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <>
                    <div
                      className="image-div"
                      onClick={handleImageClick}
                      style={{ cursor: "pointer" }}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt="Selected flight image preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <>
                          <img src={uploadImg} alt="Upload flight image" />
                          <p>Upload Image</p>
                          <p className="max">Max (10mb)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImgUrl(URL.createObjectURL(file));

                          field.onChange(file); // ✅ send file to RHF
                          trigger("image"); // ✅ trigger Yup validation
                        } else {
                          field.onChange(null);
                          setImgUrl(null);
                        }
                      }}
                    />
                    {errors.image && (
                      <p style={{ color: "red" }}>*{errors.image.message}</p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="col-12 col-lg-8 col-md-8 btn-section">
              <div className="btn-section2">
                <button
                  onClick={() => navigate("/Dashboard/ManageCotent")}
                  type="button"
                  className="goBack"
                >
                  Go Back
                </button>
                <button disabled={loading} type="submit" className="save">
                  {loading ? "Saving...." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFlight;
