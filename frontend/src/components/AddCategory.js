import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import addcategory from '../mycss/addcategory.css';
class AddCategory extends React.Component {
  state = {
    idToFind: '',
    mainCategory: '--SELECT--',
    subCategory: '--SELECT--',
    newMainCategory: '',
    newSubCategory: '',
    showViewCatForm: false,
    showAddCatForm: false,
    showNewCatForm: false,
    showInputEdit: false,
    inputEdit: '',
    originalCategory: '',
  };
  //to reload updated categories
  updateCategories = () => {
    axios.get('http://localhost:8080/getcategory').then((category) => {
      this.props.updateCategoryToStore(category.data);
    });
  };

  viewCatBtn = () => {
    this.setState({ showAddCatForm: false });
    this.setState({ showNewCatForm: false });

    this.state.showViewCatForm
      ? this.setState({ showViewCatForm: false })
      : this.setState({ showViewCatForm: true });
  };
  addCatBtn = () => {
    this.setState({ showViewCatForm: false });
    this.setState({ showNewCatForm: false });

    this.state.showAddCatForm
      ? this.setState({ showAddCatForm: false })
      : this.setState({ showAddCatForm: true });
  };
  newBtn = () => {
    !this.state.showNewCatForm
      ? this.setState({ showNewCatForm: true })
      : this.setState({ showNewCatForm: false });
  };

