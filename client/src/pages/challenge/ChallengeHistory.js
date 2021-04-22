import React, { useState, useEffect } from "react"; 
import { useSelector } from 'react-redux';
import { message, Table } from 'antd';
import { useHistory } from "react-router-dom";
import moment from 'moment-timezone';
import * as services from "../../actions/services";

const ChallengeHistory = props => { 
  const history = useHistory();
  const user = useSelector(state => state.auth.user);
  const { id } = props.match.params;
  const [data, setData] = useState([])
  const [historyUser, setHistoryUser] = useState(null)
  const [ranking, setRanking] = useState(null)
  const [loading, setLoading] = useState(false)

  const helpers = {
    format: data => {
      if (!data) return "Sisestamata"
      return `${data.firstName} ${data.lastName}`
    }, 
    score: match => {
      let ar = match.map(e => e.join("-")).join(" | ")
      if (ar === "0-0 | 0-0 | 0-0" || ar === "0-0 | 0-0") return "Sisestamata"
      return ar
    }
  }

  const columns = [
    {
      title: 'Vastane',
      render: row => historyUser && (historyUser._id === row.challenger.user._id) ? `${row.challenged.user.firstName} ${row.challenged.user.lastName}` : `${row.challenger.user.firstName} ${row.challenger.user.lastName}`
    },
    {
      title: 'Aeg',
      dataIndex: ["info", "datetime"],
      responsive: ['md'],
      sortDirections: ['ascend', 'descend'],
      
      sorter: (a, b) => moment(a.info.datetime).unix() - moment(b.info.datetime).unix(),
      render: (row) => moment(row).format('DD MMMM')
    },
    {
      title: 'Tulemus',
      dataIndex:  "result",
      render: (field, row) => {
        if (!row.challenger.resultAccepted || !row.challenged.resultAccepted) return "Kinnitamata"
        if (historyUser && row.winner._id !== historyUser._id){
          let arr = []
          for (let i = 0; i < field.length; i++){
            arr.push([field[i][1], field[i][0]])
          }
          return helpers.score(arr)
        } 
        return helpers.score(field)
      }
    }
  ];

  useEffect(() => {
    fetchRankingsHistory(id);
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRankingsHistory = id => {
    setLoading(true)
    services.fetchChallengeHistory(id)
      .then(res => {
        setHistoryUser(res.user)
        setData(res.data)
        setRanking(res.ranking)
        setLoading(false)
      })
      .catch(e => message.error("Viga väljakutsete ajaloo pärimisel"))
  }

  if (historyUser !== null && !historyUser.preferences.showHistory){
    return <h1 className="text-center">Kasutaja <strong>{historyUser.firstName} {historyUser.lastName}</strong> on valinud peita enda väljakutsete ajalugu</h1>
  }

  return ( 
    <div className="container">
      { historyUser && <h1 className="text-center">Kasutaja <strong>{historyUser.firstName} {historyUser.lastName}</strong> väljakutsete ajalugu</h1> }
      { ranking && user._id !== historyUser._id && user.gender === historyUser.gender && <button className="custom-button" onClick={() => history.push(`/challenges/create/${ranking._id}`)}>Esita talle väljakutse</button>}
      <Table loading={loading} rowClassName={(rec) => rec.winner !== null && (rec.challenger.resultAccepted && rec.challenged.resultAccepted) ? rec.winner._id === historyUser._id ? "won-match" : "lost-match" : null } locale={{ emptyText: "Väljakutsed puuduvad" }} pagination={false} columns={columns} rowKey='_id' dataSource={data}/>
    </div>
  ); 
}; 
export default ChallengeHistory; 
