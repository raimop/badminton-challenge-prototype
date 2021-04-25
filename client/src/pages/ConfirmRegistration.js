import React, { useEffect, useState } from "react";
import { Alert, message } from "antd";
import * as services from "../actions/services";

const ConfirmRegistration = (props) => {
  const { confirmationCode } = props.match.params;
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    verifyUser(confirmationCode);
  }, []);

  const verifyUser = (confirmationCode) => {
    services
      .verifyUser(confirmationCode)
      .then((res) => {
        setResponse(res.msg);
        message.success(res.msg);
      })
      .catch((e) => {
        setError(e);
        message.error(e);
      });
  };

  return (
    <main className="container">
      <h1>Kasutaja konto kinnitamine</h1>
      {response && <Alert message={response} type="success" />}
      {error && <Alert message={error} type="error" />}
    </main>
  );
};
export default ConfirmRegistration;
