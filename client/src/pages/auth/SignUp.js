import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";  
import { useSelector } from 'react-redux';
import { Alert, Form, Input, Button, Select, Row, message } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as services from "../../actions/services.js";

const { Option } = Select;

const layout = { wrapperCol: { span: 24 } };

const SignUp = () => {
  let history = useHistory();
  const user = useSelector(state => state.auth.user);
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (user){
      message.error("Palun logi välja selleks, et registreeruda")
      history.push("/");
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = values => {
    services.signup(values)
    .then(() => {
      message.success("Registreeritud!")
      setRegistered(true)
    })
    .catch(e => {
      if (e instanceof Error) return message.error("Viga serveriga") 
      message.error(e)
    })
  };

  return (    
    <Row type="flex" justify="flex-start" align="center">
      { registered ? 
        <Alert message="Registreerimne oli edukas, kinnita enda e-posti aadress" type="success" /> 
        : 
        <Form
          {...layout}
          name="signup"
          initialValues={{ remember: true, }}
          onFinish={onFinish}
          size={"middle"}
          style={{ width: 200 }}
        >
          <h1 className="text-center">Registreeru</h1>
          <Form.Item
            name="firstName"
            rules={[
              { required: true, message: 'Palun sisesta enda eesnimi!' },
              { min: 2, message: 'Vähemalt 2 tähte pikk' }]}
          >
            <Input prefix={<UserOutlined/>} placeholder="Eesnimi" />
          </Form.Item>
          <Form.Item 
            name="lastName"
            rules={[
              { required: true, message: 'Palun sisesta enda perekonnanimi!' },
              { min: 2, message: 'Vähemalt 2 tähte pikk' }]}
          >
            <Input prefix={<UserOutlined/>} placeholder="Perekonnanimi" />
          </Form.Item>
          <Form.Item 
            name="email"
            rules={[
              { required: true, message: 'Palun siseta enda e-mail!' },
              { type: 'email', message: 'Peab olema korrektne e-mail' }]}
          >
            <Input prefix={<UserOutlined/>} placeholder="E-mail" />
          </Form.Item>
          <Form.Item 
            name="gender"
            rules={[
              { required: true, message: 'Palun vali sugu!' },
              { len: 1, message: 'Sugu peab olema kas m (mees) või f (naine)' }]}
          >
            <Select placeholder="Vali sugu">
              <Option value="m">Mees</Option>
              <Option value="f">Naine</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            name="password"
            rules={[
              { required: true, message: 'Palun siseta enda parool!', }, 
              { min: 6, message: 'Vähemalt 6 tähemärki pikk' }]}
          >
            <Input.Password
              prefix={<LockOutlined/>}
              type="password"
              placeholder="Parool"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Palun kinnita enda parool',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Paroolid ei kattu'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined/>}
              type="confirm"
              placeholder="Kinnita parool"
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
            />
          </Form.Item>
          <Form.Item {...layout}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Registreeru
            </Button>
            <br/>
            <Link to="/login">või logi sisse</Link>
          </Form.Item>
        </Form> 
      }
    </Row>
  );
};

export default SignUp;