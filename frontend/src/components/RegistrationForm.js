import React from 'react';
import axios from 'axios';
import registrationstyle from '../mycss/registrationstyle.css';
import { Redirect } from 'react-router-dom';
//form for registration
class RegistrationForm extends React.Component {
  state = {
    username: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    emailAddress: '',
    contactNumber: '',
    address: '',
    confirmedPassword: '',
    role: 'user',
    informationForm: false,
    redirect: false,
  };

  submitBtn = () => {
    if (this.state.password !== this.state.confirmedPassword) {
      return alert('Password is incorrect');
    } else if (this.state.username === '' || this.state.password === '') {
      alert('Error !');
    } else {
      this.setState({ informationForm: true });
    }
  };

  nowBtn = () => {
    if (
      this.state.firstName === '' ||
      this.state.middleName === '' ||
      this.state.lastName === '' ||
      this.state.emailAddress === '' ||
      this.state.contactNumber === '' ||
      this.state.address === ''
    ) {
      return alert('Error, all fields are required');
    }
    let information = {
      username: this.state.username,
      password: this.state.password,
      role: this.state.role,
      information: [
        {
          firstName: this.state.firstName,
          middleName: this.state.middleName,
          lastName: this.state.lastName,
          emailAddress: this.state.emailAddress,
          contactNumber: this.state.contactNumber,
          address: this.state.address,
        },
      ],
    };
    // console.log(information);
    axios.post('http://localhost:8080/register', information).then((res) => {
      if (res.data.error) {
        alert(res.data.error);
      } else {
        console.log(res.data);
        this.setState({ redirect: true });
      }
    });
  };

  laterBtn = () => {
    // alert('this is for later submit');

    let initial = {
      username: this.state.username,
      password: this.state.password,
      role: this.state.role,
    };
    axios.post('http://localhost:8080/register', initial).then((res) => {
      if (res.data.error) {
        alert(res.data.error);
      } else {
        console.log(res.data);
        this.setState({ redirect: true });
      }
    });
  };

  render() {
    // console.log(this.state.firstName);
    // console.log(this.state.username);
    // console.log(this.state.informationForm);
    return (
      <div className="main-container-registration">
        {this.state.redirect && <Redirect to="/login" />}
        <div className="div-bg-cart"></div>
        {this.state.informationForm ? ( //ternary
          <div className="div-for-information">
            <div className="signuptext">
              <p className="p-sign-up">SIGN UP</p>
            </div>
            <label>First Name</label>
            <br />
            <input
              className="input-firstname"
              type="text"
              required
              value={this.state.firstName}
              onChange={(e) => this.setState({ firstName: e.target.value })}
            ></input>
            <br />
            <label>Middle Name</label>
            <br />
            <input
              className="input-middlename"
              type="text"
              required
              value={this.state.middleName}
              onChange={(e) => {
                this.setState({ middleName: e.target.value });
              }}
            ></input>
            <br />
            <label>Last Name</label>
            <br />
            <input
              className="input-lastname"
              type="text"
              required
              value={this.state.lastName}
              onChange={(e) => {
                this.setState({ lastName: e.target.value });
              }}
            ></input>
            <br />
            <label>Email Address</label>
            <br />
            <input
              className="input-email"
              type="email"
              required
              value={this.state.emailAddress}
              onChange={(e) => {
                this.setState({ emailAddress: e.target.value });
              }}
            ></input>
            <br />
            <label>Contact Number</label>
            <br />
            <input
              className="input-contactnumber"
              type="number"
              required
              value={this.state.contactNumber}
              onChange={(e) => {
                this.setState({ contactNumber: e.target.value });
              }}
            ></input>
            <label>Address</label>
            <br />
            <input
              className="input-address"
              type="text"
              required
              value={this.state.address}
              onChange={(e) => {
                this.setState({ address: e.target.value });
              }}
            ></input>
            <br />
            <div className="div-for-now-later">
              <button className="nowBtn" onClick={this.nowBtn}>
                OK
              </button>

              <button className="laterBtn" onClick={this.laterBtn}>
                Later
              </button>
            </div>
          </div>
        ) : (
          <div className="mini-container-registration">
            <div className="signuptext">
              <p className="p-sign-up">SIGN UP</p>
            </div>
            <label>Username</label>
            <br />
            <input
              className="input-username"
              type="text"
              required
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            ></input>
            <br />
            <label>Password</label>
            <br />
            <input
              className="input-password"
              type="password"
              required
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
            ></input>
            <br />
            <label>Confirm Password</label>
            <br />
            <input
              className="input-password confirm"
              type="password"
              required
              value={this.state.confirmedPassword}
              onChange={(e) => {
                this.setState({ confirmedPassword: e.target.value });
              }}
            ></input>
            <br />
            <div className="div-for-submit">
              <button className="submitBtn" onClick={this.submitBtn}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default RegistrationForm;
