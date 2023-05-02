import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Spinner } from "react-bootstrap";
import axios from "axios";

const Product = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [data,setData]=useState({})
  const [isLoading, setIsLoading] = useState(true);



  async function fetchData(id) {
    await axios.get(`http://localhost:3001/Product`,{params:{id:id}})
      .then(res => {
        setData(res.data)
        setIsLoading(false);

      })
      .catch(err => {
        console.log(err)
      })
  }

  

  useEffect(()=>{
    setTimeout(() => {
      fetchData(id)
    }, 3000);
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send review to server here
  };

  return (
    <>
    {isLoading?<div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </div>:<div className="container">
  <div className="row p-5">
    <div className="col-md-6">
      <img src={`/images/${data.productImage.split('\\').slice(-1)[0]}`} className="img-fluid" alt="Product Image 1" />
    </div>
    <div className="col-md-6">
      <h1>Product Name</h1>
      <p>Product Description</p>
      <h2>$100.00</h2>
      <button className="btn btn-primary">Add to Cart</button>
    </div>
  </div>
  <div className="accordion" id="accordionExample">
<div className="row p-4">
  <div className="accordion" id="myAccordion">
<div className="accordion-item">
  <h2 className="accordion-header" id="headingOne">
    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      Description
    </button>
  </h2>
  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#myAccordion">
    <div className="accordion-body">
      <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
    </div>
  </div>
</div>
<div className="accordion-item">
    <h2 className="accordion-header" id="headingTwo">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Review
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#myAccordion">
      <div className="accordion-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Comment
            </label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              placeholder="Write your comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
<div className="accordion-item">
  <h2 className="accordion-header" id="headingThree">
    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      Addional information
    </button>
  </h2>
  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#myAccordion">
    <div className="accordion-body">
      <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
    </div>
  </div>
</div>

</div>
</div>
</div>
</div>}
</>
  );
};

export default Product;