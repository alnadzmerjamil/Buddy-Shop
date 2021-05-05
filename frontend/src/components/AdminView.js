import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import adminstyle from '../mycss/adminstyle.css';
import AddItemForm from './AddItemForm';
import AddCategory from './AddCategory';
class AdminView extends React.Component {
  state = {
    showMyPurchase: true,
    showMyCompleted: false,
    showAddItem: false,
    showAddCategory: false,
  };

  addCategoryBtn = () => {
    this.props.showMyAddCategory(true);
  };
  addItemyBtn = () => {
    this.props.showMyAddItem(true);
  };

  xCategoryBtn = () => {
    this.setState({ showAddCategory: false });
  };
  xAddItemyBtn = () => {
    this.setState({ showAddItem: false });
  };
  componentDidMount = () => {
    axios.get(`http://localhost:8080/getorder`).then((res) => {
      // console.log(res.data);
      //localStorage.setItem('order', JSON.stringify(res.data));
      this.props.saveOrders(res.data);
    });
  };
  //reload updated orders
  willUpdateOrders = () => {
    axios.get(`http://localhost:8080/getorder`).then((res) => {
      this.props.saveOrders(res.data);
    });
  };

  //individual update
  updateIndividualItem = (idToFind, status) => {
    axios
      .put(`http://localhost:8080/acceptindividual/${idToFind}`, status, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          role: this.props.user.role,
        },
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          console.log(res.data);
          this.willUpdateOrders();
        }
      });
  };

  //update main status and individual status
  updateMainItem = (idToFind, status) => {
    axios
      .put(`http://localhost:8080/acceptorder/${idToFind}`, status, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          role: this.props.user.role,
        },
      })
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          console.log(res.data);
          this.willUpdateOrders();
        }
      });
  };

  //accept individual order
  acceptBtn = (idOfIndividualItem, idToFind, arrayOfIndividualItem) => {
    let arrayOfItems = arrayOfIndividualItem.filter(
      (item) => item.status === 'pending'
    );
    if (arrayOfItems.length === 1) {
      this.acceptAllBtn(idToFind);
    } else {
      let status = {
        status: { status: 'portion' },
        statusOfIndividualItem: 'accepted',
        idOfIndividualItem: idOfIndividualItem,
      };
      this.updateIndividualItem(idToFind, status);
    }
  };

  //accept all orders
  acceptAllBtn = (idToFind) => {
    let status = {
      status: { status: 'accepted' },
      statusOfIndividualItem: 'accepted',
    };
    this.updateMainItem(idToFind, status);
  };

  //send individual order
  sendHandler = (idOfIndividualItem, idToFind, arrayOfIndividualItem) => {
    let pendingItemsOfAnOrder = arrayOfIndividualItem.filter(
      (pendingItem) => pendingItem.status === 'pending'
    );
    let acceptedItemsOfAnOrder = arrayOfIndividualItem.filter(
      (acceptedItem) => acceptedItem.status === 'accepted'
    );
    if (
      pendingItemsOfAnOrder.length === 0 &&
      acceptedItemsOfAnOrder.length === 1
    ) {
      let status = { status: { status: 'shipped' } };
      this.updateMainItem(idToFind, status);
    } else {
      let status = {
        statusOfIndividualItem: 'shipped',
        idOfIndividualItem: idOfIndividualItem,
      };
      this.updateIndividualItem(idToFind, status);
    }
  };
  //send all orders
  sendAllHandler = (idToFind, arrayOfIndividualItem) => {
    let pendingItemsOfAnOrder = arrayOfIndividualItem.filter(
      (pendingItem) => pendingItem.status === 'pending'
    );
    if (pendingItemsOfAnOrder.length > 0) {
      return alert(
        `This order has ${pendingItemsOfAnOrder.length} pending item/s`
      );
    } else {
      let status = {
        status: { status: 'shipped' },
        statusOfIndividualItem: 'shipped',
      };
      this.updateMainItem(idToFind, status);
    }
  };

  //cancel
  cancelBtn = (status) => {
    alert(status);
  };
  cancelAllShipment = (idToFind, arrayOfIndividualItem) => {
    let pendingItemsOfAnOrder = arrayOfIndividualItem.filter(
      (pendingItem) => pendingItem.status === 'pending'
    );
    if (pendingItemsOfAnOrder.length > 0) {
      return alert(
        `This order has ${pendingItemsOfAnOrder.length} pending item/s`
      );
    } else {
      alert('pede mo i cancel');
    }
  };

  render() {
    console.log(this.props.user);
    // if (this.state.shoppingHistory.length > 0) {
    //   console.log(this.state.shoppingHistory);
    // }

    return (
      <div className="main-container-admin">
        <div className="div-for-addBtns">
          <button onClick={this.addItemyBtn}>ADD ITEM</button>
          <button onClick={this.addCategoryBtn}>ADD CATEGORY</button>
        </div>
        {this.props.showAddItem ? <AddItemForm /> : ''}
        {this.props.showAddCategory ? <AddCategory /> : ''}
        <div className="header-admin">
          <div className="complete-admin">PENDING</div>
          <div className="pending-admin">TO SHIP</div>
        </div>
        {/* PENDING */}
        <div className="mini-container-admin">
          {this.props.orders !== null
            ? this.props.orders
                .filter(
                  (order) =>
                    order.status === 'pending' || order.status === 'portion'
                )
                .map((pendingOrder) => {
                  return (
                    <div key={pendingOrder._id} id="div-group-of-orders">
                      {pendingOrder.items
                        .filter((item) => item.status === 'pending')
                        .map((final) => {
                          return (
                            <div
                              key={final.name}
                              className="div-per-item-admin"
                            >
                              <div className="div-for-img-admin">
                                <img
                                  className="img-admin"
                                  src={final.image}
                                  alt={final.name}
                                />
                              </div>

                              <div className="div-for-content-admin">
                                <div className="div-description">
                                  <span className="name-of-item span">
                                    Item Name
                                  </span>
                                  <span className="span">Quantity</span>
                                  <span className="span">Price</span>
                                </div>

                                <div className="div-description">
                                  <span className="name-of-item span">
                                    {final.name}
                                  </span>
                                  <span className="span">{final.quantity}</span>
                                  <span className="span">{final.price}</span>
                                </div>

                                <div id="div-for-subtotal">
                                  <span id="span-sub-total" className="span">
                                    Total: {final.quantity * final.price}
                                  </span>
                                </div>

                                <div className="div-for-Btn accept-cancel">
                                  <button
                                    className="acceptBtn"
                                    onClick={() => {
                                      this.acceptBtn(
                                        final._id, //individual id
                                        pendingOrder._id, //group of items id
                                        pendingOrder.items //array of individual items
                                      );
                                    }}
                                  >
                                    ACCEPT
                                  </button>{' '}
                                  <button className="deleteBtn">CANCEL</button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      {pendingOrder.items.filter(
                        (item) => item.status === 'pending'
                      ).length === 1 ? (
                        ''
                      ) : (
                        <div className="div-for-Btn acceptAll-cancel">
                          <button
                            className="acceptBtn"
                            onClick={() => this.acceptAllBtn(pendingOrder._id)}
                          >
                            ACCEPT ALL
                          </button>{' '}
                          <button
                            className="deleteBtn"
                            onClick={() => {
                              this.cancelBtn(pendingOrder.status);
                            }}
                          >
                            CANCEL ALL
                          </button>
                        </div>
                      )}

                      <div id="div-for-date">
                        <span>{pendingOrder.date.slice(0, 10)}</span>
                      </div>
                    </div>
                  );
                })
            : ''}
        </div>
        {/* to ship */}
        <div className="mini-container-admin">
          {this.props.orders !== null
            ? this.props.orders
                .filter(
                  (order) =>
                    order.status === 'accepted' ||
                    order.status === 'portion' ||
                    order.status === 'shipped'
                )
                .map((pendingOrder) => {
                  return (
                    <div key={pendingOrder._id} id="div-group-of-orders">
                      {pendingOrder.items
                        .filter(
                          (item) =>
                            item.status === 'accepted' ||
                            item.status === 'shipped'
                        )
                        .map((final) => {
                          return (
                            <div
                              key={final.name}
                              className="div-per-item-admin"
                            >
                              <div className="div-for-img-admin">
                                <img
                                  className="img-admin"
                                  src={final.image}
                                  alt={final.name}
                                />
                              </div>

                              <div className="div-for-content-admin">
                                <div className="div-description">
                                  <span className="name-of-item span">
                                    Item Name
                                  </span>
                                  <span className="span">Quantity</span>
                                  <span className="span">Price</span>
                                </div>

                                <div className="div-description">
                                  <span className="name-of-item span">
                                    {final.name}
                                  </span>
                                  <span className="span">{final.quantity}</span>
                                  <span className="span">{final.price}</span>
                                </div>

                                <div id="div-for-subtotal">
                                  <span id="span-sub-total" className="span">
                                    Total: {final.quantity * final.price}
                                  </span>
                                </div>

                                {final.status === 'shipped' ? (
                                  <div className="div-for-Btn accept-cancel">
                                    <button className="acceptBtn shipped">
                                      SHIPPED
                                    </button>
                                  </div>
                                ) : (
                                  <div className="div-for-Btn accept-cancel">
                                    <button
                                      className="acceptBtn"
                                      onClick={() => {
                                        this.sendHandler(
                                          final._id, //individual id
                                          pendingOrder._id, //group of items id
                                          pendingOrder.items //array of individual items
                                        );
                                      }}
                                    >
                                      SEND
                                    </button>{' '}
                                    <button className="deleteBtn">
                                      CANCEL
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                      <div className="div-for-Btn acceptAll-cancel">
                        {pendingOrder.status !== 'shipped' ? (
                          //if shipped all, no send all
                          <button
                            className="acceptBtn"
                            onClick={() =>
                              this.sendAllHandler(
                                pendingOrder._id,
                                pendingOrder.items
                              )
                            }
                          >
                            SEND ALL
                          </button>
                        ) : (
                          ''
                        )}{' '}
                        <button
                          className="deleteBtn"
                          onClick={() => {
                            this.cancelAllShipment(
                              pendingOrder._id,
                              pendingOrder.items
                            );
                          }}
                        >
                          CANCEL ALL
                        </button>
                      </div>

                      <div id="div-for-date">
                        <span>{pendingOrder.date.slice(0, 10)}</span>
                      </div>
                    </div>
                  );
                })
            : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    user: store.user,
    showAddItem: store.showAddItem,
    showAddCategory: store.showAddCategory,
    orders: store.orders,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showMyAddItem: (req) =>
      dispatch({ type: 'SHOW_MY_ADD_ITEM', payload: req }),
    showMyAddCategory: (req) =>
      dispatch({ type: 'SHOW_MY_ADD_CATEGORY', payload: req }),
    saveOrders: (orders) => dispatch({ type: 'SAVE_ORDERS', payload: orders }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AdminView);
