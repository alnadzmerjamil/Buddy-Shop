import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import MyCart from './MyCart';
import { Link } from 'react-router-dom';
// import Transactions from './Transactions';
import mycartstyle from '../mycss/mycart.css';
//dito ako mag-lalagay ng mga items na nasa cart
class MyCartMap extends React.Component {
  state = {
    quantity: 1,
    itemsInMyCartCopy: this.props.myCartCopy //array of object(all items in my cart)
      ? this.props.myCartCopy.slice(0)
      : null,
    myCheckout: [], //container of my order
    remainsOnMyCart: [],
    date: new Date(),
    selectAll: this.props.selectAll,
    selectAllItems: false, //pang check all or uncheck all
    subTotal: 0,
  };
  selectAll = () => {
    this.setState({ selectAllItems: !this.state.selectAllItems });

    this.props.toSelectAll(!this.props.selectAll); //to check all
    let myCheckOutItemsCopy = this.props.myCheckOutItems.slice(0);
    let myCartCopy = this.props.myCartCopy.filter(
      (inMyCart) => inMyCart.user === this.props.user.username
    );
    console.log(myCheckOutItemsCopy);
    console.log(myCartCopy);

    if (this.state.selectAllItems) {
      //magtotrue yan sa pangalawang click. pang empty, pang uncheck sa lahat
      alert('dapat empty na');
      this.props.addToCheckOut([]);
    } else {
      //1st ,3rd ,5th click
      if (myCheckOutItemsCopy.length > 0) {
        alert('my na checked kana');
        myCartCopy.forEach((originalItemInCart) => {
          let filtered = myCheckOutItemsCopy.filter((inMyCheckOut) => {
            return originalItemInCart.name === inMyCheckOut.name;
          });

          if (filtered.length === 0) {
            myCheckOutItemsCopy.push(originalItemInCart);
            //item na hindi pa na check
          }
        });
      } else {
        alert('di kapa nakapag check');
        myCheckOutItemsCopy = myCartCopy;
      }
      this.props.addToCheckOut(myCheckOutItemsCopy);
    }

    console.log(myCheckOutItemsCopy);
    console.log(myCartCopy);
  };

  checkOutBtn = () => {
    this.props.placeOrder(this.props.myCheckOutItems.slice(0));
    this.props.toSelectAll(false); //to check/uncheck all
    this.props.addToCheckOut([]); //to empty the checkout
  };
  //
  componentDidUpdate = (prevProps) => {
    if (prevProps.selectAll !== this.props.selectAll) {
      this.setState({ selectAll: this.props.selectAll });
    }
  };

  render() {
    console.log(this.props.myCheckOutItems);
    console.log(this.props.myCart);
    let subTotalDisplay = 0; //total price display @ bottom of cart
    if (this.props.myCheckOutItems.length > 0) {
      this.props.myCheckOutItems.forEach((sub) => {
        subTotalDisplay += sub.subTotal;
      });
    }

    return (
      <div className="cart-main-container">
        {this.props.user ? (
          this.props.myCart !== null &&
          this.props.myCart.filter(
            (item) => item.user === this.props.user.username
          ).length !== 0 ? (
            <div className="mini-container-mycart">
              <div
                className="
              my-cart-text"
              >
                <p>MY CART</p>
              </div>

              <div className="div-description-bar">
                <div className="div-description-name">
                  <span>Product</span>
                </div>
                <div className="div-description-quantity">
                  <span>Quantity</span>
                </div>
                <div className="div-description-price">
                  <span>Price</span>
                </div>
                <div className="div-description-total">
                  <span>Total</span>
                </div>
              </div>

              {/* map myCart */}
              {
                this.props.myCart
                  .filter((item) => item.user === this.props.user.username)
                  .map((item) => {
                    return (
                      <MyCart
                        item={item}
                        key={item.name}
                        selectAll={this.state.selectAll}
                      />
                    );
                  })
                //
              }

              {/* div below cart items */}
              <div className="div-for-check-all">
                <div className="div-for-item-checkall">
                  <span onClick={this.selectAll} id="span-input-all">
                    <input
                      onChange={(e) => {
                        console.log(e.target.value);
                      }}
                      type="checkbox"
                      checked={this.state.selectAll}
                    ></input>
                  </span>{' '}
                  <span id="span-all">All</span>
                </div>
                <span className="span-sub-total">Php {subTotalDisplay}</span>
                <div className="div-for-check-out">
                  {this.props.myCheckOutItems.length > 0 ? (
                    <Link to="/mycheckout">
                      <button
                        className="checkOutBtn"
                        onClick={this.checkOutBtn}
                      >
                        CHECK OUT
                      </button>
                    </Link>
                  ) : (
                    <button className="checkOutBtn-disabled" disabled>
                      CHECK OUT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div>Your cart is empty!</div>
              <div>
                <button>ADD NOW</button>
              </div>
            </div>
          )
        ) : (
          <div>Login to see your cart items</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    user: store.user,
    myCart: store.myCart,
    myCartCopy: store.myCartCopy,
    myCheckOutItems: store.myCheckOutItems,
    checkOutBtn: store.checkOutBtn,
    selectAll: store.selectAll,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToCheckOut: (myOrder) =>
      dispatch({ type: 'ADD_TO_CHECKOUT', payload: myOrder }),
    toSelectAll: (req) => dispatch({ type: 'SELECT_ALL', payload: req }),
    placeOrder: (req) => dispatch({ type: 'PLACE_ORDER', payload: req }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCartMap);
