import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router";


const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});


const Products = () => {
  const [addCartList, setAddCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productDetail, setProductDetail] = useState({ imagesUrl: [] });
  const [productImgUrl, setProductImgUrl] = useState();
  const [paginationData, setPaginationData] = useState({});

  const navigate = useNavigate();
  const handleLink = (product) => {
    navigate(`/product/${product.id}`)
  }

  // 取得產品
  const getProduct = async (page) => {
    try {
      const productRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/products?page=${page}`);
      setPaginationData(productRes.data.pagination)
      setProductList(productRes.data.products);
    } catch (error) {
      console.log(error);
    };
  };
  useEffect(() => {
    getProduct();
  }, []);

  // 加入購物車讀取圖示
  const addCartLoading = (cart) => {
    setAddCartList([
      ...addCartList, cart
    ]);
  };

  // 加入購物車
  const addCart = async (id) => {
    try {
      addCartLoading(id);
      await axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, {
        "data": {
          "product_id": id,
          "qty": 1
        }
      });
      Toast.fire({
        text: "已成功加入購物車",
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        text: error,
        icon: "error"
      });
    } finally {
      setAddCartList(addCartList.filter((item) => item !== cart));
    };
  };

  return (
    <>
      <div className="container py-5">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">編號</th>
              <th scope="col">照片</th>
              <th scope="col">品名</th>
              <th scope="col">類別</th>
              <th scope="col">售價</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody >
            {
              productList.map((item, idx) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{idx + 1}</th>
                    <td><img className="product-sm-img" src={item.imageUrl} alt="product" onClick={() => { setProductDetail(item), setProductImgUrl(item.imageUrl), detailModalOpen() }} /></td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td><span className="text-decoration-line-through">{item.origin_price.toLocaleString()}</span><br />{item.price.toLocaleString()}</td>
                    <td>
                      <button type="button" className="btn btn-info me-3" onClick={() => handleLink(item)}>詳細資訊</button>
                      <button disabled={addCartList.includes(item.id)} type="button" className="btn btn-success" onClick={() => addCart(item.id)} >{addCartList.includes(item.id) && <span className="me-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}加入購物車</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        <Pagination paginationData={paginationData} getProduct={getProduct} />
      </div>
    </>
  );
};

export default Products;