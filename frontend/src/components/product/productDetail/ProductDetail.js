import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { selectIsLoggedIn } from "../../../redux/features/auth/authSlice";
import {
  getProduct,
  updateProduct,
} from "../../../redux/features/product/productSlice";
import Card from "../../card/Card";
import { SpinnerImg } from "../../loader/Loader";
import "./ProductDetail.scss";
import DOMPurify from "dompurify";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const API_URL = `${BACKEND_URL}/api/sendemail`;

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const [num, setNum] = useState();

  const { id } = useParams();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const quantAlert = async () => {
    const data = {
      SKU: product.sku,
      category: product.category,
      isSelling: 0,
      quantity: product.quantity,
    };
    console.log(data, "heheeh");
    const response = await axios.post(API_URL, data);
    return response.data;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
    }

    if (isError) {
      console.log(message);
    }
  }, [isLoggedIn, isError, message, dispatch]);

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      if (quantity < 5) {
        quantAlert();
        return <span className="--color-success">In Stock</span>;
      } else return <span className="--color-success">In Stock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };

  const quantStatus = (quantity) => {
    if (quantity < 5) {
      // console.log("alert");
      // quantAlert();
      return quantity;
    } else {
      return quantity;
    }
  };

  const handleQuant = async () => {
    const formData = new FormData();
    formData.append("quantity", product?.quantity - num);
    console.log(...formData);
    await dispatch(updateProduct({ id, formData }));
    await dispatch(getProduct(id));
  };
  const handleClick = async () => {
    const data = {
      SKU: product.sku,
      category: product.category,
      quantity: num,
      price: product.price * num,
      isSelling: 1,
    };
    // console.log(data, "helflo");
    handleQuant();
    const response = await axios.post(API_URL, data);
    return response.data;
  };

  return (
    <div className="product-detail">
      <h3 className="--mt">Product Detail</h3>
      <Card cardClass="card">
        {isLoading && <SpinnerImg />}
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No image set for this product</p>
              )}
            </Card>
            <h4>Product Availability: {stockStatus(product.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span> &nbsp; {product.name}
            </h4>
            <p>
              <b>&rarr; SKU : </b> {product.sku}
            </p>
            <p>
              <b>&rarr; Category : </b> {product.category}
            </p>
            <p>
              <b>&rarr; Price : </b> {"$"}
              {product.price}
            </p>
            <p>
              <b>&rarr; Quantity in stock : </b> {quantStatus(product.quantity)}
            </p>
            <p>
              <b>&rarr; Total Value in stock : </b> {"$"}
              {product.price * product.quantity}
            </p>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description),
              }}
            ></div>
            <hr />
            {/* <code className="--color-dark">
              Created on: {product?.createdAt.toLocaleString("en-US")}
            </code>
            <br />
            <code className="--color-dark">
              Last Updated: {product?.updatedAt.toLocaleString("en-US")}
            </code> */}
            <div className="--color-dark">
              <div>
                <h3>Enter the quantity to sell</h3>
              </div>
              <input
                type="number"
                onChange={(e) => {
                  setNum(e.target.value);
                }}
              />
              <div>
                <button onClick={handleClick} className="button">
                  Sell
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
