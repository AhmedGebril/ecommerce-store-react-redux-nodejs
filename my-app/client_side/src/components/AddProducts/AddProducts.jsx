import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { gsap } from "gsap";
import { useRef } from "react";

export default function AddProducts (){
  const [recieved,setRecieved] = useState(false)
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [products,setProducts]=useState([]);
  const [success,setSuccess]=useState('');
  const [error,setError]=useState('');
  const errorAlert = useRef(null)
  const successAlert = useRef(null)

  const handleImageUpload = (e) => {
    
    const image = e.target.files[0];
    setProductImage(image);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productQuantity', productQuantity);
    formData.append('productImage', productImage);
    formData.append('Description', description);
    formData.append('Brand', brand);
    formData.append('Category', category);

    await axios.post('http://localhost:3001/addProduct', formData).then((response) => {
      setRecieved(true)
        if(response.status === 200) {
            console.log(response)
            setRecieved(true)
        }
    }).catch(err=>{
      setError(err.response.data.error)
    })
  }


  async function getProducts(){
    await axios.get('http://localhost:3001/getProducts').then((res)=>{
      setProducts(res.data)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    getProducts()
  },[])

  function showProducts(){
    console.log(products)
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/products/${id}`)
      .then(res => {
        if(res.status === 200){
          const updatedProducts = products.filter(product => product._id !== id);
          setProducts(updatedProducts);
          setSuccess('product updated successfully')
        }else{
          setError(res.data)
        }
        console.log('detelted')
      })
      .catch(err => console.log(err));
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
    <div className="container">
    {success?<div className='alert alert-success success-alert' ref={successAlert}>{success}<i className="fa-solid fa-xmark close-mark" onClick={()=>{animateCloseMark()}}></i></div>:''}
    {error?<div className='alert alert-danger error-alert' ref={errorAlert}>{error}<i className="fa-solid fa-xmark close-mark" onClick={()=>{errorAnimateCloseMark()}}></i></div>:''}
        <h3>Add Product</h3>
    <form onSubmit={handleSubmit} className="bg-dark p-3 text-white mb-3">
      <div className="form-group mb-3">
        <label htmlFor="productName">Product Name</label>
        <input
          type="text"
          className="form-control"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="brand">Brand</label>
        <input
          type="text"
          className="form-control"
          id="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="category">category</label>
        <input
          type="text"
          className="form-control"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="productPrice">Product Price</label>
        <input
          type="number"
          className="form-control"
          id="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="productPrice">Description</label>
        <input
          type="text"
          className="form-control"
          id="productPrice"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="productQuantity">Quantity</label>
        <input
          type="number"
          className="form-control"
          id="productQuantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">Product Image</label>
          <input className="form-control" type="file" id="formFile" onChange={(e)=>{handleImageUpload(e)}}/>
        </div>
      </div>
      {recieved?<button className="btn btn-success" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span className="visually-hidden">Loading...</span>
          </button>:<button type="submit" className="btn btn-success">Submit</button>}
    </form>
    <button className="btn btn-success" onClick={()=>{showProducts()}}>Show Products</button>
    </div>
    <div className="showProducts m-5">
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {products.map(product => (
          <tr key={product._id}>
            <td>{product.productName}</td>
            <td>{product.productPrice}</td>
            <td>{product.productQuantity}</td>
            <td>{product.description}</td>
            <td >
              <button className="btn btn-primary me-3">Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    </>
  );
};

