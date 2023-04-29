import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearItems } from "../../Contexts/cartAction.js";
import { Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import NavbarCustomer from "../partials/profile/navbarCustomer";
import axios from 'axios';
const CheckOutPage = ({}) => {
  const [fullName, setFullName] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [postalCode, setPostalCode] = useState();
  const [country, setCountry] = useState();
  const [payment, setPayment] = useState();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cartState) || [];
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = 0;
    cart.forEach(item => {
      price += item.price;
    });
    setTotalPrice(price);
  }, [cart]);
  const handleCheckOut = async () => {
    let user = JSON.parse(localStorage.getItem('user'));
    let userId = user._id;
    await axios.post(`http://localhost:4000/api/order/postOrder/${userId}`, {
      items: cart,
      address: {
        fullName: fullName,
        address: address,
        city: city,
        postalCode: postalCode,
        country: country
      },
      payment: payment
    });
    await dispatch(clearItems());
  };
  return (
    <div>

        <div>
        <NavbarCustomer />
      </div>
      <div className="heading-checkOut">
      <h2 style={{alignContent: "center", color: "#EB006F"}}>Checkout</h2>
      </div>
<div className="checkout-page d-flex justify-content-between">
      <div className="billing-details-card-container w-50 mx-4">
        <Card className="billing-details-card w-100">
          <Card.Header className="billing-details-card-header">
            Billing Details
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleCheckOut}>
              <Form.Group className="mb-3" as={Row} controlId="fullName">
                <Form.Label column sm={3}>
                  Full Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group className="mb-3" as={Row} controlId="address">
                <Form.Label column sm={3}>
                  Address
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group className="mb-3" as={Row} controlId="city">
                <Form.Label column sm={3}>
                  City
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group className="mb-3" as={Row} controlId="postalCode">
                <Form.Label column sm={3}>
                  Postal Code
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group className="mb-3" as={Row} controlId="country">
                <Form.Label column sm={3}>
                  Country
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group className="mb-3" as={Row}>
                <Form.Label as="legend" column sm={3}>
                  Payment Method
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="Mobile Banking"
                    checked={payment === "Mobile Banking"}
                    onChange={(e) => setPayment(e.target.value)}
                    label="Mobile Banking"
                  />
                  <Form.Check
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="Visa/MasterCard"
                    checked={payment === "Visa/MasterCard"}
                    onChange={(e) => setPayment(e.target.value)}
                    label="Visa/MasterCard"
                  />
                  <Form.Check
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    value="Cash On Delivery"
                    checked={payment === "Cash On Delivery"}
                    onChange={(e) => setPayment(e.target.value)}
                    label="Cash On Delivery"
                  />
                </Col>
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer>
          <Button className="btn btn-placeOrder" type="submit">Place Order</Button>
          </Card.Footer>
        </Card>
      </div>

      <div className="order-summary-container w-50 mx-4">
        <Card className="order-summary-card">
          <Card.Header className="order-summary-card-header">
            Order Summary
          </Card.Header>
          <Card.Body>
          <Table striped bordered hover responsive>
          <thead>
            <tr style={{textAlign: "center"}}>
              <th>#</th>
              <th>Name</th>
              <th>Pcs</th>
              <th>Strips</th>
              <th>Boxes</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((medicine, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{medicine.MedicineName}</td>
                <td>{medicine.quantityPcs}</td>
                <td>{medicine.quantityStrips}</td>
                <td>{medicine.quantityBoxes}</td>
                <td>{medicine.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr/>
        <div className='d-flex justify-content-between'>
            <div><h5 style={{color: "red"}}>Sub total: </h5></div>
            <div><h5 style={{color: "red"}}>৳{totalPrice}</h5></div>
        </div>
        <hr/>
        <div className='d-flex justify-content-between'>
            <div>
          <h5 style={{color: "red"}}>Delivery Charge: </h5>
            </div>
            <div>
            <h5 style={{color: "red"}}>৳50</h5>
            </div>
        </div>
        <hr/>
        <div className='d-flex justify-content-between'>
        <div><h5 style={{color: "red"}}>Total Price: </h5></div>
            <div><h5 style={{color: "red"}}>৳{totalPrice+50}</h5></div>
        </div>
          </Card.Body>
          
        </Card>
      </div>
    </div>
    </div>
    
  );
};
export default CheckOutPage;