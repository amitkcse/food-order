import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
var axios = require('axios');
var baseUrl = 'http://localhost:3051';


class App extends Component {
  constructor (props) {
        super(props);
        this.state ={
          items:[],
          orderItem:{_id: ''},
          orderQuantity:''
        }
}
  componentDidMount() {
      this.loadItems();
}

loadItems(){
    axios.post(baseUrl+'/view-items')
        .then((response)=>{
            if(response.status===200){
                var itemsData= response.data ?response.data:[];
                this.setState({
                  items: itemsData});
            }})
        .catch((error)=>{
            alert('Someting wrong happened',error.response);
        })
}

  handleQuantityChange = event => {
        this.setState({ orderQuantity: event.target.value});
    };

  handleItemChange = event => {
     function searchItemInArray( _id, array){
          for (var i=0; i < array.length; i++) {
              if (array[i]._id === _id) {
                  return i;}}}
      var index = searchItemInArray(event.target.value,this.state.items);
      var orderItem = this.state.items[index] ? this.state.items[index]:{_id: ''};
      this.setState({ orderItem: orderItem});
      };

placeOrder(){
  if(this.state.orderItem._id && this.state.orderQuantity ){
    axios.post(baseUrl+'/place-order',{item: this.state.orderItem, quantity: this.state.orderQuantity})
         .then((response)=>{
            if(response.status===200){
                console.log(response.data)
                alert('Order Placed', response.data._id);
                this.setState({
                  orderItem:{_id: ''},
                  orderQuantity:''
                })
              }})
        .catch((error)=>{
            alert('Someting wrong happened',error.response);
        })
  } else {alert('both Item and Quantity Required');}

}

  render() {
    return (
      <div className="container">
        <nav className="navbar navbar-fixed-top" >
             <div className="navbar-header">
               <a className="navbar-brand" href="">Place Order</a>
             </div>
        </nav>
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
           <form className="form-group">
               <select className="form-control" value={this.state.orderItem._id} onChange={this.handleItemChange}>
                 <option value={this.state.orderItem}>Select Item</option>
                 {this.state.items.map(item => (<option value={item._id}>{item.name}</option> ))}
               </select>
              <label htmlFor="quantity" className="sr-only">Quantity</label>
                <input type="number" id="Quantity" className="form-control" placeholder="Quantity"
                   onChange={this.handleQuantityChange} value={this.state.orderQuantity}/>

           </form>
           <button className="btn btn-lg btn-primary btn-success" type="button"
                  onClick={this.placeOrder.bind(this)}>Place Order</button>
         </div>

    </div>
    );
  }
}

export default App;
