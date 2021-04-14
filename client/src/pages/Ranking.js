import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getRankingPending, getRankingSuccess, getRankingFail } from '../redux/rankingSlice';
import { Tabs, message } from 'antd';
import RankingTable from "../components/RankingTable"
import * as services from "../actions/services.js";

const { TabPane } = Tabs;

const Ranking = () => {
  const [defaultActiveKey, setDefaultActiveKey] = useState("ms")
  const dispatch = useDispatch();
  const ranking = useSelector(state => state.ranking);
  const { isLoading } = ranking;
  const data = ranking.data || { ms: [], ws: [] };
  const types = [{ type: "Meesüksikmäng", short: "ms" }, {  type: "Naisüksikmäng", short: "ws" }]

  useEffect(() => {
    fetchTableData();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTableData = () => {
    dispatch(getRankingPending())
    services.fetchRankings()
      .then(res => dispatch(getRankingSuccess(res)))
      .catch(e => { 
        dispatch(getRankingFail(e)) 
        message.error(e)
      })
  }

  return (
    <>
      <h1 className="text-center">Edetabel</h1>
      <div className="container">
        <Tabs defaultActiveKey={defaultActiveKey} onChange={key => setDefaultActiveKey(key)}>
          {
            types.map((e, i) => (
              <TabPane tab={e.type} key={i}> 
                <RankingTable loading={isLoading} data={data[e.short]} />
              </TabPane>
              ))
          }
        </Tabs> 
      </div>
    </>
  )
}

export default Ranking
