import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { updateRankings } from '../redux/rankingSlice';
import { Tabs, Popconfirm, message } from 'antd';
import { QuestionOutlined, CheckCircleFilled } from '@ant-design/icons';
import RankingTable from "../components/RankingTable"
import * as services from "../actions/services.js";

const { TabPane } = Tabs;

const Ranking = () => {
  const ranking = useSelector(state => state.ranking);
  const user = useSelector(state => state.auth.user);
  const [defaultActiveKey, setDefaultActiveKey] = useState(user && user.gender === "m" ? "ms" : "ws")
  const dispatch = useDispatch();
  const { isLoading } = ranking;
  const data = ranking.data || { ms: [], ws: [] };
  const types = [{ type: "Meesüksikmängud", short: "ms" }, {  type: "Naisüksikmängud", short: "ws" }]

  useEffect(() => {
    dispatch(updateRankings())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoinLeave = decision => {
    services.entryRankings(decision)
      .then(res => {
        dispatch(updateRankings())
        message.success(`Oled ${decision.toLowerCase().concat("nud")} edetabeli${decision === "Liitu" ? "ga" : "st"}`)
      })
      .catch(e => message.error(`Viga edetabelist ${decision.toLowerCase()}misega`))
  }

  const displayJoinLeaveButton = input => {
    const decision = input === "join" ? "Liitu" : "Lahku"
    const ending = `${decision === "Liitu" ? "ga" : "st"}`
    return (
      <div style={{ display: "flex" }}>
        <Popconfirm
          icon={<QuestionOutlined style={{ color: 'red' }} />}
          title={`Oled kindel, et tahad ${decision.toLowerCase().concat("da")} edetabeli${ending}?`}
          onConfirm={() => handleJoinLeave(decision)}
          onCancel={() => message.success('Tegevus peatatud')}
          okText="Jah"
          cancelText="Ei"
        >
          <button className="custom-button"><CheckCircleFilled/> { `${decision} edetabeli${ending} `}</button>
        </Popconfirm>
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <h1>Edetabel</h1>
        <Tabs defaultActiveKey={defaultActiveKey} onChange={key => setDefaultActiveKey(key)}>
          {
            types.map((e, i) => (
              <TabPane tab={e.type} key={types[i].short}> 
                <RankingTable loading={isLoading} type={e.short} data={data[e.short]} displayJoinLeaveButton={displayJoinLeaveButton}/>
              </TabPane>
              ))
          }
        </Tabs> 
      </div>
    </>
  )
}

export default Ranking