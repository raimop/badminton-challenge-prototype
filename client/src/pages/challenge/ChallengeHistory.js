import React, { useState, useEffect } from "react"; 
import { useSelector } from 'react-redux';
import { message, Table } from 'antd';
import { useHistory } from "react-router-dom";
import moment from 'moment-timezone';
import * as services from "../../actions/services";

const ChallengeHistory = props => { 
  const { id } = props.match.params;
  const user = useSelector(state => state.auth.user);
  const history = useHistory();
  const [state, setState] = useState({
    data: [],
    userHistory: null,
    ranking: null,
    loading: false,
  })

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
      render: row => state.userHistory && (state.userHistory._id === row.challenger.user._id) ? `${row.challenged.user.firstName} ${row.challenged.user.lastName}` : `${row.challenger.user.firstName} ${row.challenger.user.lastName}`
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
        if (state.userHistory && row.winner._id !== state.userHistory._id){
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
    setState({
      ...state,
      loading: true
    })

    services.fetchChallengeHistory(id)
      .then(res => {
        setState({
          data: res.data,
          userHistory: res.user,
          ranking: res.ranking,
          loading: false
        })
      })
      .catch(e => message.error("Viga väljakutsete ajaloo pärimisel"))
  }

  return ( 
    <div className="container">
      { state.ranking && state.userHistory && user._id !== state.userHistory._id && user.gender === state.userHistory.gender && <div className="text-left"><button className="custom-button" onClick={() => history.push(`/challenges/create/${state.ranking._id}`)}>Esita väljakutse</button></div>}
      { state.userHistory && <h1>Kasutaja <strong>{state.userHistory.firstName} {state.userHistory.lastName}</strong> {!state.userHistory.preferences.showHistory ? "on valinud peita enda väljakutsete ajalugu" : "väljakutsete ajalugu" }</h1>}
      <Table loading={state.loading} rowClassName={(rec) => rec.winner !== null && (rec.challenger.resultAccepted && rec.challenged.resultAccepted) ? rec.winner._id === state.userHistory._id ? "won-match" : "lost-match" : null } locale={{ emptyText: "Väljakutsed puuduvad" }} pagination={false} columns={columns} rowKey='_id' dataSource={state.data}/>
    </div>
  ); 
}; 
export default ChallengeHistory; 
