import React, { useEffect, useState } from "react"; 
import { Table, message, Popconfirm, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, toggleNotification, removeAllNotifications, removeNotification, removeChallengeFromNotification } from '../redux/notificationSlice';
import { CheckCircleTwoTone, StopTwoTone, DeleteTwoTone, QuestionOutlined, DeleteOutlined } from "@ant-design/icons"
import * as services from "../actions/services";
import moment from 'moment-timezone';
import "./Notifications.css"

const Notifications = ({ title }) => { 
  const notifications = useSelector(state => state.notifications);
  const [data, setData] = useState(notifications.data || [])
  const { isLoading } = notifications;
  const dispatch = useDispatch();

  useEffect(() => {
    setData(notifications.data)
  }, [notifications])

  const clickableToggleRead = row => <span style={{ cursor: "pointer" }} onClick={() => toggleNotificationRead(row)}>{row.content}</span>

  const columns = [
    {
      title: 'Sisu',
      render: row => {
        if (!row.challenge || row.challenge.active) return clickableToggleRead(row)
        return <>
          { clickableToggleRead(row) }
          <br/>
          <Popconfirm
            title={`Oled kindel, et tahad väljakutset aktsepteerida?`}
            onConfirm={() => acceptChallenge(row)}
            onCancel={() => message.success("Väljakutse aktsepteerimine peatatud")}
            okText="Jah"
            cancelText="Ei"
          >
          <Button type="primary" shape="round" size="small" style={{ marginRight: "5px", marginBottom: "5px" }}><CheckCircleTwoTone twoToneColor="#52c41a"/> nõustu</Button>
          </Popconfirm>

          <Popconfirm
            title={`Oled kindel, et tahad väljakutsest loobuda?`}
            onConfirm={() => deleteChallenge(row)}
            onCancel={() => message.success("Väljakutsest loobumine peatatud")}
            okText="Jah"
            cancelText="Ei"
          >
          <Button type="primary" shape="round" size="small"><StopTwoTone twoToneColor="red" /> loobu</Button>
          </Popconfirm>
        </>
      }
    },
    {
      title: 'Kuupäev',
      dataIndex: "createdAt",
      sortOrder: 'descend',
      sortDirections: ['ascend', 'descend'],
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: row => moment(row).format('Do MMMM, HH.mm')
    },
    {
      title: 'Märgi',
      responsive: ['md'],
      render: row => <button onClick={() => toggleNotificationRead(row)}> { !row.read ? "Loetuks" : "Mitte\u00ADloetuks" } </button>
    },
    {
      title: 'Kustuta',
      align: 'center',
      render: row => <button onClick={() => deleteNotification(row)}><DeleteTwoTone /></button>
    },
  ];

  const acceptChallenge = row => {
    services.acceptChallenge(row.challenge._id)
      .then(res => {
        message.success("Väljakutse aktsepteerimine õnnestus")
        dispatch(removeChallengeFromNotification({ id: row._id }));
        if (!row.read) toggleNotificationRead(row)
      })
      .catch(e => message.error("Viga väljakutse aktsepteerimisel"))
  }

  const deleteChallenge = (row) => {
    services.deleteChallenge(row.challenge._id)
      .then(res => {
        message.success("Väljakutse loobumine õnnestus")
        dispatch(removeChallengeFromNotification({ id: row._id }));
        if (!row.read) toggleNotificationRead(row)
      })
      .catch(e => message.error("Viga väljakutsest loobumisel"))
  }

  const deleteNotification = row => {
    services.deleteNotification(row._id)
      .then(res => {
        message.success(`Teade edukalt kustutatud`)
        dispatch(removeNotification({ id: row._id }))
      })
      .catch(e => message.error("Viga teate kustutamisel"))
  }

  const deleteAllNotification = () => {
    services.deleteAllNotification()
      .then(res => {
        message.success(`Kõik teated edukalt kustutatud`)
        dispatch(removeAllNotifications())
      })
      .catch(e => message.error("Viga kõikide teadete kustutamisel"))
  }

  const toggleNotificationRead = row => {
    services.updateNotification(row._id)
      .then(res => {
        dispatch(toggleNotification({ id: row._id }))
      })
      .catch(e => message.error("Viga loetuks/mitteloetuks märkimisel"))
  }

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ( 
    <>
      <div className="container">
        <h1>{ title }</h1>
        { data.length >= 1 &&
          <div style={{ display: "flex" }}>
            <Popconfirm
              icon={<QuestionOutlined style={{ color: 'red' }} />}
              title={`Oled kindel, et tahad kõik teated kustutada?`}
              onConfirm={() => deleteAllNotification()}
              onCancel={() => message.success('Tegevus peatatud')}
              okText="Jah"
              cancelText="Ei"
            >
              <button className="custom-button"><DeleteOutlined /> Kustuta kõik teated</button>
            </Popconfirm>
          </div>
        }
        <Table rowClassName={record => !record.read ? "unread" : null } pagination={false} loading={isLoading} locale={{ emptyText: "Teated puuduvad" }} columns={columns} rowKey='_id' dataSource={data}/>
      </div>
    </>
  ); 
}; 

Notifications.defaultProps = {
  title: "Teated",
}

export default Notifications; 
