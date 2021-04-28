import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Tooltip, Divider, message } from "antd";
import { useHistory } from "react-router-dom";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  EditTwoTone,
  DeleteTwoTone,
  StopTwoTone,
  IssuesCloseOutlined,
} from "@ant-design/icons";
import * as services from "../../actions/services";
import moment from "moment";
import { updateChallenges, removeChallenge } from "../../redux/challengeSlice";
import { CustomButton } from "../../components/CustomButton";

const Challenges = () => {
  const user = useSelector((state) => state.auth.user);
  const challenges = useSelector((state) => state.challenge);
  const { isLoading } = challenges;
  const data = challenges.data || { unconfirmed: [], rest: [] };
  const history = useHistory();
  const dispatch = useDispatch();

  const helpers = {
    score: (match) => {
      let ar = match.map((e) => e.join("-")).join(" | ");
      if (ar === "0-0 | 0-0 | 0-0" || ar === "0-0 | 0-0") return "Kinnitamata";
      return ar;
    },
    submitResult: (row) => (
      <Tooltip title="Esita tulemus">
        <button onClick={() => submitResult(row)}>
          <EditTwoTone />
        </button>
      </Tooltip>
    ),
    waitForResult: () => (
      <Tooltip title="Oota vastase esitamist">
        <ClockCircleTwoTone />
      </Tooltip>
    ),
    resultConfirmed: () => (
      <Tooltip title="Tulemus on kinnitatud">
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </Tooltip>
    ),
    deleteChallenge: (row) => (
      <Tooltip title="Kustuta väljakutse">
        <button onClick={() => deleteChallengeRow(row)}>
          <DeleteTwoTone />
        </button>
      </Tooltip>
    ),
    cannotDeleteChallenge: () => (
      <Tooltip title="Väljakutset ei saa kustutada">
        <StopTwoTone twoToneColor="red" />
      </Tooltip>
    ),
    dateHasNotPassed: () => (
      <Tooltip title="Väljakutse kuupäev pole möödunud">
        <IssuesCloseOutlined />
      </Tooltip>
    ),
  };

  const columns = [
    {
      title: "Vastane",
      render: (row) => {
        return user._id === row.challenger.user._id
          ? `${row.challenged.user.firstName} ${row.challenged.user.lastName}`
          : `${row.challenger.user.firstName} ${row.challenger.user.lastName}`;
      },
    },
    {
      title: "Tulemus",
      dataIndex: "result",
      render: (field, row) => {
        if (!row.challenger.resultAccepted || !row.challenged.resultAccepted)
          return "Kinnitamata";
        if (row.winner._id !== user._id) {
          let arr = [];
          for (let i = 0; i < field.length; i++) {
            arr.push([field[i][1], field[i][0]]);
          }
          return helpers.score(arr);
        }
        return helpers.score(field);
      },
    },
    {
      title: "Aeg",
      dataIndex: ["info", "datetime"],
      responsive: ["md"],
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) =>
        moment(a.info.datetime).unix() - moment(b.info.datetime).unix(),
      render: (row) => moment(row).format("DD MMMM, HH.mm"),
    },
    {
      title: "Koht",
      dataIndex: ["info", "address"],
      responsive: ["md"],
    },
    {
      title: "Tulemus",
      width: "5%",
      align: "center",
      render: (row) => {
        //if (moment(row.info.datetime).diff(moment()) >= 0) return helpers.dateHasNotPassed()
        if (row.challenger.resultAccepted && row.challenged.resultAccepted)
          return helpers.resultConfirmed();
        if (user._id === row.challenger.user._id) {
          if (!row.challenger.resultAccepted) return helpers.submitResult(row);
          if (!row.challenged.resultAccepted) return helpers.waitForResult();
        } else {
          if (!row.challenged.resultAccepted) return helpers.submitResult(row);
          if (!row.challenger.resultAccepted) return helpers.waitForResult();
        }
        return helpers.submitResult(row);
      },
    },
    {
      title: "Kustuta",
      width: "5%",
      align: "center",
      render: (row) =>
        moment(row.info.datetime).diff(moment(), "minutes") >= 1440 &&
        !(row.challenger.resultAccepted || row.challenged.resultAccepted)
          ? helpers.deleteChallenge(row)
          : helpers.cannotDeleteChallenge(),
    },
  ];

  const secondColumns = columns.slice(0,columns.length-1)

  const submitResult = (row) => history.push(`/challenges/update/${row._id}`);

  useEffect(() => {
    dispatch(updateChallenges());
  }, []);

  const deleteChallengeRow = ({ _id }) => {
    services
      .deleteChallenge(_id)
      .then((res) => {
        message.success("Väljakutse kustutamine õnnestus");
        dispatch(removeChallenge({ id: _id }));
      })
      .catch((e) => message.error("Viga väljakutse kustutamisel"));
  };

  return (
    <>
      <div className="container">
        <h1>Väljakutsed</h1>
        <CustomButton onClick={() => history.push(`/ranking`)}>
          Esita uus väljakutse
        </CustomButton>
        <Table
          title={() => "Kinnitama väljakutsed"}
          loading={isLoading}
          locale={{ emptyText: "Kinnitamata väljakutsed puuduvad" }}
          columns={columns}
          rowKey="_id"
          pagination={false}
          dataSource={data.unconfirmed}
        />
        <Divider />
        <Table
          title={() => "Kinnitatud väljakutsed"}
          rowClassName={(rec) =>
            rec.winner !== null &&
            rec.challenger.resultAccepted &&
            rec.challenged.resultAccepted
              ? rec.winner._id === user._id
                ? "won-match"
                : "lost-match"
              : null
          }
          loading={isLoading}
          locale={{ emptyText: "Väljakutsed puuduvad" }}
          columns={secondColumns}
          rowKey="_id"
          pagination={false}
          dataSource={data.rest}
        />
      </div>
    </>
  );
};

export default Challenges;
