import React, { useEffect, useState } from "react";
import { Table, message, Popconfirm, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  toggleNotificationRead,
  deleteAllNotification,
  deleteNotification,
  acceptChallengeFromNotification,
  removeChallengeFromNotification,
  markAllNotificationsRead,
} from "../redux/notificationSlice";
import {
  CheckCircleTwoTone,
  StopTwoTone,
  DeleteTwoTone,
  QuestionOutlined,
  DeleteOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import moment from "moment";
import { CustomButton } from "../components/CustomButton";
import { unwrapResult } from '@reduxjs/toolkit'
import "./Notifications.css";

const Notifications = ({ title }) => {
  const notifications = useSelector((state) => state.notifications);
  const [data, setData] = useState(notifications.data || []);
  const { isLoading } = notifications;
  const dispatch = useDispatch();

  useEffect(() => {
    setData(notifications.data);
  }, [notifications]);

  const clickableToggleRead = (row) => (
    <span
      style={{ cursor: "pointer" }}
      onClick={() => handleNotificationReadToggle(row)}
    >
      {row.content}
    </span>
  );

  const columns = [
    {
      title: "Sisu",
      render: (row) => {
        if (!row.challenge || row.challenge.active)
          return clickableToggleRead(row);
        return (
          <>
            {clickableToggleRead(row)}
            <br />
            <Popconfirm
              title={`Oled kindel, et tahad väljakutset aktsepteerida?`}
              onConfirm={() => handleChallengeAccept(row)}
              onCancel={() =>
                message.success("Väljakutse aktsepteerimine peatatud")
              }
              okText="Jah"
              cancelText="Ei"
            >
              <Button
                type="primary"
                shape="round"
                size="small"
                style={{ marginRight: "5px", marginBottom: "5px" }}
              >
                <CheckCircleTwoTone twoToneColor="#52c41a" /> nõustu
              </Button>
            </Popconfirm>

            <Popconfirm
              title={`Oled kindel, et tahad väljakutsest loobuda?`}
              onConfirm={() => handleChallengeDelete(row)}
              onCancel={() =>
                message.success("Väljakutsest loobumine peatatud")
              }
              okText="Jah"
              cancelText="Ei"
            >
              <Button type="primary" shape="round" size="small">
                <StopTwoTone twoToneColor="red" /> loobu
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
    {
      title: "Kuupäev",
      dataIndex: "createdAt",
      sortOrder: "descend",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (row) => moment(row).format("Do MMMM, HH.mm"),
    },
    {
      title: "Märgi",
      responsive: ["md"],
      render: (row) => (
        <button onClick={() => handleNotificationReadToggle(row)}>
          {" "}
          {!row.read ? "Loetuks" : "Mitte\u00ADloetuks"}{" "}
        </button>
      ),
    },
    {
      title: "Kustuta",
      align: "center",
      render: (row) => (
        <button onClick={() => handleNotificationDelete(row)}>
          <DeleteTwoTone />
        </button>
      ),
    },
  ];

  const handleChallengeAccept = (row) => {
    dispatch(acceptChallengeFromNotification(row.challenge._id))
      .then(unwrapResult)
      .then(res => {
        if (!row.read) handleNotificationReadToggle(row);
        message.success("Väljakutses aktsepteerimine õnnestus")
      })
      .catch(error => {
        message.error("Väljakutse aktsepteerimisel esines viga")
      })
  };

  const handleChallengeDelete = (row) => {
    dispatch(removeChallengeFromNotification(row.challenge._id))
      .then(unwrapResult)
      .then(res => {
        message.success("Väljakutsest loobumine õnnestus")
      })
      .catch(error => {
        message.error("Väljakutse loobumisel esines viga")
      })
  };

  const handleNotificationDelete = ({ _id }) => {
    dispatch(deleteNotification(_id))
      .then(unwrapResult)
      .then(res => {
        message.success("Väljakutse edukalt kustutatud")
      })
      .catch(error => {
        message.error("Väljakutse kustutamise esines viga")
      })
  };
  const handleNotificationsMarkAllAsRead = () => {
    dispatch(markAllNotificationsRead())
      .then(unwrapResult)
      .then(res => {
        message.success("Väljakutsed edukalt märgitud loetuks")
      })
      .catch(error => {
        message.error("Väljakutsete märkimisel loetuks esines viga")
      })
  };

  const handleNotificationDeleteAll = () => {
    dispatch(deleteAllNotification())
      .then(unwrapResult)
      .then(res => {
        message.success("Väljakutsed edukalt kustutatud")
      })
      .catch(error => {
        message.error("Väljakutsete kustutamisel esines viga")
      })
  };

  const handleNotificationReadToggle = ({ _id }) => {
    dispatch(toggleNotificationRead(_id))
      .then(unwrapResult)
      .then(res => {
        message.success("Teade märgitud edukalt loetuks")
      })
      .catch(error => {
        message.error("Teate märkimisel loetuks esines viga")
      })
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);

  return (
    <>
      <div className="container">
        <h1>{title}</h1>
        {data.length >= 1 && (
          <div style={{ display: "flex" }}>
            <CustomButton
              icon={<CheckCircleFilled />}
              onClick={handleNotificationsMarkAllAsRead}
            >
              Märgi kõik loetuks
            </CustomButton>
            <Popconfirm
              icon={<QuestionOutlined style={{ color: "red" }} />}
              title={`Oled kindel, et tahad kõik teated kustutada?`}
              onConfirm={() => handleNotificationDeleteAll()}
              onCancel={() => message.success("Tegevus peatatud")}
              okText="Jah"
              cancelText="Ei"
            >
              <CustomButton
                icon={<DeleteOutlined />}
                onClick={handleNotificationDeleteAll}
                style={{ marginLeft: "5px" }}
              >
                Kustuta kõik teated
              </CustomButton>
            </Popconfirm>
          </div>
        )}
        <Table
          rowClassName={(record) => (!record.read ? "unread" : null)}
          pagination={false}
          loading={isLoading}
          locale={{ emptyText: "Teated puuduvad" }}
          columns={columns}
          rowKey="_id"
          dataSource={data}
        />
      </div>
    </>
  );
};

Notifications.defaultProps = {
  title: "Teated",
};

export default Notifications;
