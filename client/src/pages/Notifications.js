import React, { useEffect, useState } from "react";
import { Table, message, Popconfirm, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  toggleNotification,
  removeAllNotifications,
  removeNotification,
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
import * as services from "../actions/services";
import moment from "moment-timezone";
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
    services
      .acceptChallenge(row.challenge._id)
      .then((res) => {
        message.success("Väljakutse aktsepteerimine õnnestus");
        dispatch(removeChallengeFromNotification({ id: row._id }));
        if (!row.read) handleNotificationReadToggle(row);
      })
      .catch((e) => message.error("Viga väljakutse aktsepteerimisel"));
  };

  const handleChallengeDelete = (row) => {
    services
      .deleteChallenge(row.challenge._id)
      .then((res) => {
        message.success("Väljakutse loobumine õnnestus");
        dispatch(removeChallengeFromNotification({ id: row._id }));
        if (!row.read) handleNotificationReadToggle(row);
      })
      .catch((e) => message.error("Viga väljakutsest loobumisel"));
  };

  const handleNotificationDelete = (row) => {
    services
      .deleteNotification(row._id)
      .then((res) => {
        message.success(`Teade edukalt kustutatud`);
        dispatch(removeNotification({ id: row._id }));
      })
      .catch((e) => message.error("Viga teate kustutamisel"));
  };
  const handleNotificationsMarkAllAsRead = () => {
    services
      .markAllNotificationsRead()
      .then((res) => {
        message.success(`Kõik teated on märgitud loetuks`);
        dispatch(markAllNotificationsRead());
      })
      .catch((e) => message.error("Viga teate kustutamisel"));
  };

  const handleNotificationDeleteAll = () => {
    services
      .deleteAllNotification()
      .then((res) => {
        message.success(`Kõik teated edukalt kustutatud`);
        dispatch(removeAllNotifications());
      })
      .catch((e) => message.error("Viga kõikide teadete kustutamisel"));
  };

  const handleNotificationReadToggle = (row) => {
    services
      .updateNotification(row._id)
      .then((res) => {
        dispatch(toggleNotification({ id: row._id }));
      })
      .catch((e) => message.error("Viga loetuks/mitteloetuks märkimisel"));
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
            <Popconfirm
              icon={<QuestionOutlined style={{ color: "red" }} />}
              title={`Oled kindel, et tahad kõik teated kustutada?`}
              onConfirm={() => handleNotificationDeleteAll()}
              onCancel={() => message.success("Tegevus peatatud")}
              okText="Jah"
              cancelText="Ei"
            >
              <button className="custom-button">
                <DeleteOutlined /> Kustuta kõik teated
              </button>
            </Popconfirm>
            <button
              className="custom-button"
              style={{ marginLeft: "5px" }}
              onClick={handleNotificationsMarkAllAsRead}
            >
              <CheckCircleFilled /> Märgi kõik loetuks
            </button>
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
