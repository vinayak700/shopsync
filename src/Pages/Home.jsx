import { useEffect, useState } from "react";
import Hero from "../Components/Hero";
import { Col, Container, Row, Form, Accordion } from "react-bootstrap";
import { ProductCard } from "../Components";
import MySpinner from "../Components/MySpinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  productSelector,
} from "../Redux/reducers/productReducer";
// import { authSelector } from "../Redux/reducers/authReducer";

const Home = () => {
  const dispatch = useDispatch();
  const { products, minPrice, maxPrice, loading } =
    useSelector(productSelector);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState(100000);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const isNameMatch =
      searchValue.trim() === "" ||
      product.name.toLowerCase().includes(searchValue.toLowerCase());
    const isPriceMatch = product.price <= priceFilter;
    const isCategoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    return isNameMatch && isPriceMatch && isCategoryMatch;
  });

  // Handle price filtering
  const handleSetPriceFilter = (e) => {
    setPriceFilter(Number(e.target.value));
  };

  // Handle Category Change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter(
            (selectedCategory) => selectedCategory !== category
          )
        : [category, ...prevCategories]
    );
  };

  return (
    <>
      <Hero />
      <Container>
        <Row
          className="justify-content-center"
          style={{
            position: "absolute",
            top: "25%",
            right: "0%",
            width: "100%",
          }}
        >
          <Col lg={5} mb={5}>
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              style={{ boxShadow: "2px 2px 25px gray" }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={2} className="pt-2">
            <Accordion defaultActiveKey={["0"]} alwaysOpen>
              <Form.Label>Browse By:</Form.Label>
              <hr />
              <Accordion.Item eventKey="0">
                <Accordion.Header>Category</Accordion.Header>
                <Accordion.Body>
                  <Col>
                    <Form>
                      <Form.Check
                        type="checkbox"
                        label="Electronics"
                        value="electric"
                        onChange={handleCategoryChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Women's Clothing"
                        value="women"
                        onChange={handleCategoryChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Men's Clothing"
                        value="men"
                        onChange={handleCategoryChange}
                      />
                      <Form.Check
                        type="checkbox"
                        label="Jewellery"
                        value="Jewellery"
                        onChange={handleCategoryChange}
                      />
                    </Form>
                  </Col>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Price</Accordion.Header>
                <Accordion.Body>
                  <Col>
                    <Form.Label>Price Range : ${priceFilter}</Form.Label>
                    <input
                      type="range"
                      className="form-range"
                      id="customRange1"
                      min={Number(minPrice)}
                      max={Number(maxPrice)}
                      value={priceFilter}
                      onChange={handleSetPriceFilter}
                    />
                  </Col>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
          {loading ? (
            <MySpinner />
          ) : (
            <div className="col-lg-10">
              <div className="g-3 row pt-2">
                {filteredProducts?.map((p) => (
                  <div key={p.id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard {...p} id={p.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Home;
