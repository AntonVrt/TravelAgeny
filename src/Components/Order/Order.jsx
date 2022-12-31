import React, {useEffect,useRef,useState} from 'react'
import './Order.css'
import {HiOutlineLocationMarker} from 'react-icons/hi'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { db,} from "../../firebase-config";
import {collection, doc, updateDoc} from "firebase/firestore";
import { useHistory, useLocation } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Order = (props) => {


  const { state: des } = useLocation();
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [TicketsAmount, setTicketsAmount] = useState("1");
  const TicketsAmountRef = useRef(); 

  useEffect(()=>{
    Aos.init({duration: 4000})
    TicketsAmountRef.current=TicketsAmount
  }, [TicketsAmount])

  let history = useHistory();

  const onChange = (event) => {
    setTicketsAmount(event.target.value);
  };
  
  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const handleSubmit = async () => {
    await sleep(4000);
    const getdes = doc(db, 'destenation', des.uuid);
    await updateDoc(getdes, {
      Nseats: des.Nseats-TicketsAmountRef.current,
    });
    history.push("/");
  }

  return (
    <section id='main' className='main section container'>
      <div className="secTitle">
        <h3 className="title">
          Order your flight now
        </h3>
      </div>

      <div className="secContent grid">

                      
                <div className="imageDiv">
                <img src={des.ImageUrl} alt="" />
                </div>
    
              <div className="cardInfo">
                <h4 className="destTitle"> {des.Destination}</h4>
                <span className="continent flex">
                  <HiOutlineLocationMarker className="icon"/>
                  <span className="name">From {des.Location}</span>
                </span>
    
                <div className="fees flex">
                  <div className="grade">
                    <span  className="textD">Departure: </span>
                    <span>{des.DepartureDate}</span>
                    {des.TripType==="Roudtrip"? (<><span className="textD">  To </span><span>{des.ReturnDate} </span></>):
                          (<><span className="textD"> </span><span>One way</span></>)}
                  </div>   
                </div>
    
                <div className="desc">
                <p>Airline: {des.Description}</p>
                </div>

                <div className="price">
                      
                      <h5>Total sum: {des.Price*TicketsAmount}$</h5>
                    </div>

                    <div className="addItem">
                <label htmlFor="ticketsAmount">choose amount of tickets:</label>
                  <div className="input flex">
                  <select onChange={onChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  </select>
                  </div>
              </div>  

                <div className="addItem">
                  <label htmlFor="location">Enter your first name:</label>
                    <div className="inputorder flex">
                      <input type="text"  placeholder='Enter first name here...' onChange={(event) => {setFirstName(event.target.value);}}/>
                  </div>
                </div> 


                <div className="addItem">
                  <label htmlFor="destTitle">Enter your destanation:</label>
                    <div className="inputorder flex">
                      <input type="text"  placeholder='Enter last name here...'  onChange={(event) => {
                      setLastName(event.target.value);
                    }}/>
                  </div>
                </div> 

        <div >
        <PayPalScriptProvider
          options={{ "client-id": process.env.REACT_APP_clientId}}
        >
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: des.Price*TicketsAmountRef.current,
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              const name = details.payer.name.given_name;
              alert("Transaction completed by " + name + "thank you for your purchase. you are being rederect to the main page "); 
              handleSubmit();
            }}
            onError={()=> {
              alert("An Error occured with your payment"); 
            }}

            onCancel={() => {
              alert("Please make sure to finish the payment"); 
            }}
          />
        </PayPalScriptProvider>
                </div>

          
                {/* <button  className="btn">
                  <a onClick={ () => {  
                    
                  handleSubmit();
                    }}>Submit</a>
                </button> */}

        
        

          </div>
        </div>
      
     
    </section>
  )
  }
  
  export default Order