import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import preview from '../mycss/preview.css';
class PreviewItem extends React.Component {
  state = {
    quantity: 1,
    imageIndex: 0,
    buyNow: false,
  };
  arrowLeft = () => {
    if (this.state.imageIndex === 0) {
      return;
    }
    this.setState({
      imageIndex: this.state.imageIndex - 1,
    });
  };
  arrowRight = () => {
    let imgIndex = this.props.item.image.length;
    if (this.state.imageIndex === imgIndex - 1) {
      return;
    }
    this.setState({
      imageIndex: this.state.imageIndex + 1,
    });
  };

  //buyNow
  buyNowBtn = () => {
    if (this.props.user === null) {
      return alert('Please login to proceed');
    }
    let buyNow = [];
    let myOrder = {
      name: this.props.item.name,
      quantity: Number(this.state.quantity),
      price: this.props.item.price,
      mainCategory: this.props.item.mainCategory,
      subCategory: this.props.item.subCategory,
      subTotal: this.props.item.price * this.state.quantity,
      image: this.props.item.image[0],
      status: 'pending',
      user: this.props.user.username,
    };
    buyNow.push(myOrder);
    this.props.placeOrder(buyNow);
    this.setState({ buyNow: true });
  };

  //order and send to local storage as myCart
  addToCartBtn = () => {
    if (this.props.user === null) {
      return alert('Please login to proceed');
    }
    let myOrder = {
      name: this.props.item.name,
      quantity: Number(this.state.quantity),
      price: this.props.item.price,
      mainCategory: this.props.item.mainCategory,
      subCategory: this.props.item.subCategory,
      subTotal: this.props.item.price * this.state.quantity,
      image: this.props.item.image[0],
      status: 'pending',
      user: this.props.user.username,
    };

    let myCart;
    if (JSON.parse(localStorage.getItem('myCart')) !== null) {
      myCart = JSON.parse(localStorage.getItem('myCart'));
      let exist = myCart.filter((inMyCart) => inMyCart.name === myOrder.name);
      exist = exist.filter(
        (myExist) => myExist.user === this.props.user.username
      );
      if (exist.length > 0) {
        console.log('meron');
        exist[0].quantity += myOrder.quantity;
        exist[0].subTotal = exist[0].quantity * exist[0].price;
        myCart.forEach((inMyCart, index) => {
          if (
            inMyCart.name === exist[0].name &&
            inMyCart.user === exist[0].user
          ) {
            myCart.splice(index, 1);
          }
        });
        myCart.push(exist[0]);
        console.log(myCart);
        localStorage.setItem('myCart', JSON.stringify(myCart));
      } else {
        console.log('wala');
        myCart.push(myOrder);
        console.log(myCart);
        localStorage.setItem('myCart', JSON.stringify(myCart));
      }
    } else {
      myCart = [];
      myCart.push(myOrder);
      localStorage.setItem('myCart', JSON.stringify(myCart));
    }
    this.props.addToCart(JSON.parse(localStorage.getItem('myCart')));
  };

  //
  render() {
    return (
      <div className="main-container preview">
        {this.state.buyNow && <Redirect to="/mycheckout" />}
        <div className="mini-container mini-preview">
          <div className="div-for-main-content">
            <div className="div-for-xbtn">
              <button id="xbtn" onClick={() => this.props.addToPreview(null)}>
                X
              </button>
            </div>

            <div className="div-for-img-preview">
              <div className="div-for-arrow">
                <i
                  className="fas fa-chevron-left arrowLeft"
                  onClick={this.arrowLeft}
                ></i>
              </div>
              <div className="div-for-display-img">
                <img
                  id="img-preview"
                  src={this.props.item.image[this.state.imageIndex]}
                  alt="For image"
                />
              </div>
              <div className="div-for-arrow">
                <i
                  className="fas fa-chevron-right arrowRight"
                  onClick={this.arrowRight}
                ></i>
              </div>
            </div>
            <div className="div-for-mini-content">
              <div className="div-for-details">
                <div className="content" id="item-name">
                  {this.props.item.name}
                </div>
                <div className="content" id="item-price">
                  Php {this.props.item.price}
                </div>
                <div className="div-for-btns content">
                  <button
                    className="btns"
                    id="buynow-btn"
                    onClick={this.buyNowBtn}
                  >
                    BUY NOW
                  </button>
                  <button
                    className="btns"
                    id="addtocart-btn"
                    onClick={this.addToCartBtn}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
              <div className="div-for-description" id="item-description">
                <p>
                  a prevailing custom or style of dress, etiquette, socializing,
                  etc.; mode: the latest fashion in boots. 2. conventional usage
                  in dress, manners, etc., esp. of polite society, or conformity
                  to it: to be out of fashion. 3. manner; way; mode: in a
                  warlike fashion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStatetoProps = (store) => {
  return {
    user: store.user,
    preview: store.preview,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToPreview: (req) => dispatch({ type: 'ADD_TO_PREVIEW', payload: req }), //to null (closed this page)
    addToCart: (myOrder) => dispatch({ type: 'ADD_TO_CART', payload: myOrder }),

    placeOrder: (myOrder) =>
      dispatch({ type: 'PLACE_ORDER', payload: myOrder }),
  };
};
export default connect(mapStatetoProps, mapDispatchToProps)(PreviewItem);
