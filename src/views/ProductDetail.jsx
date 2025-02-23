import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;


const ProductDetail = () => {
  const [product, setProduct] = useState({})
  const { id } = useParams();
  useEffect(() => {
    try {
      (async () => {
        const res = await axios.get(`${apiUrl}/v2/api/${apiPath}/product/${id}`);
        setProduct(res.data.product);
      })();
    } catch (error) {
      console.log(error);
    };
  }, [id]);

  return (
    <>
      <div className="container">
        <div className="card">
          <img src={product.imageUrl} className="card-img-top" alt="product" style={{ width: "300px" }} />
          <div className="card-body">
            <h5 className="card-title">{product.title}</h5>
            <p className="card-text">{product.description}</p>
            <p className="card-text">售價：{product.price}</p>
            <Link to="/products" className="btn btn-primary">返回</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;