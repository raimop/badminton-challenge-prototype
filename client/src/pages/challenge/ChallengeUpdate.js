import React, { useState, useEffect } from "react"; 
import { useSelector } from 'react-redux';
import { Table, Form, Select, Popconfirm, Divider, Row, Col, Button, message } from 'antd';
import { QuestionOutlined } from "@ant-design/icons"
import { useHistory } from "react-router-dom";  
import * as services from "../../actions/services";
import moment from 'moment-timezone';

const { Option } = Select;

const ChallengeUpdate = props => { 
  const { id } = props.match.params;
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [hideThirdGame, setHideThirdGame] = useState(true)
  const [validScore, setValidScore] = useState(false)
  const [winner, setWinner] = useState(null)
  const [opponent, setOpponent] = useState(null)
  const [userHelper, setUserHelper] = useState(null)
  const user = useSelector(state => state.auth.user);
  const history = useHistory();

  const helpers = {
    score: match => {
      let ar = match.map(e => e.join("-")).join(" | ")
      if (ar === "0-0 | 0-0 | 0-0" || ar === "0-0 | 0-0") return "Määramata"
      return ar
    }
  }

  const columns = [
    {
      title: 'Vastane',
      render: row => user._id === row.challenger.user._id ? `${row.challenged.user.firstName} ${row.challenged.user.lastName}` : `${row.challenger.user.firstName} ${row.challenger.user.lastName}`
    },
    {
      title: 'Tulemus',
      dataIndex:  "result",
      render: (field, row) => {
        if (!row.challenger.resultAccepted || !row.challenged.resultAccepted) return "Kinnitamata"
        if (row.winner._id !== user._id){
          let arr = []
          for (let i = 0; i < field.length; i++){
            arr.push([field[i][1], field[i][0]])
          }
          return helpers.score(arr)
        } 
        return helpers.score(field)
      }
    },
    {
      title: 'Aeg',
      dataIndex: ["info", "datetime"],
      render: (row) => moment(row).format('Do MMMM, HH.mm')
    },
    {
      title: 'Koht',
      dataIndex: ["info", "address"],
      render: row => row
    }
  ];

  useEffect(() => {
    fetchChallenge();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = data => {
    if (!winner){
      message.error("Võitja ei ole määratud")
      return 
    }
    let score = [[data[0],data[3]],[data[1],data[4]],[data[2],data[5]]]
    if (hideThirdGame) score.pop()
    if (winner._id !== user._id){
      score = normalizeScore(score)
    }

    updateChallenge({ score, winner: winner._id })
  }

  const onChange = (_, allFields) => {
    const [game1Up, game2Up, game3Up, game1Down, game2Down, game3Down] = allFields.map(e => e.value);

    if (((game1Up > game1Down && game2Down > game2Up) && (game1Up >= 21 && game2Down >= 21)) || ((game1Down > game1Up && game2Up > game2Down) && (game2Up >= 21 && game1Down >= 21))){
      setHideThirdGame(false)
    } else {
      setHideThirdGame(true)
    }

    validateScore(game1Up, game2Up, game3Up, game1Down, game2Down, game3Down)
  }

  const validateScore = (game1Up, game2Up, game3Up, game1Down, game2Down, game3Down) => {
    const validate = (s1, s2) => {
      if ((s1 === 30 || s2 === 30) && ((Math.abs(s1-s2) === 1) || (Math.abs(s1-s2) === 2))) return true // 30-28, 30-29 erand
      if ((s1 > 21 || s2 > 21) && (Math.abs(s1-s2) === 2)) return true // kui mõlemal üle 21 2 punktiline vahe
      if ((s1 === 21 && s2 <= 19) || (s2 === 21 && s1 <= 19)) return true // normaalne tulemus
      return false
    }

    let game1 = validate(game1Up, game1Down)
    let game2 = validate(game2Up, game2Down)
    let game3 = validate(game3Up, game3Down)

    let validateTwoGames = game1 && game2
    let validateThreeGames = validateTwoGames && game3

    const checkWinner = (g1U, g1D, g2U, g2D, g3U, g3D) => {
      if ((g1U > g1D && g2U > g2D && validateTwoGames) || (!hideThirdGame && (g1U > g1D && g2U < g2D && g3U > g3D) && validateThreeGames) || (!hideThirdGame && (g1U < g1D && g2U > g2D && g3U > g3D) && validateThreeGames)){
        setWinner(user)
      } else if ((g1U < g1D && g2U < g2D && validateTwoGames) || (!hideThirdGame && (g1U > g1D && g2U < g2D && g3U < g3D) && validateThreeGames) || (!hideThirdGame && (g1U < g1D && g2U > g2D && g3U < g3D) && validateThreeGames)){
        setWinner(opponent)
      } else {
        setWinner(null)
      }
    }

    checkWinner(game1Up, game1Down, game2Up, game2Down, game3Up, game3Down)
    setValidScore(hideThirdGame ? validateTwoGames : validateThreeGames)
  }

  const fetchChallenge = () => {
    setLoading(true)
    services.fetchChallenges(id)
      .then(res => {
        console.log(res)
        setData([res])
        setOpponent(res.challenger.user._id === user._id ? res.challenged.user : res.challenger.user)
        setUserHelper(user._id === res.challenger.user._id ? "challenger" : "challenged")
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const normalizeScore = score => {
    let arr = []
      for (let i = 0; i < score.length; i++){
        arr.push([score[i][1], score[i][0]])
      }
    return arr
  }

  const updateChallenge = data => {
    services.updateChallenge(id, data)
      .then(() => {
        message.success("Tulemus esitatud")
        history.push(`/challenges`);
      })
      .catch(e => message.error("Viga väljakutse uuendamisel"))
  }

  const displayGamePoints = () => {
    const allPoints = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    const games = ["1.", "2.", "3."]
    let children = []
    for (let i = 0; i < 6; i++){
      children.push((
        <Col span={8} key={i}>
          <h2>{ i < 3 && `${games[i]} geim` }</h2>
          <Form.Item initialValue={0} name={i} rules={[ { required: true, message: 'Sisesta tulemus' }, ]} >
            <Select disabled={(i === 2 || i === 5) && hideThirdGame} style={{ width: 120 }}>
              { allPoints.map(e => <Option key={e} value={e}>{e}</Option>) }
            </Select>
          </Form.Item>
        </Col>
      ))
    }
    return children;
  }

  return ( 
    <>
      <h1 className="text-center">Sisesta väljakutse tulemus</h1>
      <div className="container">
        <Table loading={loading} locale={{ emptyText: "Andmed puuduvad" }} pagination={false}  columns={columns} rowKey='_id' dataSource={data}/>
        <Divider/>
        { userHelper &&
          <>
            { data.length > 0 && data[0].winner == null ? 
                "Ole esimene, kes sisestab tulemust" 
                : 
                !data[0][userHelper].resultAccepted ? 
                  <Popconfirm
                    icon={<QuestionOutlined style={{ color: 'red' }} />}
                    title={`Oled kindel, et tahad tulemust aktsepteerida?`}
                    onConfirm={() => updateChallenge({ winner: data[0].winner._id, score: data[0].result })}
                    onCancel={() => message.success("Tulemuse aktsepteerimine peatatud")}
                    okText="Jah"
                    cancelText="Ei"
                  >
                  <button className="custom-button">Aktsepteeri tulemust ({data[0].winner.firstName + " " + data[0].winner.lastName} võitis seisuga {data[0].result.map(e => e.join("-")).join(" | ")})</button> 
                  </Popconfirm>
                  
                  : 
                  "Ootame vastase tulemust" 
            }
            <Divider/>
            <Row type="flex" justify="flex-start" align="center">
              <Form
                name="submitScore"
                onFinish={onFinish}
                size={"large"}
                onFieldsChange={onChange}
              >
                <h2 className="title-center">Võitja: { winner != null ? `${winner.firstName} ${winner.lastName}` : "määramata" } </h2>
                <Row className="title-center">
                  { displayGamePoints(6) }
                </Row>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button disabled={!validScore} type="primary" htmlType="submit" style={{ width: "50%" }}>
                    Saada tulemus
                  </Button>
                </Form.Item>
              </Form>
            </Row>
          </>
          }
        </div>
    </>
  ); 
}; 
export default ChallengeUpdate; 
