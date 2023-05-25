import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { refreshCount } from '../Store/contextStore';
import { gsap } from 'gsap';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const server = process.env.REACT_APP_MY_SERVER;
  const [cartItems, setCartItems] = useState([]);
  const [overallPrice, setOverallPrice] = useState(0);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showForm,setShowForm] = useState(false)
  const [recieved, setRecieved] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    apartmentNumber: '',
    contactNumber: '',
  });
  const [selectedShippingDetail, setSelectedShippingDetail] = useState(null); // Track selected shipping detail
  const [shippingDetails, setShippingDetails] = useState([]);
  const errorAlert = useRef(null);
  const successAlert = useRef(null);

  useEffect(() => {
    fetchCartItems();
    getShippingDetails();
  }, []);

  useEffect(() => {
    console.log(shippingDetails);
  }, [shippingDetails]);

  useEffect(() => {
    // Calculate overall price whenever cart items change
    const totalPrice = cartItems.reduce(
      (acc, item) => acc + item.quantity_orderd * item.product_price,
      0
    );
    setOverallPrice(totalPrice);
  }, [cartItems]);

  async function getShippingDetails() {
    const username = localStorage.getItem('username');
    await axios
      .get(`${server}/getUserShippingAddress`, { params: { username } })
      .then((res) => {
        if(res.data.ShippingDetails){
          setShippingDetails(res.data.ShippingDetails);
        }
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async function Checkout() {
    setRecieved(true);
    await axios
      .post(`${server}/save/ShippingDetails`, { formData }, { withCredentials: true })
      .then((res) => {
        setSuccess('Shipping details updated');
        setRecieved(false);
        setShippingDetails([...shippingDetails,res.data])
        setShowForm(false)
        console.log(res.data);
      })
      .catch((err) => {
        setError(err.response.data.error);
      });
  }

  const fetchCartItems = async () => {
    // Fetch cart items from API using Axios
    await axios
      .get('http://localhost:3001/orders/user', { withCredentials: true })
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => {
        setError(err.response.data.error);
        if (err.response.status === 401) {
          navigate('/Signin');
        }
      });
  };

  function handleSubmit(event) {
    event.preventDefault();
    Checkout();
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleShippingDetailChange(event) {
    setSelectedShippingDetail(event.target.value);
  }

  const renderShippingForm = () => {
    return (
      <>
      
          <form onSubmit={(e)=>{handleSubmit(e)}} className="py-3 pe-3">
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apartment" className="form-label">
                Apartment Number
              </label>
              <input
                type="text"
                className="form-control"
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="zipcode" className="form-label">
                Zip Code
              </label>
              <input
                type="text"
                className="form-control"
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contactNumber" className="form-label">
                Contact Number
              </label>
              <input
                type="text"
                className="form-control"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            {recieved ? (
              <button className="btn btn-success" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="visually-hidden">Loading...</span>
              </button>
            ) : (
              <>
              {showForm?<button className="btn btn-success me-3" onClick={()=>{setShowForm(false)}}>Cancel</button>
              :''}
              <button type="submit" className="btn btn-success">
                Save
              </button>
              </>
            )}
          </form>
            </>
    );
  };
  useEffect(()=>{
    console.log(showForm);
  },[showForm])

  const animateCloseMark = () => {
    gsap.to('.success-alert', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setSuccess(null);
      },
    });
  };

  const errorAnimateCloseMark = () => {
    gsap.to('.error-alert', {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setError(null);
      },
    });
  };

  useEffect(() => {
    if (success) {
      gsap.from(successAlert.current, {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      gsap.from(errorAlert.current, {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [error]);

  return (
    <>
     {success?<div className='alert alert-success success-alert' ref={successAlert}>{success}<i className="fa-solid fa-xmark close-mark" onClick={()=>{animateCloseMark()}}></i></div>:''}
    {error?<div className='alert alert-danger error-alert' ref={errorAlert}>{error}<i className="fa-solid fa-xmark close-mark" onClick={()=>{errorAnimateCloseMark()}}></i></div>:''}
      <div className="row">
        <div className="col-md-7 me-3">
          <h1 className="mb-4">Shipping Details</h1>
          {shippingDetails && shippingDetails.length > 0 ? (
            <>
            <form onSubmit={handleSubmit} className="py-3 pe-3">
              <div className="mb-3">
                {shippingDetails.map((shipping, index) => (
                  <div key={index} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shippingDetail"
                      id={`shippingDetail-${index}`}
                      value={index}
                      checked={selectedShippingDetail === index.toString()} // Use selectedShippingDetail to track selected radio button
                      onChange={handleShippingDetailChange} // Use handleShippingDetailChange to update selectedShippingDetail
                    />
                    <label className="form-check-label" htmlFor={`shippingDetail-${index}`}>
                      {`${shipping.address}, ${shipping.apartmentNumber}, ${shipping.city}`}
                    </label>
                  </div>
                ))}
              </div>
            </form>
            <button className="btn btn-success" onClick={(e)=>{setShowForm(true)}}>Add Shipping details</button>
              {showForm?renderShippingForm():''}
            </>
          ) : (
            <div>
              {renderShippingForm()}
            </div>
          )}
        </div>
        <div className="col-md-4 order-summary ">
          <div className="p-4 mb-3 rounded overflow-hidden bg-white h-50">
            <h2 className="mb-3">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="product-details mb-3 pb-3 border-bottom">
                <div>
                  <span className="fw-bold">{item.product_name}</span>
                </div>
                <div>
                  <span className="text-muted">Quantity Ordered: {item.quantity_orderd}</span>
                  <span className="float-end text-muted">Total: ${item.totalPrice}</span>
                  <p className="mb-0 text-muted">Price per Unit: ${item.product_price}</p>
                </div>
              </div>
            ))}
            <div className="total-price">
              <span className="fw-bold">Overall Price:</span>
              <span className="float-end fw-bold">${overallPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;


