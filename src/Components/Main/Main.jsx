import React, {useEffect,useState} from 'react'
import './main.css'
import {HiOutlineLocationMarker} from 'react-icons/hi'
import {HiClipboardList} from 'react-icons/hi'
import Aos from 'aos'
import 'aos/dist/aos.css'
import {db} from "../../firebase-config";
import {collection,getDocs,} from "firebase/firestore";
import { fetchFlightsData } from '../../utils/FlightsData'

const Main = () => {

  //raed
  // const destenationRef = collection(db,"destenation")
  const [Destenation,setDestenation] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, [])

  const fetchFlights=async()=>{
      // const data = await getDocs(destenationRef) 
      const data= await fetchFlightsData();
      setDestenation(data.docs.map((doc) => (doc.data())));

  }


  useEffect(()=>{
    Aos.init({duration: 4000})
 }, [])
 
  return (
    <section id='main' className='main section container'>
      <div className="secTitle">
        <h3 className="title">
          Most visited destinations
        </h3>
      </div>

      <div className="secContent grid">
        {
          Destenation.map((des,index) => {
            return (
              
              <div key={index} data-aos="fade-up" className="singleDestination">
        
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
                   <span  className="textD">Departure<small> </small> </span>
                   <span>{des.DepartureDate}<small> </small> </span>
                   {des.TripType==="Roudtrip"? (<><span className="textD">  To  <small> </small> </span><span>{des.ReturnDate}<small> </small> </span></>):
                        (<><span className="textD"> </span><span>One way<small> </small> </span></>)}
                 </div>
                 
                 <div className="price">
                    
                   <h5>{des.Price}$</h5>
                 </div>
              </div>
   
              <div className="desc">
               <p>Airline: {des.Description}</p>
              </div>
      
                 <button className='btn flex'>Order <HiClipboardList className="icon"/> </button>
                </div>
              </div>
      
            )
          }) 
        }
      </div>
     
    </section>
  )
}

export default Main