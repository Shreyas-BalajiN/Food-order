import React, { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Card, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.svg';
import '../App.css';
import food from '../food.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function History() {
  const navigate = useNavigate();
  const [recipt, setRecipt] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/recipt`)
      .then((resp) => {
        setRecipt(resp.data);
      });
  }, [])
  return (
    <>
      <Navbar bg="black" data-bs-theme="dark">
        <Container>
          <Navbar.Brand ><img src={logo} width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"></img></Navbar.Brand>
          <Navbar.Brand href="#home">Food</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home" onClick={() => navigate('/')}>Home</Nav.Link>
              <Nav.Link href="#link" onClick={() => navigate('/history')}>Orders</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <h3 style={{marginLeft:"44rem"}}>Recipt</h3>
      <Card className="reciptCard"style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Order</Card.Title>
          <Card.Text>
            Recipt <br />
            <ul>
              {Object.entries(recipt).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}: </strong>
                  {value}
                </li>
              ))}
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
