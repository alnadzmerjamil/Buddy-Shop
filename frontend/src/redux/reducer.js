const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  userProfileShow: false, //User component

  orders: localStorage.getItem('order') //for admin view
    ? JSON.parse(localStorage.getItem('order'))
    : null,

  //happens on item
  items: [], //all items
  mainCategories: [],
  itemToBeEdited: null,
  showAddCategory: false,
  showAddItem: false,

  //happens @mycart
  myCart: localStorage.getItem('myCart')
    ? JSON.parse(localStorage.getItem('myCart'))
    : null,
  myCartCopy: localStorage.getItem('myCart')
    ? JSON.parse(localStorage.getItem('myCart'))
    : null,
  myCheckOutItems: [],
  checkOutAllItems: null,
  doneCheckOut: false,
  selectAll: false,

  //@MyCheckOut
  placeOrder: [],

  //happens @home page
  filterByMainCategory: 'Filter',
  filterOn: 'Filter',
  words: '', //lahat ng words, name, category
  searchWord: '',
  //@preview
  previewItem: null,
};

const reducer = (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    //From AdminView
    case 'SAVE_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };

    //From LoginForm.js
    case 'SAVE_MY_ACCOUNT':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: JSON.parse(localStorage.getItem('user')),
      };

    //From UserProfile.js
    case 'LOG_OUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return {
        ...state,
        user: action.payload,
      };

    //From App.jss
    case 'DISPATCH_ALL_ITEMS':
      //also from AddItemFom.js, DisplayItems.js, EditItemForm.js
      return {
        ...state,
        items: action.payload,
      };
    case 'ALL_CATEGORIES':
      //also from AddCategory.js
      return {
        ...state,
        mainCategories: action.payload,
      };
    case 'FILTER_CATEGORIES':
      return {
        ...state,
        filterByMainCategory: action.payload,
      };
    case 'FILTER_ON':
      return {
        ...state,
        filterOn: action.payload,
      };
    case 'USER_SHOW':
      //also from UserProfile.js
      return {
        ...state,
        userProfileShow: action.payload,
      };
    case 'WORDS':
      return {
        ...state,
        words: action.payload,
      };

    case 'SEARCH_WORD':
      return {
        ...state,
        searchWord: action.payload,
      };

    //From DisplayItems.js
    case 'EDIT_ITEM':
      return {
        ...state,
        itemToBeEdited: action.payload,
      };

    case 'ADD_TO_CART':
      //also from MyCart and MyCartMap
      return {
        ...state,
        myCart: action.payload,
        myCartCopy: action.payload,
      };
    case 'ADD_TO_PREVIEW':
      return {
        ...state,

        previewItem: action.payload,
      };

    //From MyCart and MyCartMap
    case 'NULL_TO_CART':
      return {
        ...state,
        myCart: null,
      };
    case 'ADD_TO_CHECKOUT':
      return {
        ...state,
        myCheckOutItems: action.payload,
      };
    case 'SHOW_CHECKOUTBTN':
      return {
        ...state,
        checkOutBtn: action.payload,
      };
    case 'SELECT_ALL':
      //also from MyCheckOut
      return {
        ...state,
        selectAll: action.payload,
      };
    case 'ADD_TO_MY_CARTCOPY':
      return {
        ...state,
        myCartCopy: action.payload,
      };
    case 'DONE_CHECKOUT':
      //also from MyCheckOut
      return {
        ...state,
        doneCheckOut: action.payload,
      };
    case 'PLACE_ORDER':
      return {
        ...state,
        placeOrder: action.payload,
      };

    //

    //From AddItemForm.js and AdminView.js
    case 'SHOW_MY_ADD_ITEM':
      return {
        ...state,
        showAddItem: action.payload,
      };

    //From AddCategory and AdminView.js
    case 'SHOW_MY_ADD_CATEGORY':
      return {
        ...state,
        showAddCategory: action.payload,
      };
    //
    default:
      return state;
  }
};
export default reducer;
