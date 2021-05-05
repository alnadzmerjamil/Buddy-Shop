import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import transaactions from '../mycss/transactions.css';
class Transactions extends React.Component {
  state = {
    shoppingHistory: [],

    showMyCompleted: false,
    showMyToReceive: false,
    showMyPending: true,
  };

  myCompletedHandler = () => {
    this.setState({
      showMyCompleted: true,
      showMyToReceive: false,
      showMyPending: false,
    });
  };
  myToReceiveHandler = () => {
    this.setState({
      showMyCompleted: false,
      showMyToReceive: true,
      showMyPending: false,
    });
  };
  myPendingHandler = () => {
    this.setState({
      showMyCompleted: false,
      showMyToReceive: false,
      showMyPending: true,
    });
  };
  componentDidMount = () => {
    axios
      .get(
        `http://localhost:8080/users/${
          JSON.parse(localStorage.getItem('user'))._id
        }`
      )
      .then((res) => {
        // console.log(res.data.orders);
        let all = this.state.shoppingHistory.slice(0);
        all = res.data.orders;
        this.setState({ shoppingHistory: all });
      });
  };
  willUpdateOrdersDisplay = () => {
    axios
      .get(
        `http://localhost:8080/users/${
          JSON.parse(localStorage.getItem('user'))._id
        }`
      )
      .then((res) => {
        // console.log(res.data.orders);
        let all = this.state.shoppingHistory.slice(0);
        all = res.data.orders;
        this.setState({ shoppingHistory: all });
      });
  };

  //once order has been received
  receivedBtn = (idToFind, items, idOfIndividualItem) => {
    // this.receiveIndividual(idToFind, idOfIndividualItem);
    let pendingAndAcceptedSiblings = items.filter(
      (item) => item.status === 'pending' || item.status === 'accepted'
    );
    let acceptedSiblings = items.filter((item) => item.status === 'accepted');
    let shippedSiblings = items.filter((item) => item.status === 'shipped');
    if (
      pendingAndAcceptedSiblings.length === 0 &&
      shippedSiblings.length <= 1
    ) {
      let status = {
        status: { status: 'received' },
        statusOfIndividualItem: 'received',
        idOfIndividualItem: idOfIndividualItem,
      };
      this.receiveIndividual(idToFind, status);
    } else if (acceptedSiblings.length === 0 && shippedSiblings.length <= 1) {
      let status = {
        status: { status: 'pending' },
        statusOfIndividualItem: 'received',
        idOfIndividualItem: idOfIndividualItem,
      };
      this.receiveIndividual(idToFind, status);
    } else {
      let status = {
        statusOfIndividualItem: 'received',
        idOfIndividualItem: idOfIndividualItem,
      };
      this.receiveIndividual(idToFind, status);
    }
  };

