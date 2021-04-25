import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Vabandust, seda lehekülge ei eksisteeri"
      extra={
        <Button type="primary" onClick={history.goBack}>
          Tagasi
        </Button>
      }
    />
  );
};

export default NotFound;
