import React from 'react';
import buildClient from "../api/build-client";

const LandingPage = ({currentUser}) => {
  return currentUser ? <h1>You are signed in </h1> : <h1>You are not Signed in </h1>
};

LandingPage.getInitialProps = async (context) => {
  const {data} = await buildClient(context).get('/api/auth/currentuser')
  return data
}
export default LandingPage;
