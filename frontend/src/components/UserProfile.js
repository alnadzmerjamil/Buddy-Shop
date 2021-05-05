import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
class UserProfile extends React.Component {
  logOutHandler = () => {
    if (window.confirm('Are you sure to logout?')) {
      this.props.logout(null);
      this.props.userShow(false);
    } else {
      this.props.userShow(false);
    }
  };
  render() {
    return (
      <div
        className="main-container-userprofile"
        onClick={() => {
          this.props.userShow(false);
        }}
      >
        {this.props.user ? (
          <div className="mini-container-userprofile">
            <div className="div-for-user-profile">
              <div className="div-for-user-img">
                <i className="fas fa-user-alt profile-icon"></i>
              </div>
              <div className="div-for-user-name">
                <span>{this.props.user.username}</span>
              </div>
            </div>
            <div className="div-for-content-user">
              <div className="div-for-my-account content-user">
                <div>
                  <i className="fas fa-user-cog icon-user"></i> My Account
                </div>
              </div>

              {this.props.user.username !== 'admin' ? (
                <div className="div-for-my-transactions content-user">
                  <div>
                    <Link
                      className="link-profile content-user"
                      to="/history"
                      onClick={() => {
                        this.props.userShow(false);
                      }}
                    >
                      <i className="fas fa-history icon-user"></i> My
                      Transactions
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="div-admin-view content-user">
                  <div>
                    <Link
                      className="link-profile"
                      to="/adminview"
                      onClick={() => {
                        this.props.userShow(false);
                      }}
                    >
                      <i className="fas fa-laptop icon-user"></i> Admin
                    </Link>
                  </div>
                </div>
              )}
              <div className="div-settings content-user">
                <div>
                  <i className="fas fa-cog icon-user"></i> Settings
                </div>
              </div>
              <div className="div-for-logout content-user">
                <div id="div-logout" onClick={this.logOutHandler}>
                  <i className="fas fa-sign-out-alt"></i> Sign Out
                </div>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: (signout) => dispatch({ type: 'LOG_OUT', payload: signout }),

    userShow: (req) => {
      dispatch({ type: 'USER_SHOW', payload: req });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
