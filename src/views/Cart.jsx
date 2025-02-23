import axios from "axios";
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
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

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const [cartTotal, setCartTotal] = useState("");
  const [cartQtyLoading, setCartQtyLoading] = useState(false);
  const [cartPageLoading, setCartPageLoading] = useState(false);
  const cartLoadFinish = useRef(false);

  const navigate = useNavigate();

  // 取得購物車
  const getCart = async () => {
    try {
      setCartPageLoading(true);
      const cartRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/cart`);
      setCartTotal(cartRes.data.data.final_total)
      setCartList(cartRes.data.data.carts);



    } catch (error) {
      Swal.fire({
        text: error,
        icon: "error"
      });
    } finally {
      setCartPageLoading(false);
      cartLoadFinish.current = true;
    }
  };
  useEffect(() => {
    getCart();

  }, []);

  useEffect(() => {
    if (cartLoadFinish.current && cartList.length === 0) {
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    }
  }, [cartList, cartPageLoading]);

  // 修改商品數量
  const updateCartQty = async (cartId, productId, qty) => {
    try {
      setCartQtyLoading(true);
      await axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${cartId}`, {
        "data": {
          "product_id": productId,
          "qty": qty
        }
      });
      getCart();
      Toast.fire({
        text: "已成功更新數量",
        icon: "success"
      });
    } catch (error) {
      console.log(error);
    } finally {
      setCartQtyLoading(false);
    }
  };
  // 刪除單一購物車
  const deleteCartItem = async (id) => {
    try {
      const result = await Swal.fire({
        title: "確定要從購物車移除此項商品嗎？",
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
      })
      if (result.isConfirmed) {
        setCartPageLoading(true);
        await axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`);
        getCart();
        Swal.fire({
          title: "已成功移除此項商品",
          icon: "success",
          showConfirmButton: false,
          timer: 1000
        });
      };
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error"
      });
    } finally {
      setCartPageLoading(false);

    };
  };

  // 刪除購物車
  const deleteCart = async () => {
    try {
      const result = await Swal.fire({
        title: "確定要清空購物車內全部商品嗎？",
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
      })
      if (result.isConfirmed) {
        setCartPageLoading(true);
        await axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`);
        getCart();
        Swal.fire({
          title: "已成功清空購物車",
          icon: "success",
          showConfirmButton: false,
          timer: 1000
        });
      };
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error"
      });
    } finally {
      setCartPageLoading(false);
    };
  };

  return (
    <>
      {cartPageLoading && <LoadingSpinner />}
      {cartList.length == 0 && cartLoadFinish.current ? <h3 className="text-center mt-3">購物車內沒有商品，將於三秒後自動跳轉至產品列表頁</h3> :
        <>
          <h3 className="my-5 fw-bold text-center">購物車</h3>
          <div className="row d-flex justify-content-center">
            <div className="col-8">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">編號</th>
                    <th scope="col">品名</th>
                    <th scope="col">售價</th>
                    <th scope="col">數量</th>
                    <th scope="col">小計</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    cartList.map((item, idx) => {
                      return (
                        <tr key={item.id} className="align-middle">
                          <th scope="row">{idx + 1}</th>
                          <td>{item.product.title}</td>
                          <td>{item.product.price.toLocaleString()}</td>
                          <td>
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                              <button type="button" className="btn btn-outline-dark" onClick={() => updateCartQty(item.id, item.product.id, item.qty - 1)} disabled={cartQtyLoading || item.qty == 1}>-</button>
                              <span className="btn border border-dark" style={{ cursor: "auto" }}>{item.qty}</span>
                              <button type="button" className="btn btn-outline-dark" onClick={() => updateCartQty(item.id, item.product.id, item.qty + 1)} disabled={cartQtyLoading}>+</button>
                            </div>
                          </td>
                          <td>{item.final_total.toLocaleString()}</td>
                          <td><button type="button" className="btn btn-danger" onClick={() => deleteCartItem(item.id)}>刪除</button></td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              <div className="d-flex justify-content-center align-items-center">
                <h3 className="mb-0">總金額：{cartTotal.toLocaleString()}</h3>
                <button type="button" className="ms-3 btn btn-danger" onClick={deleteCart}>清空購物車</button>
              </div>
            </div>
          </div>
        </>
      }




    </>
  );
};

export default Cart;