import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
//dito ako magdidisplay ng mga items
class DisplayItems extends React.Component {
  state = {
    quantity: 1,
    price: this.props.item.price * 1,
    quantityOnItemForm: 0,
    showQuantity: false,
  };

  //will update all items
  updateAllItems = () => {
    axios.get('http://localhost:8080/getitems').then((allItems) => {
      this.props.dispatchToStore(allItems.data);
    });
  };

  //order and send to local storage as myCart
  orderBtn = () => {
    if (this.props.user === null) {
      return alert('Please login to proceed');
    }

    this.setState({
      showQuantity: true,
      quantityOnItemForm: this.state.quantityOnItemForm + 1,
    });
    // return;
    if (this.state.quantity === 0) {
      return alert('Please input quantity!');
    } else {
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
          // console.log(JSON.parse(localStorage.getItem('myCart')));
        }
      } else {
        myCart = [];
        myCart.push(myOrder);
        localStorage.setItem('myCart', JSON.stringify(myCart));
        // console.log(JSON.parse(localStorage.getItem('myCart')));
        // console.log(typeof JSON.parse(localStorage.getItem('myCart')));
      }
      this.props.addToCart(JSON.parse(localStorage.getItem('myCart')));
    }
  };

  //edit item
  editBtn = () => {
    let item = this.props.item;
    console.log(item);
    this.props.addToItemToBeEdited(item);
  };

  //delete item
  deleteBtn = () => {
    if (window.confirm('Are you sure to delete?')) {
      let idToFind = this.props.item._id;
      axios
        .delete(`http://localhost:8080/deleteitem/${idToFind}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            role: this.props.user.role,
          },
        })
        .then((deletedItem) => {
          if (deletedItem.data.error) {
            alert(deletedItem.data.error);
          } else {
            console.log(deletedItem.data);
            this.updateAllItems();
            alert('Item has been deleted');
          }
        });
    }
  };

  //
  dispatchToPreview = () => {
    let previewItem = {
      name: this.props.item.name,
      price: this.props.item.price,
      mainCategory: this.props.item.mainCategory,
      subCategory: this.props.item.subCategory,
      image: this.props.item.image,
    };
    this.props.addToPreview(previewItem);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  render() {
    // this is to control the quantity
    // if (this.state.quantity < 0) {
    //   this.setState({ quantity: 1 });
    // }

    return (
      <div className="div-per-item-items">
        <div className="div-for-item-content">
          <div className="div-for-figure">
            <figure className="figure-items">
              <img
                onClick={this.dispatchToPreview}
                className="img-items"
                src={this.props.item.image[0]}
                alt={this.props.item.name}
              />
              <figcaption className="figcaption-items">
                <small>{this.props.item.name}</small>
              </figcaption>
              <figcaption className="figcaption-items">
                <small className="small-item-price">
                  Php {this.props.item.price}
                </small>

                {this.state.showQuantity ? ( //ternary sa quantity
                  <input
                    className="input-quantity-on-item"
                    value={this.state.quantityOnItemForm}
                    onChange={() => console.log('hi')}
                  ></input>
                ) : (
                  ''
                )}
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="div-for-item-btns">
          {this.props.user ? ( //ternary sa button
            this.props.user.role === 'admin' ? (
              <div className="div-for-adminBtn">
                <button className="editBtn" onClick={this.editBtn}>
                  EDIT
                </button>{' '}
                <button className="deleteBtn" onClick={this.deleteBtn}>
                  DELETE
                </button>{' '}
              </div>
            ) : (
              <div className="div-for-userBtn">
                {/* <button className="buyNowBtn" onClick={this.buyNowBtn}>
                  BUY NOW
                </button>{' '} */}
                <button className="orderBtn" onClick={this.orderBtn}>
                  ADD TO CART
                </button>
              </div>
            )
          ) : (
            <div className="div-for-userBtn">
              {/* <button className="buyNowBtn" onClick={this.buyNowBtn}>
                BUY NOW
              </button>{' '} */}
              <button className="orderBtn" onClick={this.orderBtn}>
                ADD TO CART
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    user: store.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (myOrder) => dispatch({ type: 'ADD_TO_CART', payload: myOrder }),

    addToItemToBeEdited: (item) =>
      dispatch({ type: 'EDIT_ITEM', payload: item }),

    dispatchToStore: (allItems) =>
      dispatch({ type: 'DISPATCH_ALL_ITEMS', payload: allItems }),

    addToPreview: (previewItem) =>
      dispatch({ type: 'ADD_TO_PREVIEW', payload: previewItem }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DisplayItems);
