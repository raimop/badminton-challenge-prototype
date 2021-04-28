import React, { useState, useEffect } from "react";
import { Form, Spin, Select, Button, DatePicker, Row, message } from "antd";
import { useHistory } from "react-router-dom";
import moment from "moment";
import * as services from "../../actions/services";

const { Option } = Select;
const layout = { wrapperCol: { span: 28 } };

const ChallengeCreate = (props) => {
  const { id } = props.match.params;
  const [ranking, setRanking] = useState(null);
  const history = useHistory();

  useEffect(() => {
    fetchOpponentRanking();
  }, []);

  const onFinish = (data) => {
    createChallenge(data);
  };

  const fetchOpponentRanking = () => {
    services
      .fetchRankings(id)
      .then((res) => {
        setRanking(res[0]);
      })
      .catch((e) => message.error("Viga vastase edetabeli andmete pärimisel"));
  };

  const createChallenge = (data) => {
    services
      .createChallenge(ranking.user._id, data)
      .then(() => {
        message.success("Väljakutse edukalt esitatud");
        history.push("/ranking");
      })
      .catch((e) => message.error("Viga väljakutse esitamisel"));
  };

  return (
    <main className="container">
      <h1>
        Esita väljakutse vastasele{" "}
        <strong>
          {ranking && `${ranking.user.firstName} ${ranking.user.lastName}`}
        </strong>
      </h1>
      {ranking ? (
        <Row type="flex" justify="flex-start" align="center">
          <Form
            {...layout}
            name="challenge"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size={"middle"}
            style={{ width: 180 }}
          >
            <Form.Item
              name="datetime"
              rules={[
                { required: true, message: "Palun sisesta toimumise aeg" },
              ]}
            >
              <DatePicker
                placeholder="Millal?"
                format="YYYY-MM-DD HH:mm"
                disabledDate={(current) =>
                  current && moment(current).diff(moment(), "minutes") <= 2880
                }
                showNow={false}
                minuteStep={15}
                showTime={{ defaultValue: moment("18:00", "HH:mm") }}
                renderExtraFooter={() =>
                  "Vali aeg minimaalselt 48h tunni pärast"
                }
              />
            </Form.Item>
            <Form.Item
              name="address"
              rules={[{ required: true, message: "Palun sisesta asukoht" }]}
            >
              <Select placeholder="Vali saal" style={{ textAlign: "left" }}>
                <Option value="Lasnamäe Sulgpallihall">
                  Lasnamäe Sulgpallihall
                </Option>
                <Option value="Tondiraba Tennisekeskus">
                  Tondiraba Tennisekeskus
                </Option>
                <Option value="Tallink Tennisekeskus">
                  Tallink Tennisekeskus
                </Option>
                <Option value="Golden Club">Golden Club</Option>
              </Select>
            </Form.Item>
            <Form.Item {...layout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", textAlign: "center" }}
              >
                Esita väljakutse
              </Button>
            </Form.Item>
          </Form>
        </Row>
      ) : (
        <Spin />
      )}
    </main>
  );
};
export default ChallengeCreate;