  receiveIndividual = (idToFind, status) => {
    axios
      .put(`http://localhost:8080/receiveorder/${idToFind}`, status, {
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
          this.willUpdateOrdersDisplay();
        }
      });
  };

  //cancel order
  cancelHandler = (mainItem, individualItem) => {
    // return alert(mainItem._id);
    let idToFind = mainItem._id;
    if (mainItem.items.length > 1) {
      // return alert('greater');
      let status = {
        idOfIndividualItem: individualItem._id,
      };
      axios
        .put(`http://localhost:8080/cancelorder/${idToFind}`, status, {
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
            this.willUpdateOrdersDisplay();
          }
        });
    } else {
      // return alert('less');
      axios
        .delete(`http://localhost:8080/cancelorder/${idToFind}`, {
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
            this.willUpdateOrdersDisplay();
          }
        });
    }
  };

  render() {
    console.log(this.state.shoppingHistory);
    // if (this.state.shoppingHistory.length > 0) {
    //   console.log(this.state.shoppingHistory);
    // }

    return (
      <div className="main-container-transaactions">
        <div className="header-transactions">
          <div onClick={this.myPendingHandler}>PENDING</div>
          <div onClick={this.myToReceiveHandler}>TO RECEIVE</div>
          <div onClick={this.myCompletedHandler}>COMPLETED</div>
        </div>

        {/* pending */}

        {this.state.showMyPending ? (
          <div className="mini-container-transactions">
            <div className="my-purchase-text">Pending</div>
            {this.state.shoppingHistory.length !== 0
              ? this.state.shoppingHistory
                  .filter(
                    (item) =>
                      item.status === 'pending' || item.status === 'portion'
                  )
                  .map((mainItem) => {
                    return mainItem.items
                      .filter((item) => item.status === 'pending')
                      .map((el) => {
                        return (
                          <div
                            className="div-per-item-transaction"
                            key={el._id}
                          >
                            <div className="div-for-img">
                              <img
                                className="img-transactions"
                                src={el.image}
                                alt={el.name}
                              />
                            </div>
                            <div className="div-for-content-transactions">
                              <p className="strong-transaction">{el.name}</p>
                              <span className="span-quantity">
                                Quantity {el.quantity}
                              </span>

                              <span>Price Php {el.price}</span>
                              <span>Total Php {el.price * el.quantity}</span>
                              <div className="div-for-date">
                                {mainItem.date.slice(0, 10)}
                              </div>
                              <div className="div-for-receive-btn">
                                <button
                                  id="cancelBtn"
                                  onClick={() =>
                                    this.cancelHandler(mainItem, el)
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                  })
              : ''}
          </div>
        ) : (
          ''
        )}

        {/* to received */}

        {this.state.showMyToReceive ? (
          <div className="mini-container-transactions">
            <div className="my-purchase-text">To Receive</div>
            {this.state.shoppingHistory.length !== 0
              ? this.state.shoppingHistory
                  .filter(
                    (item) =>
                      item.status === 'shipped' ||
                      item.status === 'portion' ||
                      item.status === 'accepted' ||
                      item.status === 'received'
                  )
                  .map((item) => {
                    return item.items
                      .filter((item) => item.status === 'shipped')
                      .map((el) => {
                        return (
                          <div
                            className="div-per-item-transaction"
                            key={el._id}
                          >
                            <div className="div-for-img">
                              <img
                                className="img-transactions"
                                src={el.image}
                                alt={el.name}
                              />
                            </div>
                            <div className="div-for-content-transactions">
                              <strong className="strong-transaction">
                                {el.name}
                              </strong>
                              <span className="span-quantity">
                                Quantity {el.quantity}
                              </span>

                              <span>Price Php {el.price}</span>
                              <span>Total Php {el.price * el.quantity}</span>
                              <div className="div-for-date">
                                {item.date.slice(0, 10)}
                              </div>
                              <div className="div-for-receive-btn">
                                <button
                                  id="receivedBtn"
                                  onClick={() => {
                                    this.receivedBtn(
                                      item._id,
                                      item.items,
                                      el._id
                                    );
                                  }}
                                >
                                  Received
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                  })
              : ''}
          </div>
        ) : (
          ''
        )}
        {/* completed */}

        {this.state.showMyCompleted ? (
          <div className="mini-container-transactions">
            <div className="my-purchase-text">My Purchases</div>
            {this.state.shoppingHistory.length !== 0
              ? this.state.shoppingHistory.map((item) => {
                  return item.items
                    .filter((item) => item.status === 'received')
                    .map((el) => {
                      return (
                        <div className="div-per-item-transaction" key={el._id}>
                          <div className="div-for-img">
                            <img
                              className="img-transactions"
                              src={el.image}
                              alt={el.name}
                            />
                          </div>
                          <div className="div-for-content-transactions">
                            <strong className="strong-transaction">
                              {el.name}
                            </strong>
                            <span className="span-quantity">
                              Quantity {el.quantity}
                            </span>

                            <span>Price Php {el.price}</span>
                            <span>Total Php {el.price * el.quantity}</span>
                            <div className="div-for-date">
                              {item.date.slice(0, 10)}
                            </div>
                          </div>
                        </div>
                      );
                    });
                })
              : ''}
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
    showAddItem: store.showAddItem,
    showAddCategory: store.showAddCategory,
    orders: store.orders,
  };
};
export default connect(mapStateToProps)(Transactions);