  editCategoryFunction = (idToFind, updatedCategory) => {
    axios
      .put(`http://localhost:8080/editcategory/${idToFind}`, updatedCategory, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          role: this.props.user.role,
        },
      })
      .then((updated) => {
        if (updated.data.error) {
          alert(updated.data.error);
        } else {
          this.updateCategories();
          this.setState({
            inputEdit: '',
            originalCategory: '',
            showInputEdit: false,
          });
        }
      });
  };

  //this is for new sub category only
  newSubCatSaveBtn = () => {
    let idToFind;
    let newSubCategory;
    if (
      this.state.mainCategory === '--SELECT--' ||
      this.state.newSubCategory === ''
    ) {
      return alert('Please select appropriate category');
    } else {
      newSubCategory = {
        sub: this.state.newSubCategory,
      };
      idToFind = this.props.mainCat.filter(
        (category) => category.name === this.state.mainCategory
      )[0]._id; //oks
      axios
        .post(
          'http://localhost:8080/addcategory/' + idToFind + '/subcategory',
          newSubCategory,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
              role: this.props.user.role,
            },
          }
        )
        .then((newSubCat) => {
          if (newSubCat.data.error) {
            alert(newSubCat.data.error);
          } else {
            this.updateCategories();
          }
        });
    }
    this.setState({ newSubCategory: '' });
  };

  //for new main category and new sub category
  newCatSaveBtn = () => {
    let newCategory;
    if (this.state.newMainCategory === '') {
      return alert('Please provide appropriate category');
    } else if (this.state.newSubCategory === '') {
      newCategory = {
        name: this.state.newMainCategory,
      };
    } else {
      newCategory = {
        name: this.state.newMainCategory,
        sub: this.state.newSubCategory,
      };
    }
    axios
      .post('http://localhost:8080/addcategory', newCategory, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          role: this.props.user.role,
        },
      })
      .then((category) => {
        if (category.data.error) {
          alert(category.data.error);
        } else {
          this.updateCategories();
        }
      });
    this.setState({ newMainCategory: '', newSubCategory: '' });
  };

  //edit main category
  editBtn = () => {
    if (this.state.mainCategory === '--SELECT--') {
      return alert('Please select valid category');
    } else {
      this.setState({
        inputEdit: this.state.mainCategory,
        originalCategory: this.state.mainCategory, //to identify sub or main cat
        showInputEdit: true,
      });
    }
  };

  //edit sub category
  editSubCategory = (e) => {
    this.setState({
      inputEdit: e,
      originalCategory: e,
      showInputEdit: true,
    });
  };

  //delete main/sub category
  deleteBtn = () => {
    //delete main category only
    if (window.confirm('Are you sure to delete?')) {
      if (this.state.mainCategory === this.state.originalCategory) {
        let idToFind = this.props.mainCat.filter(
          (category) => category.name === this.state.mainCategory
        )[0]._id;
        axios
          .delete(`http://localhost:8080/deletecategory/${idToFind}`, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
              role: this.props.user.role,
            },
          })
          .then((deletedCat) => {
            if (deletedCat.data.error) {
              alert(deletedCat.data.error);
            } else {
              this.updateCategories();
              this.setState({
                inputEdit: '',
                originalCategory: '',
                mainCategory: '--SELECT--',
                showInputEdit: false,
              });
            }
          });
      } else {
        //delete sub category only
        let updatedCategory = this.props.mainCat.filter(
          (category) => category.name === this.state.mainCategory
        )[0];
        let idToFind = updatedCategory._id;
        let updatedSubCategory = updatedCategory.sub.filter(
          (subCat) => subCat !== this.state.originalCategory
        );
        updatedCategory.sub = updatedSubCategory;
        this.editCategoryFunction(idToFind, updatedCategory);
      }
    }
  };

  //cancel updates
  cancelUpdateBtn = () => {
    this.setState({
      showInputEdit: false,
      inputEdit: '',
      originalCategory: '',
    });
  };

  //to save updated/edited main and sub category
  updateCatBtn = () => {
    //for main category
    if (this.state.mainCategory === this.state.originalCategory) {
      let updatedCategory = this.props.mainCat.filter(
        (category) => category.name === this.state.mainCategory
      )[0];
      updatedCategory.name = this.state.inputEdit;
      let idToFind = updatedCategory._id;
      this.editCategoryFunction(idToFind, updatedCategory);
      this.setState({ mainCategory: '--SELECT--' });
    } else {
      //for sub category
      let updatedCategory = this.props.mainCat.filter(
        (category) => category.name === this.state.mainCategory
      )[0];
      let idToFind = updatedCategory._id;
      let updatedSubCategory = updatedCategory.sub.filter(
        (subCat) => subCat !== this.state.originalCategory
      );
      updatedSubCategory.push(this.state.inputEdit);
      updatedCategory.sub = updatedSubCategory;
      this.editCategoryFunction(idToFind, updatedCategory);
    }
  };

  render() {
    //this mean to control the maincategories and its subcategories
    let sub = this.props.mainCat.filter((main) => {
      return main.name === this.state.mainCategory;
    });
    return (
      <div className="main-container-addcategory">
        <div className="mini-container-addcategory">
          <div className="div-for-closed">
            <span
              onClick={() => {
                this.props.showMyAddCategory(false);
              }}
            >
              X
            </span>
          </div>
          <div className="div-for-view-add">
            <button onClick={this.viewCatBtn}>View Categories</button> |{' '}
            <button onClick={this.addCatBtn}>Add Category</button>
          </div>

          {/* this is for view categories */}

          {this.state.showViewCatForm ? (
            <div className="main-div-for-showViewCatForm">
              {this.props.mainCat.length > 0 ? (
                <div className="for-mainCat-input">
                  <div className="lblmaincat">
                    <label>Maincategory</label>
                  </div>
                  <div className="div-for-input-maincat-editBtn">
                    <select
                      className="input-maincat"
                      type="text"
                      value={this.state.mainCategory}
                      onChange={(e) =>
                        this.setState({ mainCategory: e.target.value })
                      }
                    >
                      {' '}
                      <option>--SELECT--</option>
                      {this.props.mainCat.map((cat) => {
                        return <option>{cat.name}</option>;
                      })}
                    </select>{' '}
                    {this.state.mainCategory !== '--SELECT--' ? (
                      <span>
                        <button className="editBtn" onClick={this.editBtn}>
                          EDIT
                        </button>{' '}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              ) : (
                alert('Category is empty !')
              )}
              <br />
              {/*  */}
              {this.state.mainCategory !== '--SELECT--' ? (
                <div className="div-for-subCat-input">
                  {sub.length !== 0 ? (
                    <div className="mini-div-subCat-input">
                      {sub[0].sub.length !== 0 ? (
                        <div className="div-for-">
                          <div className="lblmaincat">
                            <label>Subcategories:</label>
                          </div>

                          {sub[0].sub.map((subCat) => {
                            return (
                              <div className="div-per-subCat">
                                <div className="div-for-spanSubCat">
                                  <span
                                    onClick={() => {
                                      this.editSubCategory(subCat);
                                    }}
                                  >
                                    {subCat}
                                  </span>
                                </div>{' '}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                  <br />
                  {this.state.showInputEdit ? (
                    <div className="div-for-input-edit">
                      <input
                        className="input-edit"
                        type="text"
                        value={this.state.inputEdit}
                        onChange={(e) =>
                          this.setState({ inputEdit: e.target.value })
                        }
                      ></input>{' '}
                      <button className="deleteBtn" onClick={this.deleteBtn}>
                        DELETE
                      </button>{' '}
                      <button
                        className="updateCatBtn"
                        onClick={this.updateCatBtn}
                      >
                        {' '}
                        UPDATE
                      </button>{' '}
                      <button
                        className="cancelUpdateBtn"
                        onClick={this.cancelUpdateBtn}
                      >
                        {' '}
                        CANCEL
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
            </div>
          ) : (
            '' //empty
          )}

          {/* this is for add categories */}

          {this.state.showAddCatForm ? (
            <div className="main-div-for-showAddCatForm">
              <div className="div-for-newBtn">
                <button className="newBtn" onClick={this.newBtn}>
                  NEW
                </button>
              </div>
              {/* this is to show/hide new category form to add new subCategory*/}
              {!this.state.showNewCatForm ? (
                <div className="mini-div-for-showAddCatForm">
                  <div className="div-lblmaincat">
                    <label>Maincategory</label>
                  </div>

                  <select
                    className="input-maincat"
                    value={this.state.mainCategory}
                    onChange={(e) => {
                      this.setState({
                        mainCategory: e.target.value,
                      });
                    }}
                  >
                    <option>--SELECT--</option>
                    {this.props.mainCat.map((cat) => {
                      return <option>{cat.name}</option>;
                    })}
                  </select>
                  <br />
                  <div className="div-lblsubcat">
                    <label>Subcategory</label>
                  </div>
                  <input
                    className="input-maincat input-for-new-subCat"
                    type="text"
                    value={this.state.newSubCategory}
                    onChange={(e) => {
                      this.setState({ newSubCategory: e.target.value });
                    }}
                  ></input>
                  <br />
                  <div className="div-for-saveBtn">
                    <button
                      className="newSubCatSaveBtn"
                      onClick={this.newSubCatSaveBtn}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="main-div-for-addNewCategory">
                  <div className="div-for-newMainCat">
                    <label>Maincategory</label>
                    <br />
                    <input
                      className="input-newMainCat"
                      value={this.state.newMainCategory}
                      onChange={(e) => {
                        this.setState({ newMainCategory: e.target.value });
                      }}
                    ></input>
                    <br />
                    <label>Subcategory</label>
                    <br />
                    <input
                      className="input-newSubCat"
                      value={this.state.newSubCategory}
                      onChange={(e) => {
                        this.setState({ newSubCategory: e.target.value });
                      }}
                    ></input>
                  </div>
                  <div className="div-for-saveBtn">
                    <button
                      className="newCatSaveBtn"
                      onClick={this.newCatSaveBtn}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            ''
          )}

          {/* this is for new categories */}

          <div className="div-for-showNewCatForm"></div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    user: store.user,
    mainCat: store.mainCategories,
    subCategory: store.subCategory,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    mainCategory: (categories) =>
      dispatch({ type: 'ALL_CATEGORIES', payload: categories }),

    updateCategoryToStore: (categories) =>
      dispatch({ type: 'ALL_CATEGORIES', payload: categories }),

    showMyAddCategory: (req) =>
      dispatch({ type: 'SHOW_MY_ADD_CATEGORY', payload: req }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddCategory);
