import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import loginStyle from '../mycss/loginStyle.css';
import { Redirect, Link } from 'react-router-dom';
//logIn form
class LogInForm extends React.Component {
  state = {
    username: '',

    password: '',
  };
  loginBtn = () => {
    // alert('loginBtn');
    // console.log(this.state);
    axios.post('http://localhost:8080/login', this.state).then((user) => {
      if (user.data.error) {
        return alert('Invalid Password/Username');
      } else {
        this.props.saveMyAccount(user.data.user);
        localStorage.setItem('token', user.data.token);
        console.log(user.data);
        alert('Welcome ' + user.data.user.username + ' !');
      }
    });
  };

  render() {
    console.log(this.props.user);

    return (
      <div className="main-container-login">
        {this.props.user && <Redirect to="/allitems" />}
        <div className="div-bg-cart"></div>
        <div className="mini-container-login">
          <div className="div-for-signintext">
            <p className="p-sign-in">SIGN IN</p>
          </div>
          <div className="div-for-username">
            <label>Username</label>
            <br />
            <input
              className="input-username"
              type="text"
              value={this.state.username}
              onChange={(e) => {
                this.setState({ username: e.target.value });
              }}
            ></input>
          </div>
          <div className="div-for-password">
            <label>Password</label>
            <br />
            <input
              className="input-password"
              type="password"
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
              value={this.state.password}
            ></input>
          </div>
          <div className="div-forgot-password">
            <em>Forgot Password?</em>
          </div>
          <div className="div-for-loginBtn">
            <button className="loginBtn" onClick={this.loginBtn}>
              LOGIN
            </button>
          </div>

          <div className="div-or">Or</div>

          <div className="div-for-createAccountBtn">
            <button className="createAccountBtn">
              <Link to="/register" className="createAccountBtn">
                CREATE ACCOUNT
              </Link>
            </button>
          </div>
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
    saveMyAccount: (myAccount) =>
      dispatch({ type: 'SAVE_MY_ACCOUNT', payload: myAccount }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
