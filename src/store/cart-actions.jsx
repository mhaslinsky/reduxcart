import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export function fetchCartData() {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Fetching...",
        message: "Fetching Cart Data",
      })
    );
    async function fetchData() {
      const response = await fetch(
        "https://reduxcart-c442b-default-rtdb.firebaseio.com/cart.json"
      );
      console.log("fetch");
      console.log(response);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();

      return data;
    }

    try {
      const cartData = await fetchData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Fetching Cart Data Failed",
        })
      );
    }

    dispatch(
      uiActions.showNotification({
        status: "success",
        title: "Success",
        message: "Fetched Cart Data Successfully",
      })
    );
  };
}

export function sendCartData(cartState) {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending Cart Data",
      })
    );

    async function sendRequest() {
      const response = await fetch(
        "https://reduxcart-c442b-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cartState.items,
            totalQuantity: cartState.totalQuantity,
          }),
        }
      );

      console.log("send");
      console.log(response);

      if (response.ok) {
        dispatch(
          uiActions.showNotification({
            status: "success",
            title: "Success",
            message: "Sent Cart Data Successfully",
          })
        );
      } else {
        throw new Error("Cart not sent successfully");
      }
    }

    try {
      await sendRequest();
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "Cart Not Sent Successfully",
        })
      );
    }
  };
}
