import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import mycartstyle from '../mycss/mycart.css';
//dito ako mag-lalagay ng mga items na nasa cart
class MyCart extends React.Component {
  state = {
    quantity: this.props.item.quantity,
    myCheckOutItems: [], //container of my order
    selectAll: this.props.selectAll,
    dotted: true,
    removeOption: false,
  };

  AddQuantityBtn = () => {
    let myCheckOutItemsCopy = this.props.myCheckOutItems.slice(0);

    if (myCheckOutItemsCopy.length === 0) {
      return alert('Please select this item before to add quantity');
    } else {
      let filtered = myCheckOutItemsCopy.filter(
        (item) => item.name === this.props.item.name
      );
      if (filtered.length === 0) {
        return alert('Please select this item before to add quantity');
      } else {
        //na select na
        myCheckOutItemsCopy.forEach((inMyCheckOut) => {
          if (inMyCheckOut.name === this.props.item.name) {
            inMyCheckOut.quantity += 1;
            inMyCheckOut.subTotal = inMyCheckOut.price * inMyCheckOut.quantity;
            this.props.addToCheckOut(myCheckOutItemsCopy);
          }
        });
      }
    }
    //setstate to update the quantity on front end
    this.setState({
      quantity: this.state.quantity + 1,
    });
  };

  minusQuantityBtn = () => {
    if (this.state.quantity === 1) {
      return;
    }
    let myCheckOutItemsCopy = this.props.myCheckOutItems.slice(0);

    if (myCheckOutItemsCopy.length === 0) {
      return alert('Please select this item before reducing the quantity');
    } else {
      let filtered = myCheckOutItemsCopy.filter(
        (item) => item.name === this.props.item.name
      );
      if (filtered.length === 0) {
        return alert('Please select this item before reducing the quantity');
      } else {
        //na select na
        myCheckOutItemsCopy.forEach((inMyCheckOut) => {
          if (inMyCheckOut.name === this.props.item.name) {
            inMyCheckOut.quantity -= 1;
            inMyCheckOut.subTotal = inMyCheckOut.price * inMyCheckOut.quantity;
            this.props.addToCheckOut(myCheckOutItemsCopy);
          }
        });
      }
    }
    //setstate to update the quantity on front end
    this.setState({
      quantity: this.state.quantity - 1,
    });
  };

  //this is to control the check out items

  checker = (item) => {
    this.setState({ selectAll: !this.state.selectAll });
    let myCheckOutItemsCopy = this.props.myCheckOutItems.slice(0);
    let myCheckoutToday = [];
    console.log(myCheckOutItemsCopy);

    if (myCheckOutItemsCopy.length === 0) {
      alert('Checked');
      myCheckoutToday.push(item);
      this.props.addToCheckOut(myCheckoutToday);
    } else {
      let filtered = myCheckOutItemsCopy.filter(
        (filtered) => filtered.name === this.props.item.name
      );

      if (filtered.length === 1) {
        //may nahanap na parehong item
        myCheckOutItemsCopy.forEach((inMyCheckOut, index) => {
          if (filtered[0].name === inMyCheckOut.name) {
            myCheckOutItemsCopy.splice(index, 1); //inuncheck ito
            alert('Uncheck');
          }
        });
        this.props.addToCheckOut(myCheckOutItemsCopy);
      } else {
        //walang nahanp na paarehong item sa checkoutItems
        myCheckOutItemsCopy.push(item);
        this.props.addToCheckOut(myCheckOutItemsCopy);
        // alert('wala na splice');
      }
    }
  };

  //remove from myCart
  removeItemHandler = () => {
    let updatedCart = JSON.parse(localStorage.getItem('myCart'));
    updatedCart.forEach((inMyCart, index) => {
      if (
        inMyCart.user === this.props.user.username &&
        inMyCart.name === this.props.item.name
      ) {
        updatedCart.splice(index, 1);
      }
    });
    localStorage.setItem('myCart', JSON.stringify(updatedCart));
    this.props.addToCart(updatedCart);
  };

  //if something updated
  componentDidUpdate = (prevProps) => {
    if (prevProps.selectAll !== this.props.selectAll) {
      this.setState({ selectAll: this.props.selectAll });
    }
    if (prevProps.doneCheckOut !== this.props.doneCheckOut) {
      this.setState({ selectAll: false });
    }
  };
  render() {
    return (
      <div className="div-per-item">
        <div className="div-for-remove-option">
          {!this.state.dotted ? (
            <div>
              <button id="remove-btn" onClick={this.removeItemHandler}>
                Remove
              </button>
              <button
                id="close-btn"
                onClick={() => {
                  this.setState({
                    removeOption: !this.state.removeOption,
                    dotted: !this.state.dotted,
                  });
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <i
              className="fas fa-ellipsis-v"
              id="i-dotted"
              onClick={() =>
                this.setState({
                  removeOption: !this.state.removeOption,
                  dotted: !this.state.dotted,
                })
              }
            ></i>
          )}
        </div>
        <div className="div-for-check-and-image">
          <div className="div-for-item-check">
            <span
              onClick={() => {
                this.checker({
                  name: this.props.item.name,
                  quantity: this.state.quantity,
                  price: this.props.item.price,
                  mainCategory: this.props.item.mainCategory,
                  subCategory: this.props.item.subCategory,
                  subTotal: this.state.quantity * this.props.item.price,
                  image: this.props.item.image,
                  status: this.props.item.status,
                });
              }}
            >
              <input
                onChange={(e) => {
                  console.log(e.target.value);
                }}
                checked={this.state.selectAll}
                type="checkbox"
                className="input-check"
                id="input-for-check"
              ></input>
            </span>
          </div>
          <div className="div-for-img-cart">
            <div className="div-for-item-image">
              <img
                className="img-cart"
                src={this.props.item.image}
                alt={this.props.item.name}
              />
            </div>
          </div>
          <div className="div-for-item-name-cart">{this.props.item.name}</div>
        </div>
        <div className="div-for-item-quantity">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <button
                    className="minusQuantityBtn"
                    onClick={this.minusQuantityBtn}
                  >
                    -
                  </button>
                </td>
                <td>
                  <input
                    className="input-quantity"
                    value={this.state.quantity}
                    onChange={(e) => {
                      this.setState({ quantity: e.target.value });
                    }}
                  ></input>
                </td>
                <td>
                  <button
                    className="addQuantityBtn"
                    onClick={this.AddQuantityBtn}
                  >
                    +
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="div-for-item-price">
          <small>Php {this.props.item.price}</small>
        </div>
        <div className="div-for-item-subtotal">
          <small>Php {this.state.quantity * this.props.item.price}</small>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    user: store.user,
    myCartCopy: store.myCartCopy,
    myCheckOutItems: store.myCheckOutItems,
    doneCheckOut: store.doneCheckOut,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (myOrder) => dispatch({ type: 'ADD_TO_CART', payload: myOrder }),

    addToCheckOut: (myOrder) =>
      dispatch({ type: 'ADD_TO_CHECKOUT', payload: myOrder }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCart);
