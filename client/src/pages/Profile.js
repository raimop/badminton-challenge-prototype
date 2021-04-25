import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Row, Button, message, Switch } from "antd";
import { updateUser } from "../redux/authSlice";
import * as services from "../actions/services";

const layout = { wrapperCol: { span: 26 } };

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const onFinish = (data) => {
    services
      .updateUser(data)
      .then((res) => {
        dispatch(updateUser(res));
        message.success("Profiili uuendamine õnnestus");
      })
      .catch((e) => message.error(e));
  };

  return (
    <main className="container">
      <h1>Profiil</h1>
      <h2>Tere, {`${user.firstName} ${user.lastName}`}</h2>
      <Row type="flex" justify="flex-start" align="center">
        <Form
          {...layout}
          name="notifications"
          onFinish={onFinish}
          size={"middle"}
        >
          <Form.Item
            name="showHistory"
            valuePropName="checked"
            label="Teised näevad Sinu väljakutsete ajalugu?"
            initialValue={user.preferences.showHistory}
          >
            <Switch
              checkedChildren="jah"
              unCheckedChildren="ei"
              defaultChecked={user.preferences.showHistory}
            />
          </Form.Item>
          <Form.Item
            name="emailNotif"
            valuePropName="checked"
            label="Väljakutsete teated tulevad e-maili teel?"
            initialValue={user.preferences.emailNotif}
          >
            <Switch
              checkedChildren="jah"
              unCheckedChildren="ei"
              defaultChecked={user.preferences.emailNotif}
            />
          </Form.Item>
          <Form.Item {...layout}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Kinnita
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </main>
  );
};

export default Profile;
