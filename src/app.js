import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { players, genData } from "./data/gen";

import * as firebase from "firebase";
const db = firebase.initializeApp({
  apiKey: "AIzaSyBmdypyXBSh6_Pble2-3o8alfVogwi3yIs",
  authDomain: "sweltering-fire-733.firebaseapp.com",
  databaseURL: "https://sweltering-fire-733.firebaseio.com",
  projectId: "sweltering-fire-733",
  storageBucket: "sweltering-fire-733.appspot.com",
  messagingSenderId: "379353179305",
  appId: "1:379353179305:web:310d5276fa708858ff75b8"
});

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Dropdown,
  Badge
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";

const App = () => {
  const ref = firebase.database().ref("/picks");
  const [masterData, setMasterData] = useState(false);

  const reassign = (pickObj, newOwnerId) => {
    const [y, r, p] = pickObj.pick.split("-");
    const prevOwners = pickObj.prevOwners || [];

    prevOwners.unshift(pickObj.owner);

    firebase
      .database()
      .ref(`/picks/${y}/${r - 1}/picks/${p - 1}/owner/`)
      .set(newOwnerId);

    firebase
      .database()
      .ref(`/picks/${y}/${r - 1}/picks/${p - 1}/prevOwners/`)
      .set(prevOwners);
  };

  const getPlayerFromId = id => {
    return players.filter(p => {
      return p.id === id;
    });
  };

  const PickOwners = props => {
    return props.data.map((o, i) => {
      const pl = players.filter(p => {
        return p.id === o.owner;
      });
      const PrevOwners = props => {
        return props.owners.map((o, j) => {
          const player = getPlayerFromId(o);
          if (player.length > 0) {
            return (
              <Badge
                variant="secondary"
                key={`po-${player[0].name}-${new Date().getTime() - j}`}
              >
                {player[0].name}
              </Badge>
            );
          } else {
            return false;
          }
        });
      };
      const DropdownItems = () => {
        return players.map(p => {
          return (
            <Dropdown.Item
              key={p.id}
              onClick={() => {
                reassign(o, p.id);
              }}
            >
              {p.name}
            </Dropdown.Item>
          );
        });
      };
      return (
        <div key={i} style={{ margin: ".25rem", padding: ".25rem" }}>
          <div style={{ fontSize: "1.5rem" }}>{pl[0].name}</div>
          {o.prevOwners && (
            <div>
              <span style={{ display: "block" }}>From</span>{" "}
              <PrevOwners owners={o.prevOwners ? o.prevOwners : []} />
            </div>
          )}
          <Dropdown size="sm" style={{ marginTop: ".5rem" }}>
            <Dropdown.Toggle>Reassign</Dropdown.Toggle>
            <Dropdown.Menu>
              <DropdownItems />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    });
  };

  const Picks = props => {
    return props.data.map((draftYear, i) => {
      draftYear.picks.sort(function(a, b) {
        return a.owner - b.owner;
      });
      return (
        <div key={`draftYear-${i}`} style={{ marginTop: "1rem" }}>
          <h3>Round: {draftYear.round + 1}</h3>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <PickOwners data={draftYear.picks} />
          </div>
        </div>
      );
    });
  };

  const DraftYear = () => {
    const keys = Object.keys(masterData);

    return keys.map((y, i) => {
      return (
        <div key={`draftYear-${i}`} style={{ marginTop: "1rem" }}>
          <h2>{y}</h2>
          <hr></hr>
          <Picks data={masterData[y]} />
        </div>
      );
    });
  };

  useEffect(() => {
    ref.on("value", snapshot => {
      setMasterData(snapshot.val());
    });
  }, []);

  const reset = () => {
    ref.set(genData());
  };

  return (
    <Container fluid="md">
      <Button
        onClick={() => {
          reset();
        }}
      >
        Reset
      </Button>
      <Row>
        <Col>
          <h1>Draft picks</h1>
          {masterData && <DraftYear />}
        </Col>
      </Row>
    </Container>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
