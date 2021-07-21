import {useState} from "react";
import axios from "axios";

const useRequest = ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)
      if (onSuccess) onSuccess(response.data)
    } catch (e) {
      setErrors(
          <div className="alert alert-danger">
            <h4>Oops...</h4>
            <ul className="my-0">{e.response.data.errors.map(value => <li
                key={value.message}>{value.message}</li>)}</ul>
          </div>
      )
    }
  }
  return [errors, doRequest]
}
export default useRequest
