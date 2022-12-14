import React, {useEffect,useState} from 'react'
import './main.css'
import {HiOutlineLocationMarker} from 'react-icons/hi'
import {HiClipboardList} from 'react-icons/hi'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase-config'
import { useHistory } from 'react-router-dom'

const Main = (props) => {
  const destenationRef = collection(db,"destenation")
  const [Destenation,setDestenation] = useState([]);

  let history = useHistory();
  
  useEffect(() => {
    fetchFlights();
    Aos.init({duration: 4000})
  }, [props.Filters])

  async function fetchFlights(){

    const data = await getDocs(destenationRef) 
    var allDestenations=data.docs.map((doc) => (doc.data()));

    var today=new Date();
    
    setDestenation(allDestenations.filter(des => new Date(des.DepartureDate) >  today && des.Nseats > 0));

    if (props.Filters)
    {
        var result;
      if (props.Filters.TripType)
      {
         result = Destenation.filter(des => des.TripType===props.Filters.TripType);
      }

      if (props.Filters.Location)
      {
          result = result.filter(des => des.Location===props.Filters.Location);
      }

      if (props.Filters.Destination)
      {
          result = result.filter(des => des.Destination===props.Filters.Destination);
      }  
 
      if (props.Filters.DepartureDate)
      {
          result = result.filter(des => des.DepartureDate===props.Filters.DepartureDate);
      }  

      if (props.Filters.ReturnDate)
      {
          result = result.filter(des => des.ReturnDate===props.Filters.ReturnDate);
      }
      
      if(props.Filters.Price)
      {
        console.log(props.Filters.Price[0])
        result = result.filter(des =>  des.Price < props.Filters.Price[1] &&  des.Price > props.Filters.Price[0]);
      }
      setDestenation(result)
    }   
  }


  const Order = async (des) => {
    history.push({
      pathname: 'Order',
      state: des
  });   }


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
                 <div className="grade ">


                  
                   <span  className="textD ">Departure </span>
                   <span>{des.DepartureDate} </span>
                   <span> at {des.DepartureTime} </span>

                   {des.TripType==="Roudtrip"? (<><span className="textD ">  To </span><span>{des.ReturnDate} </span> <span> at {des.ReturnTime} </span></>):
                        (<><span className="textD "> </span><span>One way</span></>)}   
                 </div>  
                  
              </div>

                <div className="price">                   
                      <h5>{des.Price}$</h5>
                    </div> 
                <div className="desc">

               <p>Airline: {des.Description}</p>
              </div>
                 <button className='btn flex'  onClick={() => Order(des)}>Order <HiClipboardList className="icon"/> </button>
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