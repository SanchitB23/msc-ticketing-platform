import axios from "axios";

const buildClient = ({req}) => {
  if (typeof window === 'undefined') {
    console.log("I am on server")
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local:81',
      headers: req.headers
    })
  } else {
    return axios.create({
      baseURL: '/'
    })
  }
};

export default buildClient;
