import React, {useState} from 'react';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, doRequest] = useRequest({
    url: '/api/auth/signup',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async event => {
    event.preventDefault()
    await doRequest()
  }

  return (
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
              type="email"
              className="form-control"
              value={email}
              onChange={event => setEmail(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
              type="password"
              className="form-control"
              value={password}
              onChange={event => setPassword(event.target.value)}
          />
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
      </form>
  );
};

export default Signup;
