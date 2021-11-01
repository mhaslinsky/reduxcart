import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect } from "react";
import Notification from "./components/UI/Notification";
import { fetchCartData, sendCartData } from "./store/cart-actions";
import { uiActions } from "./store/ui-slice";

let isInital = true;

function App() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.ui.cartIsVisible);
  const cartState = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    if (isInital) {
      dispatch(fetchCartData());
      isInital = false;
      return;
    }
    if (cartState.cartChanged) {
      dispatch(sendCartData(cartState));
    }

    const timer = setTimeout(() => {
      dispatch(uiActions.showNotification(null));
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [cartState, dispatch]);

  return (
    <React.Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        ></Notification>
      )}
      <Layout>
        {cart && <Cart />}
        <Products />
      </Layout>
    </React.Fragment>
  );
}

export default App;
