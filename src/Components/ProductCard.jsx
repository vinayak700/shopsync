import React from "react";
import { Card, Button } from "react-bootstrap";
import {
  addToUserCart,
  removeFromUserCart,
} from "../Redux/reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../Redux/reducers/authReducer";
import { toast } from "react-toastify";

const ProductCard = (props) => {
  const { id, name, price, category, image } = props;
  const { currentUser } = useSelector(authSelector);
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    if (!currentUser) {
      toast.error("Please Login first!!!");
      return;
    }
    console.log(product, currentUser);
    dispatch(
      addToUserCart({
        product,
        currentUser: currentUser.user,
      })
    );
  };
  const handleRemoveFromCart = (productId) => {
    if (!currentUser) {
      toast.error("Please Login first!!!");
      return;
    }
    dispatch(
      removeFromUserCart({
        productId,
        currentUser: currentUser.user,
      })
    );
  };

  return (
    <Card style={{ width: "14rem", margin: "auto" }}>
      <Card.Img
        variant="top"
        src={image}
        style={{ height: "30vh", backgroundSize: "cover" }}
      />
      <Card.Body className="m-0">
        <Card.Title>
          {name.length < 25 ? name : name.slice(0, 26) + "..."}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle>
        <Card.Text>Price:${price}</Card.Text>
        <div className="d-flex justify-content-between gap-2">
          {/* <Button size="sm" variant="secondary" onClick={() => dispatch(addToUserCart({ ...props }))}> */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              handleAddToCart({ id, name, price, category, image })
            }
          >
            Add To Cart
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleRemoveFromCart(id)}
          >
            Remove From Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
