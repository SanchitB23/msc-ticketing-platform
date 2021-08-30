import React, {useEffect, useState} from 'react';
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [errors, doRequest] = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () =>
        Router.push('/orders')
  })

  let timerId
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
      <div>
        <h1>{order.ticket.title}</h1>
        {timeLeft < 0 ? <div>Order Expired</div> : <div>Time Left to pay: {timeLeft}
          <StripeCheckout
              token={({id}) => doRequest({token: id})}
              stripeKey="pk_test_51JTm2NSAyHSyVuXyCVf111svWkRzmwbjQNlGRYdmfVrGbdyiwOoYeWyWaVXfS4jcCjbtPh5q1kOly4ysh8UvarL1008wjvMvJp"
              amount={order.ticket.price * 100}
              email={currentUser.email}
              currency="inr"
          />
          {errors}
        </div>}
      </div>
  );
};
OrderShow.getInitialProps = async (context, client) => {
  const {orderId} = context.query;
  const {data} = await client.get(`/api/orders/${orderId}`);
  return {order: data}
}
export default OrderShow;
