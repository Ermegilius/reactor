import { useState } from "react";
import axios from "axios";

const useAxios = (baseUrl) => {
  const [data, setData] = useState([]); // data is the response from the server, [] by default
  const [alert, setAlert] = useState({ show: false, message: "", type: "" }); // alert is an object with show, message, and type properties, initially set to false, empty string, and empty string
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const makeRequest = async (method, endpoint, payload = null) => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        data: payload,
      });
      if (method === "get") {
        setData(response.data);
      }
      if (method === "post") {
        showAlert("Person added successfully", "success");
      }
      if (method === "delete") {
        showAlert("Person deleted successfully", "success");
      }
      return response.data;
    } catch (error) {
      showAlert(error.message, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // all methods:
  const get = async (endpoint) => makeRequest("get", endpoint);
  const post = async (endpoint, payload) =>
    makeRequest("post", endpoint, payload);
  const update = async (endpoint, payload) =>
    makeRequest("put", endpoint, payload);
  const remove = async (endpoint) => makeRequest("delete", endpoint);

  return { data, alert, loading, get, post, update, remove };
};

export default useAxios;
