import axios from "axios";
import Swal from 'sweetalert2';
import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";


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
  // 結帳表單
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });
  const onSubmit = (data) => {
    const { text, ...payData } = data;
    payRequest(payData, text)
  };

  // 結帳
  const payRequest = async (userData, message) => {
    try {
      setCartPageLoading(true);
      const payRes = await axios.post(`${apiUrl}/v2/api/${apiPath}/order`, {
        "data": {
          "user": userData,
          "message": message
        }
      });
      Swal.fire({
        title: "已成功送出訂單",
        text: `訂單編號：${payRes.data.orderId}`,
        icon: "success"
      });
      getCart();
      reset();
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
          <div className="container mt-5">
            <h2 className="text-center">請填寫配送資訊</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="name" name="name"  {...register('name', {
                  required: "必填",
                  pattern: {
                    value: /^[^\d]*$/,
                    message: "姓名格式不符"
                  }
                })} />
                <label htmlFor="name">姓名</label>
                <div className="text-danger mt-1">{errors.name ? errors.name.message : ""}</div>
              </div>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="email" name="email"  {...register('email', {
                  required: "必填",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email格式不符"
                  }
                })} />
                <label htmlFor="email">Email</label>
                <div className="text-danger mt-1">{errors.email ? errors.email.message : ""}</div>
              </div>
              <div className="form-floating mb-3">
                <input type="tel" className="form-control" id="tel" name="tel"  {...register('tel', {
                  required: "必填",
                  pattern: {
                    value: /^\d{9,}$/,
                    message: "電話格式不符"
                  }
                })} />
                <label htmlFor="name">電話</label>
                <div className="text-danger mt-1">{errors.tel ? errors.tel.message : ""}</div>
              </div>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" id="address" name="address"  {...register('address', {
                  required: "必填",
                  pattern: {
                    value: /^(?=.*[市縣])(?=.*號).*$/,
                    message: "地址格式不符"
                  }
                })} />
                <label htmlFor="name">地址</label>
                <div className="text-danger mt-1">{errors.address ? errors.address.message : ""}</div>
              </div>
              <div className="form-floating mb-3">
                <textarea style={{ height: "200px", resize: "none" }} type="text" className="form-control" id="text" name="text"  {...register('text')} />
                <label htmlFor="name">備註</label>
              </div>
              <div className="d-flex justify-content-end mt-5">
                <button type="submit" className="btn btn-danger">送出</button>
              </div>
            </form>
          </div>
        </>
      }




    </>
  );
};

export default Cart;