import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({Component, pageProps, currentUser}) => {
  return <div>
    <Header currentUser={currentUser}/>
    <Component {...pageProps}/>
  </div>
};

AppComponent.getInitialProps = async appContext => {
  const {data} = await buildClient(appContext.ctx).get('/api/auth/currentuser')
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx)
  }
  console.log(data)

  return {pageProps, ...data}
}

export default AppComponent;
