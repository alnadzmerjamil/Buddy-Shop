import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import edititem from '../mycss/edititem.css';

//dito ako mag-eedit ng mga items
class EditItemForm extends React.Component {
  state = {
    name: this.props.item.name,
    mainCategory: this.props.item.mainCategory,
    subCategory: this.props.item.subCategory,
    quantity: this.props.item.quantity,
    price: this.props.item.price,
    image: this.props.item.image,

    displaySrc: this.props.item.image.slice(0)[0],
    originalImgSrc: this.props.items.filter(
      (item) => item._id === this.props.item._id
    )[0].image, //from reducer
    imgSrcEdited: null, //being edited
    imgSrcEditOriginal: null, // to be compared if edited
    addOrNew: false,
    showNewBtn: true,
    showEditBtn: true,
    showRemoveBtn: true,
    showCancelBtn: false,
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.item !== this.props.item) {
      let updated = this.props.item;
      updated.image = this.props.item.image;
      this.setState({
        name: updated.name,
        mainCategory: updated.mainCategory,
        subCategory: updated.subCategory,
        quantity: updated.quantity,
        price: updated.price,
        image: updated.image,
        displaySrc: updated.image[0],
      });
    } else if (prevProps.items !== this.props.items) {
      this.setState({
        originalImgSrc: this.props.items.filter(
          (item) => item._id === this.props.item._id
        )[0].image,
      });
    }
  };

  //axios to db
  axiosTheUpdatedItem = (idToFind, updatedItem) => {
    axios
      .put(`http://localhost:8080/updateitem/${idToFind}`, updatedItem, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          role: this.props.user.role,
        },
      })
      .then((originalItem) => {
        if (originalItem.data.error) {
          return alert(originalItem.data.error);
        } else {
          this.updateAllItems();
          alert('Item has been updated');
          this.setState({
            imgSrcEdited: null,
            imgSrcEditOriginal: null,
            displaySrc: '--Select--',
            addOrNew: false,
            showNewBtn: true,
            showEditBtn: true,
            showRemoveBtn: true,
            showCancelBtn: false,
          });
        }
      });
  };

  //will update all items
  updateAllItems = () => {
    axios.get('http://localhost:8080/getitems').then((allItems) => {
      this.props.dispatchToStore(allItems.data);
    });
  };

  //update the edited items
  updateBtn = () => {
    let filtered = this.props.item.image.filter((img) => {
      return img === this.state.imgSrcEdited;
    });
    let limit =
      this.state.name === this.props.item.name &&
      this.state.mainCategory === this.props.item.mainCategory &&
      this.state.subCategory === this.props.item.subCategory &&
      this.state.quantity === this.props.item.quantity &&
      this.state.price === this.props.item.price &&
      this.state.quantity === this.props.item.quantity;

    if (limit && this.state.imgSrcEdited === null) {
      return alert('Nothing to update');
    } else if (limit && filtered.length === 1) {
      return alert('Nothing to update');
    } else if (limit && this.state.showNewBtn === true) {
      return alert('Nothing to update');
    } else {
      let idToFind = this.props.item._id;
      let updatedImage = this.state.originalImgSrc.slice(0);

      if (this.state.imgSrcEditOriginal !== null) {
        updatedImage = updatedImage.filter(
          (img) => img !== this.state.imgSrcEditOriginal
        );
        updatedImage.push(this.state.imgSrcEdited);
      }
      let updatedItem = {
        name: this.state.name,
        mainCategory: this.state.mainCategory,
        subCategory: this.state.subCategory,
        quantity: this.state.quantity,
        price: this.state.price,
        image: updatedImage,
      };

      console.log(updatedItem);
      this.axiosTheUpdatedItem(idToFind, updatedItem);
    }
  };

  //Add image
  newImgSrcHandler = () => {
    this.setState({
      imgSrcEdited: '',
      addOrNew: !this.state.addOrNew,
      showEditBtn: !this.state.showEditBtn,
      showRemoveBtn: !this.state.showRemoveBtn,
      showCancelBtn: !this.state.showCancelBtn,
    });
  };
  addImgSrcHandler = () => {
    if (this.state.imgSrcEdited === '') {
      return alert('Nothing to add !');
    }
    let originalImgSrcCopy = this.state.originalImgSrc.slice(0);
    let newImgSrc = this.state.imgSrcEdited;
    originalImgSrcCopy.push(newImgSrc);
    let idToFind = this.props.item._id;
    let updatedItem = {
      image: originalImgSrcCopy,
    };
    console.log(updatedItem);
    this.axiosTheUpdatedItem(idToFind, updatedItem);

    // alert('New image has been added');
  };

  //Edit image src
  editImgSrcHandler = () => {
    if (this.state.displaySrc === '--Select--') {
      return alert('Image source is invalid');
    } else if (this.state.showCancelBtn) {
      return alert("Edit can't proceed");
    }
    this.setState({
      imgSrcEdited: this.state.displaySrc,
      imgSrcEditOriginal: this.state.displaySrc,
      showNewBtn: !this.state.showEditBtn,
      showRemoveBtn: !this.state.showRemoveBtn,
      showCancelBtn: !this.state.showCancelBtn,
    });
  };

  //Remove/Delete img
  removeImg = () => {
    if (this.state.displaySrc === '--Select--') {
      return alert('Image source is invalid');
    }
    if (window.confirm('Are you sure to remove this image?')) {
      let originalImgSrcCopy = this.state.originalImgSrc.slice(0);
      originalImgSrcCopy = originalImgSrcCopy.filter(
        (img) => img !== this.state.displaySrc
      );
      let idToFind = this.props.item._id;
      let updatedItem = {
        image: originalImgSrcCopy,
      };
      console.log(updatedItem);
      this.axiosTheUpdatedItem(idToFind, updatedItem);
    }
  };

  // cancel the edited items
  cancelOnImg = () => {
    this.setState({
      showNewBtn: true,
      showEditBtn: true,
      showRemoveBtn: true,
      showCancelBtn: !this.state.showCancelBtn,
      addOrNew: false,
      imgSrcEdited: null,
      imgSrcEditOriginal: null,
      newImgSrc: null,
    });
  };
  cancelBtn = () => {
    this.props.addToItemToBeEdited(null);
  };
  render() {
    //for subCategory (array of subCategory)
    let sub = this.props.mainCat.filter((main) => {
      return main.name === this.state.mainCategory;
    });

    //for image (array of images)
    let images = this.props.items.filter(
      (item) => item._id === this.props.item._id
    )[0].image;

    // console.log(this.props.items);
    // console.log(this.props.item);
    console.log(images);

    // console.log(this.state.imgSrcEditOriginal);
    // console.log(this.state.item.image);
    // console.log(this.props.items);
    return (
      <div className="main-container-edit">
        <div className="mini-container-edit">
          <div className="div-for-xBtn-edit">
            <button id="xbtn-edit" onClick={this.cancelBtn}>
              X
            </button>
          </div>
          <div className="parent div-for-img-edit">
            <div className="div-for-display-img">
              <img id="display-img" src={this.state.displaySrc} />
            </div>
            <div className="div-for-image-edit">
              <label>SOURCE OF IMAGE</label>
              <br />
              <select //select
                className="input-image-edit"
                value={this.state.displaySrc}
                onChange={(e) =>
                  this.setState({
                    displaySrc: e.target.value,
                  })
                }
              >
                {' '}
                <option>--Select--</option>
                {images.map((img) => {
                  return <option key={img}>{img}</option>;
                })}
              </select>
            </div>

            {this.state.image === '--Select--' ? (
              '' //if --select-- ang value ng option dapat empty
            ) : (
              <div className="div-for-src-edit">
                {this.state.imgSrcEdited !== null ? (
                  <input //for Edited or new
                    className="input-image-edit"
                    value={this.state.imgSrcEdited}
                    onChange={(e) =>
                      this.setState({
                        imgSrcEdited: e.target.value,
                      })
                    }
                  ></input>
                ) : (
                  ''
                )}
                {this.state.addOrNew ? (
                  <button
                    className="btns-editItem"
                    id="add-btn"
                    onClick={this.addImgSrcHandler}
                  >
                    ADD
                  </button>
                ) : this.state.showNewBtn ? (
                  <button
                    className="btns-editItem"
                    id="add-btn"
                    onClick={this.newImgSrcHandler}
                  >
                    NEW
                  </button>
                ) : (
                  ''
                )}
                {this.state.showEditBtn ? (
                  <button
                    className="btns-editItem"
                    id="edit-btn"
                    onClick={this.editImgSrcHandler}
                  >
                    EDIT
                  </button>
                ) : (
                  ''
                )}
                {this.state.showRemoveBtn ? (
                  <button
                    className="btns-editItem"
                    id="delete-btn"
                    onClick={this.removeImg}
                  >
                    REMOVE
                  </button>
                ) : (
                  ''
                )}

                {this.state.showCancelBtn ? (
                  <button
                    className="btns-editItem"
                    id="delete-btn"
                    onClick={this.cancelOnImg}
                  >
                    CANCEL
                  </button>
                ) : (
                  ''
                )}
              </div>
            )}
          </div>

          <div className=" parent div-for-main-content-edit">
            <div className="div-for-item-name-edit">
              <label>Item name</label>
              <br />
              <input
                className="input-item-name-edit"
                value={this.state.name}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              ></input>
            </div>
            <div className="div-for-mainCategory-edit">
              <label>Maincategory</label>
              <br />
              <select
                className="input-mainCategory-edit"
                value={this.state.mainCategory}
                onChange={(e) => {
                  this.setState({ mainCategory: e.target.value });
                }}
              >
                <option>{this.state.mainCategory}</option>
                {this.props.mainCat.map((cat) => {
                  return <option key={cat.name}>{cat.name}</option>;
                })}
              </select>
            </div>
            <div className="div-for-subCategory-edit">
              <label>Subcategory</label>
              <br />
              <select
                className="input-subCategory-edit"
                value={this.state.subCategory}
                onChange={(e) => {
                  this.setState({ subCategory: e.target.value });
                }}
              >
                <option>{this.state.subCategory}</option>
                {sub.length !== 0
                  ? sub[0].sub.map((subCat) => {
                      return <option key={subCat}>{subCat}</option>;
                    })
                  : ''}
              </select>
            </div>
            <div className="div-for-quantity-edit">
              <label>Quantity</label>
              <br />
              <input
                className="input-quantity-edit"
                value={this.state.quantity}
                onChange={(e) => {
                  this.setState({ quantity: e.target.value });
                }}
              ></input>
            </div>
            <div className="div-for-price-edit">
              <label>Price</label>
              <br />
              <input
                className="input-price-edit"
                value={this.state.price}
                onChange={(e) => {
                  this.setState({ price: e.target.value });
                }}
              ></input>
            </div>

            <div className="div-for-update-cancel-edit">
              <button className="updateBtn-edit" onClick={this.updateBtn}>
                UPDATE
              </button>
              <button className="cancelBtn-edit" onClick={this.cancelBtn}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    user: store.user,
    items: store.items,
    mainCat: store.mainCategories,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    addToItemToBeEdited: (item) =>
      dispatch({ type: 'EDIT_ITEM', payload: item }),

    dispatchToStore: (allItems) =>
      dispatch({ type: 'DISPATCH_ALL_ITEMS', payload: allItems }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditItemForm);
