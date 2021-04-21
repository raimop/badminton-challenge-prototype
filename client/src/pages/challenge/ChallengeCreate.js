import React, { useState, useEffect } from "react"; 
import { Form, Spin, Select, Button, DatePicker, Row, message } from 'antd';
import { useHistory } from "react-router-dom";  
import moment from 'moment-timezone';
import * as services from "../../actions/services";

const { Option } = Select;
const layout = { wrapperCol: { span: 28 } };

const styles = {
  ul: { textAlign: "left", fontWeight: "600", listStyle: "none", padding: "0 1em", width: "225px", margin: "0 auto 5vh auto" },
  li: { float: "right" }
}

const ChallengeCreate = props => { 
  const { id } = props.match.params;
  const [ranking, setRanking] = useState(null)
  const history = useHistory();

  useEffect(() => {
    fetchOpponentRanking();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = data => {
    createChallenge(data);
  }

  const fetchOpponentRanking = () => {
    services.fetchRankings(id)
      .then(res => {
        setRanking(res[0])
      })
      .catch(e => message.error("Viga vastase edetabeli andmete pärimisel"))
  }
  
  const createChallenge = data => {
    services.createChallenge(ranking.user._id, data)
      .then(() => {
        message.success("Väljakutse edukalt esitatud")
        history.push("/ranking");
      })
      .catch(e => message.error("Viga väljakutse esitamisel"))
  }

  return ( 
    <>
      <h1 className="text-center">Esita väljakutse vastasele</h1>
      {
        ranking ?
          <>
            <ul style={styles.ul}>
              <li><span>Nimi:</span> <span style={styles.li}>{ ranking.user.firstName + " " + ranking.user.lastName}</span></li>
              <li><span>Liik:</span> <span style={styles.li}>{ ranking.category === "ms" ? "meesüksikmäng" : "naisüksikmäng" }</span></li>
            </ul>
            <Row type="flex" justify="flex-start" align="center">
              <Form
                {...layout}
                name="challenge"
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                size={"large"}
                >
                <Form.Item name="datetime"
                  rules={[
                    { required: true, message: 'Palun sisesta toimumise aeg', },]}>
                  <DatePicker
                    placeholder="Millal?"
                    format="YYYY-MM-DD HH:mm"
                    disabledDate={current => current && moment(current).diff(moment(), "minutes") <= 2880}
                    disabledTime={false}
                    showNow={false}
                    minuteStep={15}
                    showTime={{ defaultValue: moment('18:00', 'HH:mm')}}
                    renderExtraFooter={() => 'Vali aeg minimaalselt 48h tunni pärast'}
                  />
                </Form.Item>
                <Form.Item
                  name="address"
                  rules={[
                    { required: true, message: 'Palun sisesta asukoht', }]}
                >
                  <Select placeholder="Vali saal">
                    <Option value="Lasnamäe Sulgpallihall">Lasnamäe Sulgpallihall</Option>
                    <Option value="Tondiraba Tennisekeskus">Tondiraba Tennisekeskus</Option>
                    <Option value="Tallink Tennisekeskus">Tallink Tennisekeskus</Option>
                    <Option value="Golden Club">Golden Club</Option>
                  </Select>
                </Form.Item>
                <Form.Item {...layout}>
                  <Button type="primary" htmlType="submit" style={{ width: "100%", textAlign: "center" }}>
                    Esita väljakutse
                  </Button>
                </Form.Item>
              </Form>
            </Row>
            </>
          :
          <Spin/>
      }
    </> 
  ); 
}; 
export default ChallengeCreate; 
