import React,{useEffect,useState} from "react";
import Button from "@material-ui/core/Button";
import styled from 'styled-components'


const Styles = styled.div`
  padding: 1rem;
  margin-top:100px;

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

 const {orderId}=props.match.params;


 useEffect(()=>{
  fetch(`https://jsonplaceholder.typicode.com/users/${orderId}`)
  .then(res => res.json())
  .then(
    (result) => {
      console.log(result,"Woka");
      const data= [
        {
            "order_id": 904563,
            "sku_no": "TR-1",
            "quantity": 10,
            "location": "shelf-2",
            "descriptions": "hey baby",
            "status": "PENDING"
        },
        {
            "order_id": 904563,
            "sku_no": "TR-20",
            "quantity": 12,
            "location": "shelf-1",
            "descriptions": "wassup meeen",
            "status": "PENDING"
        },
        {
            "order_id": 904563,
            "sku_no": "TR-15",
            "quantity": 10,
            "location": "shelf-2",
            "descriptions": "hey baby",
            "status": "PENDING"
        }
    ]
      
      setOrderList(data);

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
  intervalID=setInterval(()=>{
   console.log("Harish");
   fetch(`https://jsonplaceholder.typicode.com/users/${orderId}`)
   .then(res => res.json())
   .then(
     (result) => {
       console.log(result,"Woka");
       const data= [
         {
             "order_id": 904563,
             "sku_no": "TR-1",
             "quantity": 10,
             "location": "shelf-2",
             "descriptions": "hey baby",
             "status": "PENDING"
         },
         {
             "order_id": 904563,
             "sku_no": "TR-20",
             "quantity": 12,
             "location": "shelf-1",
             "descriptions": "wassup meeen",
             "status": "PENDING"
         },
         {
             "order_id": 904563,
             "sku_no": "TR-15",
             "quantity": 10,
             "location": "shelf-2",
             "descriptions": "hey baby",
             "status": "PENDING"
         }
     ]
       
 
     },
     (error) => {
       // setIsLoaded(true);
       // setError(error);
     })
   
  },3000)
  return () => {
    alert("hai");
    clearInterval(intervalID);
  }


},[])


const pickNextItem=()=>{
  currentIndex<orderList.length-1 && setCurrentIndex(currentIndex+1);
}
  return (
    <Styles>
      {orderList.length &&
      <div>
      <table>
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
            <div> Available Quantity: 0</div>
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
