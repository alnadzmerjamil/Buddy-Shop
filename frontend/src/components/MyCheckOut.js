import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import mecheckout from '../mycss/mycheckout.css';
import axios from 'axios';
class MyCheckOut extends React.Component {
  state = {
    total: 0,
    shippingFee: 0,
    standardShippingFee: 0,
    inputMessage: '',
    inputCourier: 'LBC',
    inputTypeOfDelivery: 'Door to door',
    inputModeOfPayment: '--SELECT--',
    redirect: false,
    userFullName: '',
    userEmail: '',
    userContactNumber: '',
    userAddress: '',
    userInformationForm: false,
    redirectToHome: false,
  };
  componentDidMount = () => {
    let total = 0; //amount of payment
    let shippingFee = 0;

    if (this.props.user) {
      if (this.props.user.information.length !== 0) {
        let userInformation = this.props.user.information[0];
        let userFullName = `${userInformation.firstName} ${userInformation.middleName} ${userInformation.lastName}`;
        this.setState({
          userFullName: userFullName,
          userEmail: userInformation.emailAddress,
          userContactNumber: userInformation.contactNumber,
          userAddress: userInformation.address,
        });
      }
    }
    let placeOrderCopy = this.props.placeOrder.slice(0);
    placeOrderCopy.forEach((order) => {
      total += order.subTotal;
      if (order.mainCategory === 'Fashion') {
        if (order.quantity > 10) {
          shippingFee += 300;
        } else if (order.quantity > 5) {
          shippingFee += 200;
        } else if (order.quantity > 3) {
          shippingFee += 100;
        } else {
          shippingFee += 50;
        }
      } else {
        if (order.quantity > 10) {
          shippingFee += 400;
        } else if (order.quantity > 5) {
          shippingFee += 300;
        } else if (order.quantity > 3) {
          shippingFee += 200;
        } else {
          shippingFee += 100;
        }
      }
    });
    this.setState({
      shippingFee: shippingFee,
      standardShippingFee: shippingFee,
      total: total,
    });
  };

