import React, { useEffect, useState } from 'react'
import{Navbar, Container, Nav, Card, Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.svg';
import '../App.css';
import food from '../food.jpg';
import{useNavigate} from 'react-router-dom';
import axios from'axios';
export default function Order() {
  const navigate=useNavigate();
  const [places,setPlaces]=useState([]);
  const handleOrder=(place)=>{
    console.log(place)
       navigate('/order',{state:{rest:place}})
  }
  useEffect(() => {
    console.log(process.env.REACT_APP_API_ENDPOINT)
    console.log(String(process.env.REACT_APP_API_ENDPOINT))
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/places`)
      .then((resp) => {
        setPlaces(resp.data);
      });
  }, []);
  
  return (
    <div>
      <Navbar bg="black" data-bs-theme="dark">
      <Container>
        <Navbar.Brand ><img src={logo}  width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"></img></Navbar.Brand>
        <Navbar.Brand href="#home">Food</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" onClick={()=>navigate('/')}>Home</Nav.Link>
            <Nav.Link href="#link" onClick={()=>navigate('/history')}>Orders</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br/>
    <br />
    <div style={{justifyContent:"center",display:"flex"}}>
    <h3>Restaurants near you</h3>
    </div>
    <br />
    <br />
    {places && places.map((place)=>
           <Card style={{ width: '18rem' }}>
           <Card.Img variant="top" src={food}/>
           <Card.Body>
             <Card.Title>{place.res_name}</Card.Title>
             <Card.Text>
               Description
             </Card.Text>
             <Button variant="primary" onClick={()=>handleOrder(place)}>Order</Button>
           </Card.Body>
         </Card>
    )}
   
    </div>
  )
}
