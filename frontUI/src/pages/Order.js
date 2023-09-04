import React from 'react'
import logo from '../logo.svg';
import '../App.css';
import { Navbar, Container, Nav, Card, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Order() {
    const navigate = useNavigate()
    const handleOrd=()=>{
        const formData = {};
        rest.Menu.forEach((item) => {
          const quantity = document.getElementById(item).value;
          formData[item] = quantity;})
        formData["number"]=document.getElementById("number").value;
        formData["address"]=document.getElementById("address").value;
        console.log(formData)
        axios.post(`${process.env.REACT_APP_API_ENDPOINT}/order`, formData)
        .then((resp)=>{
            if(resp==="Message published successfully")
            alert("Order placed")
            navigate('/')
        }
        )
    }
    const location=useLocation();
    const {rest}=location.state;
    return (
        <div>
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
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Order</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <br />
            <Card className="custom-card" style={{ width: '20rem', marginLeft: "3rem" }}>
                <Card.Title>Menu</Card.Title>
                <hr />
                <Card.Body>
                {rest.Menu.map((item)=> <><div style={{ color:"white",alignItems:"left",display:"flex"}}>
                    <h3> {item}: </h3>
                    <input type="text" placeholder='quantity' id={item} style={{marginLeft:"6rem"}}/>
                   </div> <br /></>)}
                   <hr />
                   <div style={{ color:"white",alignItems:"left",display:"flex"}}>
                   <h3>Enter contact number: </h3>
                   <input type="text" placeholder='Number' id="number"/><br />
                   </div>
                   <br />
                   <div style={{ color:"white",alignItems:"left",display:"flex"}}>
                   <h3>Enter delivery address : </h3>
                   <input type="text" placeholder='Address' id="address"/><br />
                   <br />
                   </div>
                   <div style={{marginLeft:"6rem"}}>
                    <br />
                    <br />
                   <Button variant='primary' onClick={handleOrd}>Place order</Button>
                   </div>
                   
                </Card.Body>
            </Card>
        </div>
    )
}