  courierHandler = (e) => {
    let courier = e.target.value;
    this.setState({ inputCourier: e.target.value });
    if (
      courier === 'LBC' &&
      this.state.inputTypeOfDelivery === 'Door to door'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee });
    } else if (
      courier === 'LBC' &&
      this.state.inputTypeOfDelivery === 'Pick up'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 25 });
    } else if (
      courier === 'JRS' &&
      this.state.inputTypeOfDelivery === 'Door to door'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 10 });
    } else if (
      courier === 'JRS' &&
      this.state.inputTypeOfDelivery === 'Pick up'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 30 });
    } else if (
      courier === 'JNT' &&
      this.state.inputTypeOfDelivery === 'Door to door'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 15 });
    } else if (
      courier === 'JNT' &&
      this.state.inputTypeOfDelivery === 'Pick up'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 35 });
    }
  };
  //
  typeOfDeliveryHandler = (e) => {
    let typeOfDelivery = e.target.value;
    this.setState({ inputTypeOfDelivery: e.target.value });
    if (
      typeOfDelivery === 'Door to door' &&
      this.state.inputCourier === 'LBC'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee });
    } else if (
      typeOfDelivery === 'Pick up' &&
      this.state.inputCourier === 'LBC'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 25 });
    } else if (
      typeOfDelivery === 'Door to door' &&
      this.state.inputCourier === 'JRS'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 10 });
    } else if (
      typeOfDelivery === 'Pick up' &&
      this.state.inputCourier === 'JRS'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 30 });
    } else if (
      e.target.value === 'Door to door' &&
      this.state.inputCourier === 'JNT'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 15 });
    } else if (
      typeOfDelivery === 'Pick up' &&
      this.state.inputCourier === 'JNT'
    ) {
      this.setState({ shippingFee: this.state.standardShippingFee - 35 });
    }
  };

  //place order
  placeOrderBtn = () => {
    if (this.state.inputModeOfPayment === '--SELECT--') {
      return alert('Please select Mode of Payment');
    } else if (
      this.state.userFullName === '' ||
      this.state.userEmail === '' ||
      this.state.userContactNumber === '' ||
      this.state.userAddress === ''
    ) {
      this.setState({ userInformationForm: true });
      return alert('Please fill in the user information');
    }
    let myOrder;
    let placeOrderCopy = this.props.placeOrder.slice(0);

    myOrder = {
      items: placeOrderCopy,
      status: 'pending',
      courier: this.state.inputCourier,
      typeOfDelivery: this.state.inputTypeOfDelivery,
      modeOfPayment: this.state.inputModeOfPayment,
      shippingFee: this.state.shippingFee,
      userFullName: this.state.userFullName,
      userEmail: this.state.userEmail,
      userContactNumber: this.state.userContactNumber,
      userAddress: this.state.userAddress,
      message: this.state.inputMessage,
      date: new Date(),
      user: this.props.user,
    };

    //save order to db
    axios.post('http://localhost:8080/order', myOrder).then((order) => {
      console.log(order.data);
      this.setState({ redirect: !this.state.redirect });
    });
    this.props.addToCheckOut([]); //to empty the checkout
  };

  //for mode of payment
  modeOfPaymentHandler = (e) => {
    this.setState({ inputModeOfPayment: e.target.value });
  };

  //cancel
  cancelHandler = () => {
    if (window.confirm('Are you sure to cancel')) {
      this.setState({ redirectToHome: true });
    }
  };
  render() {
    console.log(this.state.userFullName);
    console.log(this.props.placeOrder);
    //this is for peso currency
    let money = this.state.total + this.state.shippingFee;
    let arrOfMoney = money.toString().split('');
    let points;
    let hundredth;
    let thousands;
    let million;
    let total;
    arrOfMoney.forEach((digit, i) => {
      if (digit === '.') {
        points = arrOfMoney.splice(i).join('');
      }
    });
    if (arrOfMoney.length > 9) {
      // alert('Something went wrong on total');
    } else if (arrOfMoney.length > 6 || arrOfMoney.length === 9) {
      hundredth = arrOfMoney.splice(-3).join('');
      thousands = arrOfMoney.splice(-3).join('');
      million = arrOfMoney.slice(0).join('');
      total = million + ',' + thousands + ',' + hundredth;
    } else if (arrOfMoney.length > 3) {
      hundredth = arrOfMoney.splice(-3).join('');
      thousands = arrOfMoney.slice(0).join('');
      total = thousands + ',' + hundredth;
    } else {
      total = money;
    }
    if (points) {
      total += points;
    }
    //
    return (
      <div className="main-container-mycheckout">
        {this.state.redirect && <Redirect to="/history" />}
        {this.state.redirectToHome && <Redirect to="/allitems" />}
        <div className="mini-container-mycheckout">
          <div className="mycheckout-text">
            <p>MY CHECK OUT</p>
          </div>
          {this.props.user ? (
            <div className="div-for-user-info">
              {this.state.userFullName !== '' ? (
                <>
                  <p>{this.state.userFullName}</p>
                  <p>{this.state.userEmail}</p>
                  <p>{this.state.userContactNumber}</p>
                  <p>{this.state.userAddress}</p>
                </>
              ) : (
                <p>{this.props.user.username}</p>
              )}
            </div>
          ) : (
            ''
          )}
          <div className="div-description-bar " id="description-bar">
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
          {this.props.placeOrder.map((item) => {
            return (
              <div
                className="div-per-item div-per-item-check-out"
                key={item.name}
              >
                <div className="div-for-check-and-image">
                  <div className="div-for-img-cart">
                    <div className="div-for-item-image">
                      <img
                        className="img-cart"
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                  </div>
                  <div className="div-for-item-name-cart item-name">
                    {item.name}
                  </div>
                </div>
                <div className="div-for-item-quantity item-quantity">
                  <small>{item.quantity}</small>
                </div>
                <div className="div-for-item-price item-price">
                  <small>Php {item.price}</small>
                </div>
                <div className="div-for-item-subtotal">
                  <small>Php {item.subTotal} </small>
                </div>
              </div>
            );
          })}
          <div className="div-for-more-details">
            <div className="message-to-seller">
              <label className="lblmessage">Message:</label>
              <input
                className="input-message"
                placeholder="Type your message to us..."
                value={this.state.inputMessage}
                onChange={(e) => {
                  this.setState({ inputMessage: e.target.value });
                }}
              ></input>
            </div>

            <div className="div-for-shipping">
              <label className="lblshipping-option">Shipping option</label>
              <div className="div-for-courier">
                <div>Courier</div>
                <select
                  className="input-courier"
                  value={this.state.inputCourier}
                  onChange={(e) => this.courierHandler(e)}
                >
                  <option>LBC</option>
                  <option>JRS</option>
                  <option>JNT</option>
                </select>
              </div>
              <div className="div-for-delivery">
                <div>Type of delivery </div>
                <select
                  className="input-type-of-delivery"
                  value={this.state.inputTypeOfDelivery}
                  onChange={(e) => this.typeOfDeliveryHandler(e)}
                >
                  <option>Door to door</option>
                  <option>Pick up</option>
                </select>
              </div>
              <div className="div-for-mode-of-payment">
                <div>Mode of payment </div>
                <select
                  className="input-mode-of-payment"
                  value={this.state.inputModeOfPayment}
                  onChange={(e) => this.modeOfPaymentHandler(e)}
                >
                  {' '}
                  <option>--select--</option>
                  <option>Palawan Express</option>
                  <option>Gcash</option>
                  <option>Cash on delivery/pickup</option>
                </select>
              </div>
            </div>
            <div className="div-for-sf">
              <label className="lbl-sf">Shipping Fee:</label>
              <div id="totalSf"> Php {this.state.shippingFee}</div>
            </div>
          </div>
          <div className="div-for-place-order">
            <label className="lbltotal">Total Amount : Php {total}</label>
            <div className="div-for-cancel-and-placeorder">
              <button className="cancel-btn" onClick={this.cancelHandler}>
                CANCEL
              </button>
              <button className="place-orderBtn" onClick={this.placeOrderBtn}>
                Place Order
              </button>
            </div>
          </div>
        </div>
        {/* user information form */}
        {this.state.userInformationForm ? (
          <div className="div-for-user-information">
            <div className="div-user-info-content">
              <label className="el user-information-text">
                User Information
              </label>
              <label className="el">Full Name</label>
              <input
                className="input-user-info el"
                type="text"
                value={this.state.userFullName}
                onChange={(e) => {
                  this.setState({ userFullName: e.target.value });
                }}
              ></input>
              <label className="el">Email Address</label>
              <input
                className="input-user-info el"
                type="email"
                value={this.state.userEmail}
                onChange={(e) => {
                  this.setState({ userEmail: e.target.value });
                }}
              ></input>
              <label className="el">Contact Number</label>
              <input
                className="input-user-info el"
                type="number"
                value={this.state.userContactNumber}
                onChange={(e) => {
                  this.setState({ userContactNumber: e.target.value });
                }}
              ></input>
              <label className="el">Address</label>
              <input
                className="input-user-info el"
                type="text"
                value={this.state.userAddress}
                onChange={(e) => {
                  this.setState({ userAddress: e.target.value });
                }}
              ></input>
              <div className="div-ok-cancel el">
                <button
                  className="btn-user-info"
                  onClick={() => {
                    this.setState({
                      userInformationForm: false,
                      userFullName: '',
                      userEmail: '',
                      userContactNumber: '',
                      userAddress: '',
                    });
                  }}
                >
                  CANCEL
                </button>{' '}
                <button
                  className="btn-user-info"
                  onClick={() => {
                    this.setState(
                      { userInformationForm: false },
                      this.placeOrderBtn
                    );
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    user: store.user,
    placeOrder: store.placeOrder,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToCheckOut: () => dispatch({ type: '' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyCheckOut);
