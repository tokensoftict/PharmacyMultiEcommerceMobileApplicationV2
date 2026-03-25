import * as actionTypes from "./actionTypes";

export const setApplicationData = (applicationData:any) => (dispatch:any) => {
  dispatch({
    type : actionTypes.SET_APPLICATION_DATA,
    payload: applicationData,
  })
}


export const setPageRouterData = (pageRouterData:any) => (dispatch:any) => {
  dispatch({
    type : actionTypes.PAGE_ROUTER_DATA,
    payload: pageRouterData,
  })
}

export const setProductDialogData = (productDialogData:any) => (dispatch:any) => {
  dispatch({
    type : actionTypes.PRODUCT_DIALOG_DATA,
    payload: productDialogData,
  })
}

export const setEnvironment = (environment:string) => (dispatch:any) => {
  dispatch({
    type : actionTypes.ENVIRONMENT,
    payload: environment,
  })
}

export const setFirebaseDeviceToken = (token: string | null) => (dispatch:any) => {
  dispatch({
    type : actionTypes.FIREBASE_DEVICE_KEY,
    payload: token,
  })
}

export const setLaunchPage = (page:string) => (dispatch:any) => {
  dispatch({
    type : actionTypes.LAUNCH_PAGE,
    payload: page,
  })
}

export const setImpersonateData = (page:string|boolean) => (dispatch:any) => {
  dispatch({
    type : actionTypes.IMPERSONATE_DATA,
    payload: page,
  })
}

export const setTrashedUserData = (page:string|boolean) => (dispatch:any) => {
  dispatch({
    type : actionTypes.TRASHED_USER,
    payload: page,
  })
}

export const setSuperMarketHomeData = (data:string) => (dispatch:any) => {
  dispatch({
    type : actionTypes.SUPERMARKET_HOMEPAGE_DATA,
    payload: data,
  })
}

export const setWholeSalesHomeData = (data:string) => (dispatch:any) => {
  dispatch({
    type : actionTypes.WHOLESALES_HOMEPAGE_DATA,
    payload: data,
  })
}
