import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import AddCategory from './AddCategory';
import additem from '../mycss/additem.css';
//dito ako mag-aad ng mga items
class AddItemForm extends React.Component {
  state = {
    name: '',
    mainCategory: '--SELECT--',
    subCategory: '--SELECT--',
    quantity: '',
    price: '',
    image: '',
    arrOfImages: [],
  };
  addImaageBtn = (e) => {
    if (window.confirm('Add this image?')) {
      let arrOfImagesCopy = this.state.arrOfImages.slice(0);
      arrOfImagesCopy.push(this.state.image);
      this.setState({ arrOfImages: arrOfImagesCopy, image: '' });
      alert('Image added');
    }
  };
  addItemBtn = () => {
    let item;
    if (
      this.state.category === '--SELECT--' ||
      this.state.subCategory === '--SELECT--'
    ) {
      return alert('Please provide category!');
    } else {
      let image = [];
      if (this.state.arrOfImages.length === 0) {
        image.push(this.state.image);
      } else {
        image = this.state.arrOfImages;
      }
      item = {
        name: this.state.name,
        mainCategory: this.state.mainCategory,
        subCategory: this.state.subCategory,
        quantity: this.state.quantity,
        price: this.state.price,
        image: image,
      };
      // return console.log(item);

      axios
        .post('http://localhost:8080/additem', item, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            role: this.props.user.role,
          },
        })
        .then((newAddedItem) => {
          if (newAddedItem.data.error) {
            alert(newAddedItem.data.error);
          } else {
            this.updateAllItems();
            alert('Item saved');
          }
          this.setState({
            name: '',
            mainCategory: '--SELECT--',
            subCategory: '--SELECT--',
            quantity: '',
            price: '',
            image: '',
          });
        });
    }
  };

  //this is to update the items/show all
  updateAllItems = () => {
    // alert('got it');
    axios.get('http://localhost:8080/getitems').then((allItems) => {
      this.props.dispatchToStore(allItems.data);
    });
  };

  render() {
    console.log(this.state.arrOfImages);
    //this is for subCategories
    let sub = this.props.mainCat.filter((main) => {
      return main.name === this.state.mainCategory;
    });
    // console.log(this.props.mainCat);

    return (
      <div className="main-container-additem">
        <div className="mini-container-additem">
          <div className="div-for-closed">
            <span
              onClick={() => {
                this.props.showMyAddItem(false);
              }}
            >
              X
            </span>
          </div>
          <label>Item Name</label>
          <br />
          <input
            className="input-itemname"
            type="text"
            value={this.state.name}
            onChange={(e) => {
              this.setState({ name: e.target.value });
            }}
          ></input>
          <br />

          <label>Maincategory</label>
          <br />
          <select
            className="input-itemmaincategory"
            value={this.state.mainCategory}
            onChange={(e) => {
              this.setState({
                mainCategory: e.target.value,
                subCategory: '--SELECT--',
              });
            }}
          >
            <option>--SELECT--</option>
            {this.props.mainCat.length > 0
              ? this.props.mainCat.map((cat) => {
                  return <option key={cat.name}>{cat.name}</option>;
                })
              : ''}
          </select>
          {this.state.category !== '--SELECT--' ? (
            <>
              <br />
              <label>Subcategory</label>
              <br />
              <select
                className="input-itemsubcategory"
                value={this.state.subCategory}
                onChange={(e) => this.setState({ subCategory: e.target.value })}
              >
                <option>--SELECT--</option>
                {sub.length > 0
                  ? sub[0].sub.map((subCat) => {
                      return <option key={subCat}>{subCat}</option>;
                    })
                  : ''}
              </select>
            </>
          ) : (
            ''
          )}
          <br />
          <label>Quantity</label>
          <br />
          <input
            className="input-itemquantity"
            type="number"
            value={this.state.quantity}
            onChange={(e) => {
              this.setState({ quantity: e.target.value });
            }}
          ></input>
          <br />
          <label>Price</label>
          <br />
          <input
            className="input-itemprice"
            type="number"
            value={this.state.price}
            onChange={(e) => {
              this.setState({ price: e.target.value });
            }}
          ></input>

          <br />
          <div className="div-for-add-image">
            <label>Image</label>
            {this.state.image !== '' ? (
              <button
                id="add-image-btn"
                onClick={(e) => {
                  this.addImaageBtn(e);
                }}
              >
                ADD
              </button>
            ) : (
              ''
            )}
          </div>
          <input
            className="input-itemimage"
            type="text"
            value={this.state.image}
            onChange={(e) => {
              this.setState({
                image: e.target.value,
              });
            }}
          ></input>

          <div className="div-for-addProductBtn">
            <button className="add-itemBtn" onClick={this.addItemBtn}>
              SAVE
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
    mainCat: store.mainCategories,
    subCategories: store.subCategories,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchToStore: (allItems) =>
      dispatch({ type: 'DISPATCH_ALL_ITEMS', payload: allItems }),
    showMyAddItem: (req) =>
      dispatch({ type: 'SHOW_MY_ADD_ITEM', payload: req }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddItemForm);
