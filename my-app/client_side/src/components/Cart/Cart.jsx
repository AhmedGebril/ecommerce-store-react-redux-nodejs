import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { refreshCount } from '../Store/contextStore';
import { gsap } from 'gsap';
import { useRef } from 'react';

const Cart = () => {
  let navigate = useNavigate()
  const dispatch = useDispatch()
  const [cartItems, setCartItems] = useState([]);
  const [overallPrice, setOverallPrice] = useState(0);
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [recieved,setRecieved] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    apartmentNumber: '',
    contactNumber:'',
  })
  const errorAlert = useRef(null)
  const successAlert = useRef(null)

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate overall price whenever cart items change
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity_orderd * item.product_price, 0);
    setOverallPrice(totalPrice);
  }, [cartItems]);

  async function Checkout(){
    setRecieved(true)
    await axios.put('http://localhost:3001/checkout/products',{cartItems},{withCredentials:true}).then(res=>{
      setSuccess('order received')
      setRecieved(false)
      dispatch(refreshCount())
    }).catch(err=>{
      // add popup that tells the error message
      setError(err.response.data.error)
    })
  }

  const fetchCartItems = async () => {
    // Fetch cart items from API using Axios
    await axios.get(`http://localhost:3001/orders/user`,{withCredentials:true}).then(res=>{
        console.log(res.data)
        setCartItems(res.data)
    }).catch(err=>{
      // add popup that tells the error message
      setError(err.response.data.error)
      if(err.response.status == 401){
        navigate('/Signin')
      }
    })     
  };

  function handleSubmit(event) {
    event.preventDefault();
    Checkout();
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const animateCloseMark = () => {
    gsap.to(".success-alert", {
      opacity:0,
      duration: 0.5,
      onComplete: () => {
        setSuccess(null)
      }
    });
  };
  const errorAnimateCloseMark = () => {
    gsap.to(".success-alert", {
      opacity:0,
      duration: 0.5,
      onComplete: () => {
        setError(null)
      }
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
        <h1 className='mb-4'>Shipping Details</h1>
        <form onSubmit={handleSubmit} className='py-3 pe-3'>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="apartment" className="form-label">Apartment Number</label>
            <input type="text" className="form-control" id="apartment" name="apartment" value={formData.apartment} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="zipcode" className="form-label">Zip Code</label>
            <input type="text" className="form-control" id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input type="text" className="form-control" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          </div>
          {recieved?<button className="btn btn-success" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="visually-hidden">Loading...</span>
          </button>:<button type="submit" className="btn btn-success">Checkout</button>}
        </form>
      </div>
      <div className="col-md-4 ">
        <div className="order-summary p-4 mb-3 rounded overflow-hidden bg-white h-100">
          <h2 className="mb-3">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="product-details mb-3 pb-3 border-bottom">
              <div>
                <span className="fw-bold">{item.product_name}</span>
                
              </div>
              <div>
                <span className='text-muted'>Quantity Ordered: {item.quantity_orderd}</span>
                <span className="float-end text-muted">Total : ${item.totalPrice}</span>
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



