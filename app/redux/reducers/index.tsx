import * as actionTypes from "../actions/actionTypes";
import {UserProfile} from "../../service/auth/interfaces/UserProfile";
import {ProductListInterface} from "@/service/product/ProductListInterface";
import {Data as pData} from "@/service/product/show/interface/ProductInformationInterface";



const userprofile: UserProfile = {
  status:  undefined,
  loginStatus:  undefined,
  data:  undefined,
};

const product: ProductListInterface|pData|undefined = undefined;


const systemDataInitialState = {
  auth : userprofile,
  product : product,
  environment : "",
  pageRouteData : {

  },
  fireBaseKey : "",
  launchPage : "",
  impersonateData : false,
  trashedUserData : false,
  supermarketHome : [],
  wholeSalesHomeData : [],
};


function systemReducer(state = systemDataInitialState, action:any){
  switch (action.type) {
    case actionTypes.SET_APPLICATION_DATA:
      return { ...state, auth: action.payload };
    case actionTypes.PAGE_ROUTER_DATA:
      return { ...state, pageRouteData: action.payload };
    case actionTypes.PRODUCT_DIALOG_DATA:
      return { ...state, product: action.payload };
    case actionTypes.ENVIRONMENT:
      return { ...state, environment: action.payload };
    case actionTypes.FIREBASE_DEVICE_KEY:
      return { ...state, fireBaseKey: action.payload };
    case actionTypes.LAUNCH_PAGE:
      return { ...state, launchPage: action.payload };
    case actionTypes.IMPERSONATE_DATA:
      return {...state, impersonateData: action.payload };
    case actionTypes.TRASHED_USER:
      return {...state, trashedUserData: action.payload };
    case actionTypes.SUPERMARKET_HOMEPAGE_DATA:
      return {...state, supermarketHome: action.payload };
    case actionTypes.WHOLESALES_HOMEPAGE_DATA:
      return {...state, wholeSalesHomeData: action.payload };
    default:
      return state;
  }
}

export {systemReducer} ;
