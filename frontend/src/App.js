import './App.css';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';
import AddItemForm from './components/AddItemForm';
import RegistrationForm from './components/RegistrationForm';
import ItemsForm from './components/ItemsForm';
import LogInForm from './components/LogInForm';
import MyCartMap from './components/MyCartMap';
import AddCategory from './components/AddCategory';
import UserProfile from './components/UserProfile';
import Transactions from './components/Transactions';
import AddminView from './components/AdminView';
import MyCheckOut from './components/MyCheckOut';

class App extends React.Component {
  state = {
    searchBar: '',
  };

  componentDidMount = () => {
    axios.get('http://localhost:8080/getitems').then((allItems) => {
      // console.log(allItems.data);
      this.props.dispatchToStore(allItems.data);
    });
    axios.get('http://localhost:8080/getcategory').then((category) => {
      // console.log(category.data[0].name);
      this.props.updateCategoryToStore(category.data);
    });
  };
  inputSearch = (e) => {
    this.props.searchWord(e.target.value); //tinaype sa search bar

    // TO GET ALL WORDS POSSIBLE TO BE SEARCHED(categories pa lang)
    let words = ''; //maincat and sub cat pa lang
    this.props.mainCategories.forEach((cat) => {
      words = words.concat(cat.name);
      cat.sub.forEach((sub) => {
        words = words.concat(sub);
      });
    });

    if (this.props.words === '') {
      this.props.dispatchWords(words);
    } else {
      return;
    }
  };

  render() {
    let userProfileHandler = () => {
      this.props.userShow(!this.props.userProfileShow);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    };
    let numberOfItemsInMyCart;
    if (this.props.myCartCopy !== null) {
      if (this.props.user) {
        numberOfItemsInMyCart = this.props.myCartCopy.filter(
          (item) => item.user === this.props.user.username
        );
      }
    }

    return (
      <>
        <div className="App">
          <nav className="main-navbar">
            <div className="div-title">
              <div className="div-buddy">
                <Link
                  className="linklink"
                  to="/allitems"
                  onClick={() => {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                  }}
                >
                  <strong>Buddy</strong>
                </Link>
              </div>
              <div className="div-shop">
                <strong>Shop</strong>
              </div>
            </div>
            <div className="div-search-center">
              <div className="div-input-select">
                {this.state.searchBar === '' ? (
                  <select
                    className="input-select"
                    onChange={(e) => {
                      this.props.filterByMainCategory(e.target.value);
                    }}
                  >
                    <option>Filter</option>
                    {this.props.mainCategories.length !== 0 //may nag search hidden anf filter
                      ? this.props.mainCategories.map((mainCat) => {
                          return (
                            <option key={mainCat.name}>{mainCat.name}</option>
                          );
                        })
                      : ''}
                  </select>
                ) : (
                  ''
                )}
              </div>
              <input
                className="input-search"
                placeholder="Search..."
                onChange={(e) => {
                  this.inputSearch(e);
                }}
              ></input>
            </div>
            <div className="div-profile">
              <div className="div-mycart">
                <Link
                  className="linklink-cart"
                  to="/mycart"
                  onClick={() => {
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                  }}
                >
                  <i className="fa fa-shopping-cart cart-icon"></i>
                </Link>
                {this.props.user ? (
                  <>
                    {this.props.myCartCopy ? (
                      <div className="div-for-number-of-item-on-cart">
                        {numberOfItemsInMyCart.length !== 0 ? (
                          <div className="div-number-of-item-on-cart">
                            {numberOfItemsInMyCart.length}
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}

                    <div className="div-myprofile-inCart">
                      <i
                        onClick={userProfileHandler}
                        className="fas fa-user-alt user-icon"
                      ></i>
                      <i
                        className="fas fa-bars bar-icon"
                        onClick={userProfileHandler}
                      ></i>
                    </div>
                  </>
                ) : (
                  <div className="div-signin-login">
                    <div className="div-for-signin-login">
                      <Link id="link-signin" to="/register">
                        Sign Up
                      </Link>
                    </div>

                    <div className="div-for-signin-login">
                      <Link id="link-login" to="/login">
                        Log In
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {
            //to show the userprofile rightside
            this.props.userProfileShow ? (
              <UserProfile onClick={userProfileHandler} />
            ) : (
              ''
            )
          }

          <Route exact path="/mycart">
            <MyCartMap />
          </Route>

          <Route exact path="/login">
            <LogInForm />
          </Route>

          <Route exact path="/additem">
            <AddItemForm />
          </Route>

          <Route exact path="/register">
            <RegistrationForm />
          </Route>

          <Route exact path={['/', '/allitems']}>
            <ItemsForm />
          </Route>
          <Route exact path="/addcategory">
            <AddCategory />
          </Route>
          <Route exact path="/history">
            <Transactions />
          </Route>
          <Route exact path="/adminview">
            <AddminView />
          </Route>
          <Route exact path="/mycheckout">
            <MyCheckOut />
          </Route>
        </div>
        <footer className="main-footer">
          <div className="footer-content">
            <p className="content-footer">All Rights Reserved</p>
            <p className="content-footer">Buddy Shop</p>
          </div>
        </footer>
      </>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    user: store.user,
    userProfileShow: store.userProfileShow,
    items: store.items,
    mainCategories: store.mainCategories,
    words: store.words,
    myCartCopy: store.myCartCopy,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchToStore: (allItems) =>
      dispatch({ type: 'DISPATCH_ALL_ITEMS', payload: allItems }),

    updateCategoryToStore: (categories) =>
      dispatch({ type: 'ALL_CATEGORIES', payload: categories }),

    dispatchWords: (words) => dispatch({ type: 'WORDS', payload: words }),

    filterByMainCategory: (mainCat) =>
      dispatch({ type: 'FILTER_CATEGORIES', payload: mainCat }),

    searchWord: (searchKey) =>
      dispatch({ type: 'SEARCH_WORD', payload: searchKey }),

    userShow: (req) => {
      dispatch({ type: 'USER_SHOW', payload: req });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
