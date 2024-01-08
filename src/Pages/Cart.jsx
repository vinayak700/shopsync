import React, { useEffect } from "react";
import { Figure, Container, Button, NavLink } from "react-bootstrap";
import MySpinner from "../Components/MySpinner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToUserCart,
  clearUserCart,
  decCartItemQty,
  getUserCartItems,
  placeOrder,
  productActions,
  productSelector,
} from "../Redux/reducers/productReducer";
import { authSelector } from "../Redux/reducers/authReducer";

const Cart = () => {
  const { currentUser } = useSelector(authSelector);
  const { cartTotal, loading, userCart } = useSelector(productSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserCartItems({ currentUser: currentUser.user }));
  }, [dispatch, currentUser.user]);

  useEffect(() => {
    dispatch(productActions.cartTotal(userCart));
  }, [userCart, dispatch]);

  return (
    <Container style={{ marginTop: "80px" }}>
      {loading ? (
        <MySpinner />
      ) : (
        <>
          <h3 className="text-center mb-4">Shopping Cart</h3>
          {userCart.length === 0 ? (
            <p className="text-center"> OOPS! Your Cart is Empty 🛒</p>
          ) : (
            <div className="row justify-content-center mb-5">
              <div className="col-12">
                <div>
                  {userCart.map((p) => (
                    <div key={p.id} className="border mb-3 p-3">
                      <div className="d-flex justify-content-between">
                        <div className="p-2 d-flex">
                          <Figure className="me-5">
                            <Figure.Image width={80} src={p.image} />
                          </Figure>

                          <div>
                            <p className="mb-2 text-muted"></p>
                            <p> {p.name}</p>
                            <p>Price: {p.price} </p>
                          </div>
                        </div>

                        <div className="p-2 d-flex align-items-center">
                          <Button
                            disabled={loading}
                            onClick={() =>
                              dispatch(
                                decCartItemQty({
                                  productId: p.id,
                                  currentUser: currentUser.user,
                                })
                              )
                            }
                            variant="primary"
                          >
                            {" "}
                            -{" "}
                          </Button>
                          <span className="m-4"> {p.quantity} </span>
                          <Button
                            disabled={loading}
                            onClick={() =>
                              dispatch(
                                addToUserCart({
                                  product: { ...p },
                                  currentUser: currentUser.user,
                                })
                              )
                            }
                            variant="primary"
                          >
                            {" "}
                            +{" "}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4 mt-4 ">
                <h5 className="text-center">Order Summary</h5>

                <div className="d-flex justify-content-between mt-4 mb-4 p-3 mb-2 bg-body-secondary rounded">
                  <div>Total Price</div>
                  <div> &#x20B9; {cartTotal} </div>
                </div>

                <div className="d-grid mt-3">
                  <Button
                    variant="danger"
                    as={NavLink}
                    to="/order"
                    onClick={() => {
                      dispatch(placeOrder({ currentUser: currentUser.user }))
                        .unwrap()
                        .then(() => {
                          dispatch(
                            clearUserCart({ currentUser: currentUser.user })
                          )
                            .unwrap()
                            .then(() => {
                              navigate("/orders");
                            });
                        });
                    }}
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Cart;
