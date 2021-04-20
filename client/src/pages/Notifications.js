import React, { useEffect } from "react"; 
import { Table, message, Popconfirm, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getNotificationPending, getNotificationSuccess, getNotificationFail } from '../redux/notificationSlice';
import { CheckCircleTwoTone, StopTwoTone, DeleteTwoTone, QuestionOutlined, DeleteOutlined } from "@ant-design/icons"
import * as services from "../actions/services";
import moment from 'moment-timezone';
import "./Notifications.css"

const Notifications = ({ title }) => { 
  const notifications = useSelector(state => state.notifications);
  const data = notifications.data || [];
  const { isLoading } = notifications;
  const dispatch = useDispatch();

  const clickableToggleRead = row => <span style={{ cursor: "pointer" }} onClick={() => toggleNotificationRead(row, row.read)}>{row.content}</span>

  const columns = [
    {
      title: 'Sisu',
      render: row => clickableToggleRead(row)
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
      render: row => <button onClick={() => toggleNotificationRead(row, row.read)}> { !row.read ? "Loetuks" : "Mitte\u00ADloetuks" } </button>
    },
    {
      title: 'Kustuta',
      align: 'center',
      render: row => <button onClick={() => deleteNotification(row)}><DeleteTwoTone /></button>
    },
  ];

  const deleteNotification = row => {
    services.deleteNotification(row._id)
      .then(res => {
        message.success(`Teade edukalt kustutatud`)
        fetchNotifications();
      })
      .catch(e => message.error("Viga teate kustutamisel"))
  }

  const deleteAllNotification = () => {
    services.deleteAllNotification()
      .then(res => {
        message.success(`Kõik teated Edukalt kustutatud`)
        fetchNotifications();
      })
      .catch(e => message.error("Viga kõikide teadete kustutamisel"))
  }

  const toggleNotificationRead = row => {
    services.updateNotification(row._id)
      .then(res => fetchNotifications())
      .catch(e => message.error("Viga loetuks/mitteloetuks märkimisel"))
  }

  useEffect(() => {
    fetchNotifications();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotifications = () => {
    dispatch(getNotificationPending())
    services.fetchNotifications()
      .then(res => dispatch(getNotificationSuccess(res)))
      .catch(e => {
        dispatch(getNotificationFail("Viga teadete pärimisel"))
        message.error("Viga teadete pärimisel")
      })
  }

  return ( 
    <>
      <h1 className="text-center">{ title }</h1>
      <div className="container">
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
        <Table rowClassName={record => !record.read ? "unread" : null } loading={isLoading} locale={{ emptyText: "Teated puuduvad" }} pagination={false} columns={columns} rowKey='_id' dataSource={data}/>
      </div>
    </>
  ); 
}; 

Notifications.defaultProps = {
  title: "Teated",
}

export default Notifications; 
