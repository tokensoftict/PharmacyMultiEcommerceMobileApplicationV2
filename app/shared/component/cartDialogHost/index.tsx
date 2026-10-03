import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '@/redux/store/store';
import * as action from '@/redux/actions';
import AddToCartDialog from '@/shared/component/addToCartDialog';

/**
 * Single, app-wide host for the Add-to-Cart dialog.
 *
 * Previously every screen wrapper (Wrapper, WrapperNoScroll, HomeHeader,
 * CollapsableHeader) mounted its own dialog AND subscribed to the whole redux
 * store, so opening the dialog re-rendered entire screens (and several stacked
 * screens mounted duplicate modals) - which made the slide-up animation janky.
 *
 * Now exactly one dialog lives here. It subscribes ONLY to the product slice,
 * so opening/closing re-renders just this tiny component. Callers keep using
 * `store.dispatch(action.setProductDialogData(product))` unchanged.
 */
function CartDialogHost() {
  const product = useSelector((state: any) => state.systemReducer.product);

  const handleClose = useCallback(() => {
    store.dispatch(action.setProductDialogData(undefined));
  }, []);

  return <AddToCartDialog product={product} onClose={handleClose} />;
}

export default React.memo(CartDialogHost);
