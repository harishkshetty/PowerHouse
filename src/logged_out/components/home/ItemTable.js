import React,{useEffect,useState} from "react";
import Button from "@material-ui/core/Button";
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Styles = styled.div`
  padding: 1rem;
  margin-top:100px;
  margin-bottom:100px;

  table {
    border-spacing: 0;
    border: 1px solid black;
    height:400px;
    width:50%;
    margin:0 auto;

   .main{
     text-align: left;
   }
    tr {
    border:1px solid black;
    }

    th,
    td {
      margin: 0;
      font-weight: bold;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
    }
  }
`

const ItemTable = (props) => {
const [orderList,setOrderList] = useState([]);
// const [currentOrder,currentOrderList] = useState({});
const [currentIndex,setCurrentIndex] = useState(0);
const [color,setColor]=useState("#ffffff");
const [ActualQuantity,setActualQuantity] =useState(0);

const colorList={
  0:"#FFFFFF",
1:"#F3F30E",
2:"#F30E30",
3:"#49BC2C",
}

 const {orderId}=props.match.params;
 if(currentIndex >= orderList.length && orderList.length>0){
  props.history.push("/c/dashboard");
}

 useEffect(()=>{
  fetch(`http://54.254.213.97:8080/order/get?searchParam=order_id&searchStr=${orderId}`)
  .then(res => res.json())
  .then(
    (result) => {  
      const order= result.filter((item)=>{
        return item.status==="PENDING";
      })
      order.length == 0 && toast.warn("No Pending Orders",{hideProgressBar: true,autoClose: 2000});
      setOrderList(order);

    },
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    (error) => {
      // setIsLoaded(true);
      // setError(error);
    }
  )

},[orderId]);

useEffect(() => {
  let intervalID;
  if(orderList.length>0 && currentIndex<orderList.length){
  intervalID=setInterval(()=>{
   fetch("http://54.254.213.97:8080//get/actual_count",{ method: 'POST', 
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({"sku_no" : orderList[currentIndex]['sku_no'],
   "order_id" : orderList[currentIndex]['order_id']})})
   .then(res => res.json())
   .then(
     (result) => {  
     setColor(colorList[result['Screen colour']]);
     setActualQuantity(result['Actual_count']);
     if(result['Screen colour']===3){
      toast.success("Item Picked",{hideProgressBar: true,autoClose: 500});
      setTimeout(() => {
      setCurrentIndex(currentIndex+1);
       setActualQuantity(0);
       setColor("#ffffff");
     },1000);
    }
     },
     (error) => {
       // setIsLoaded(true);
       // setError(error);
     })
   
  },3000)
  return () => {
    clearInterval(intervalID);
  }
  }

},[orderList,currentIndex])


const pickNextItem=()=>{
  if(currentIndex<orderList.length-1){
    fetch("http://54.254.213.97:8080/post/skip_sku",{ method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"sku_no" : orderList[currentIndex]['sku_no'],
    "order_id" : orderList[currentIndex]['order_id']})})
    .then(res => res.json())
    .then(
      (result) => {},
      (error) => {})
  }

  currentIndex<orderList.length-1 ? setCurrentIndex(currentIndex+1):props.history.push("/c/dashboard");
  currentIndex<orderList.length-1 && setColor("#ffffff");
}

  return (
    <Styles>
            <ToastContainer/>

      {(orderList.length>0 && currentIndex<=orderList.length-1) &&
      <div>
      <table style={{backgroundColor:color}}>
        <tr>
          <th colspan="2" className="main">OrderId: {orderList[currentIndex].order_id}</th>
        </tr>
        <tr>
          <td>SKU: {orderList[currentIndex].sku_no}</td>
          <td>Location: {orderList[currentIndex].location}</td>
        </tr>
        <tr>
          <td>
            <div>Quantity: {orderList[currentIndex].quantity}</div>
            <div> Actual Quantity: {ActualQuantity}</div>
          </td>
          <td>Description: {orderList[currentIndex].descriptions}</td>
        </tr>
      </table>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Button  onClick={pickNextItem} variant="contained" color="secondary">
          Next Item:
        </Button>
      </div>
      </div>
}
    </Styles>
  );
};

export default ItemTable;
