import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getChallengePending, getChallengeSuccess } from '../../redux/challengeSlice';
import { Table, Tooltip, Divider, message } from 'antd';
import { DeleteTwoTone, StopTwoTone } from "@ant-design/icons"
import * as services from "../../actions/services";
import moment from 'moment-timezone';

const Challenges = () => {
  const user = useSelector(state => state.auth.user);
  const challenges = useSelector(state => state.challenge);
  const { isLoading } = challenges;
  const data = challenges.data || { unconfirmed: [], rest: [] }
  const dispatch = useDispatch();

  const helpers = {
    score: match => {
      let ar = match.map(e => e.join("-")).join(" | ")
      if (ar === "0-0 | 0-0 | 0-0" || ar === "0-0 | 0-0") return "Kinnitamata"
      return ar
    },
    deleteChallenge: row => <Tooltip title="Kustuta väljakutse"><button onClick={() => deleteChallengeRow(row)}><DeleteTwoTone /></button></Tooltip>,
    cannotDeleteChallenge: () => <Tooltip title="Väljakutset ei saa kustutada"><StopTwoTone twoToneColor="red" /></Tooltip>,
  }

  const columns = [
    {
      title: 'Vastane',
      render: row => {
        return user._id === row.challenger.user._id ? `${row.challenged.user.firstName} ${row.challenged.user.lastName}` : `${row.challenger.user.firstName} ${row.challenger.user.lastName}`
      }
    },
    {
      title: 'Tulemus',
      dataIndex:  "result",
      render: (field) => helpers.score(field)
    },
    {
      title: 'Aeg',
      dataIndex: ["info", "datetime"],
      responsive: ['md'],
      sortDirections: ['ascend', 'descend'],
      sorter: (a, b) => moment(a.info.datetime).unix() - moment(b.info.datetime).unix(),
      render: (row) => moment(row).format('DD MMMM, HH.mm')
    },
    {
      title: 'Koht',
      dataIndex: ["info", "address"],
      responsive: ['md'],
    },
    {
      title: 'Tegevus',
      width: "5%",
      align: 'center',
      render: (row) => "Tegevus"
    },
    {
      title: 'Kustuta',
      width: "5%",
      align: 'center',
      render: (row) => moment(row.info.datetime).diff(moment(), "minutes") >= 1440 && !(row.challenger.resultAccepted || row.challenged.resultAccepted) ? helpers.deleteChallenge(row) : helpers.cannotDeleteChallenge()
    },
  ];

  const deleteChallengeRow = ({ _id }) => {
    services.deleteChallenge(_id)
      .then(res => { 
        message.success("Väljakutse kustutamine õnnestus") 
        fetchChallenges();
      })
      .catch(e => message.error(e))
  }

  useEffect(() => {
    fetchChallenges();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchChallenges = () => {
    dispatch(getChallengePending())
    services.fetchChallenges()
      .then(res => {
        dispatch(getChallengeSuccess({
          unconfirmed: res.filter(e => !(e.challenger.resultAccepted && e.challenged.resultAccepted)),
          rest: res.filter(e => (e.challenger.resultAccepted && e.challenged.resultAccepted))
        }))
      })
      .catch(e => message.error(e))
  }

  return (
    <>
      <h1 className="text-center">Väljakutsed</h1>
      <div className="container">
        <Table title={() => "Kinnitama väljakutsed"} loading={isLoading} locale={{ emptyText: "Andmed puuduvad" }} columns={columns} rowKey='_id' pagination={false} dataSource={data.unconfirmed}/>
        <Divider/>
        <Table rowClassName={(rec) => rec.winner !== null && (rec.challenger.resultAccepted && rec.challenged.resultAccepted) ? rec.winner._id === user._id ? "won-match" : "lost-match" : null } loading={isLoading} locale={{ emptyText: "Andmed puuduvad" }} columns={columns} rowKey='_id' pagination={false} dataSource={data.rest}/>
      </div>
    </>
  )
}

export default Challenges