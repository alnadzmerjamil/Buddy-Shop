import React from 'react';
import { connect } from 'react-redux';
import DisplayItems from './DisplayItems';
import EditItemForm from './EditItemForm';
import PreviewItem from './PreviewItem';
import displayitems from '../mycss/displayitems.css';
//dito ako magmamap ng mga items
class ItemsForm extends React.Component {
  state = {
    filter: '',
    searchWord: '',
  };
  render() {
    let isSearch;
    let search = this.props.searchWord;
    if (search === '') {
      isSearch = 'NO';
    } else {
      isSearch = 'YES';
    }

    let searchWord = 'none'; //yung tinaype ni user
    let foundWord; //senearch na meron sa words(maincat and subcat)
    foundWord = this.props.words.includes(this.props.searchWord);
    if (foundWord) {
      searchWord = this.props.searchWord;
    } else {
      searchWord = 'none';
    }

    return (
      <div className="main-container-items">
        {this.props.itemToBeEdited !== null ? (
          <EditItemForm item={this.props.itemToBeEdited} />
        ) : (
          ''
        )}
        {this.props.previewItem !== null ? (
          <PreviewItem item={this.props.previewItem} />
        ) : (
          ''
        )}
        <div className="title-on-top">
          <strong>TRENDS TODAY</strong>
        </div>
        {isSearch === 'NO' ? (
          <div className="mini-container-items">
            {this.props.filterByMainCategory === 'Filter'
              ? this.props.items.map((item) => {
                  //all items
                  return <DisplayItems item={item} key={item._id} />;
                })
              : this.props.items //filter by category
                  .filter(
                    (item) =>
                      item.mainCategory === this.props.filterByMainCategory
                  )
                  .map((item) => {
                    return <DisplayItems item={item} key={item._id} />;
                  })}
          </div>
        ) : (
          <div className="mini-container-items">
            {foundWord
              ? this.props.items //filter by category
                  .filter(
                    (item) =>
                      item.subCategory.startsWith(searchWord) ||
                      item.mainCategory.startsWith(searchWord)
                  )
                  .map((item) => {
                    return <DisplayItems item={item} key={item._id} />;
                  })
              : ''}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    items: store.items,
    itemToBeEdited: store.itemToBeEdited,
    filterByMainCategory: store.filterByMainCategory,
    words: store.words,
    searchWord: store.searchWord,
    previewItem: store.previewItem,
  };
};
export default connect(mapStateToProps)(ItemsForm);
