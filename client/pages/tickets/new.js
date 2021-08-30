import React, {useState} from 'react';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [errors, doRequest] = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  });
  const onBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value))
      return
    setPrice(value.toFixed(2))
  }
  const onSubmit = (event) => {
    event.preventDefault()
    doRequest()
  }
  return (
      <div>
        <h1>Create a Ticket</h1>
        <form action="#" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input className={"form-control"} type="text" onChange={(e) => setTitle(e.target.value)} value={title}/>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="text" className={"form-control"} onChange={(e) => setPrice(e.target.value)} onBlur={onBlur}
                   value={price}/>
          </div>
          {errors}
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
  );
};

export default NewTicket;
