import React, {useEffect} from 'react';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const [errors, doRequest] = useRequest({
    url: '/api/auth/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })

  useEffect(() => {
    doRequest()
  }, [])

  return (
      <div>Signing you out...</div>
  );
};

export default Signout;
