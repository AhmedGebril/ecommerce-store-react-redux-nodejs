import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { increment } from '../Store/contextStore';
import { useRef} from 'react';
import gsap from 'gsap';



export default function HomePage() {
  const [recieved,setRecieved]=useState(false)
  const successAlert = useRef(null)
  const dispatch = useDispatch()
  const [products, setProducts] = useState([]);
  const [quantityPurchased, setQuantityPurchased] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const errorAlert = useRef(null)

  async function getProducts() {
    await axios
      .get('http://localhost:3001/getProducts')
      .then((res) => {

        setProducts(res.data);
      })
      .catch((err) => {
        // add popup that tells the error message 
        setError(err.response.data.error)
        console.log(err.response.data.error)
        if(err.response.status == 401){
          navigate('/Signin')
        }
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  // Function to handle adding quantity
  const handleAddQuantity = (productId) => {
    setQuantityPurchased((prevState) => {
      if (prevState[productId]) {
        return {
          ...prevState,
          [productId]: prevState[productId] + 1,
        }; // Increase quantityPurchased by 1
      }
      return { ...prevState, [productId]: 1 }; // If quantityPurchased doesn't exist yet, set it to 1
    });
  };

  // Function to handle subtracting quantity
  const handleSubtractQuantity = (productId) => {
    setQuantityPurchased((prevState) => {
      if (prevState[productId] && prevState[productId] > 0) {
        return {
          ...prevState,
          [productId]: prevState[productId] - 1,
        }; // Decrease quantityPurchased by 1, but not below 0
      }
      return prevState;
    });
  };

  // Function to handle adding order to cart
  const handleAddOrder = async (productId) => {
    const quantity = quantityPurchased[productId] || 0;
    if (quantity > 0) {
      // Add order to cart
      const order = {
        productId,
        quantity,
      };
      await axios
        .post('http://localhost:3001/addOrder', { order }, { withCredentials: true })
        .then((res) => {      
            setRecieved(false)
            setSuccess('order added successfully')
            // Add the product to cartItems state
            quantityPurchased[productId] = 0;
            dispatch(increment())
        })
        .catch((err) => {
          console.log(err)
          // add popup that tells the error message
          setError(err.response.data.error)
          if(err.response.status == 401){
            navigate('/Signin')
          }
        });
    }
  };
  const handleClick = (id) => {
    setRecieved(true)
    setTimeout(() => {
      handleAddOrder(id)
    }, 2000);
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
      {products.length > 0 ? (
        <div className='vh-100 w-100'>
          <div className='row g-3'>
            {products.map(product => (
              <div className='col-md-4' key={product._id}>
                <div className='p-2 card text-center'>
                  <div className="card-body">
                    <div className='card-image'>
                    <Link to={`/Product/${product._id}`}>
                    <img src={`/images/${product.productImage.split('\\').slice(-1)[0]}`} className="mb-3" style={{cursor:'pointer'}}/>
                    </Link>
                    </div>
                    <div className='border-top p-2'>
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text">{product.description}</p>
                      {product.productQuantity<=0?<div className='text-danger'>Out of Stock</div>:<><div className="d-flex justify-content-center align-items-center mb-3">
                        <button className="btn btn-primary me-2" onClick={() => handleAddQuantity(product._id)}>+</button>
                        <span>{quantityPurchased[product._id] || 0}</span>
                        <button className="btn btn-primary ms-2" onClick={() => handleSubtractQuantity(product._id)}>-</button>
                      </div>
                      
                      {recieved?<button className="btn btn-success" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="visually-hidden">Loading...</span>
          </button>:<button type="submit" className="btn btn-primary" onClick={()=>{handleClick(product._id)}}>Add to cart</button>}</>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1>no products</h1>
      )}

    </>
  )
          }




