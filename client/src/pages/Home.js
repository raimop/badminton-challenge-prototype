import React from "react";
import { CustomButton } from "../components/CustomButton";
import badmintonPhoto from "../welcome.jpg";
import { CheckCircleFilled } from "@ant-design/icons";
import "./Home.css";

const Home = () => {
  return (
    <>
      <main className="container">
        <h1>Sulgpalli väljakutsete rakendus</h1>
        <p>
          Selleks, et esitada väljakutse, on vaja registreerida ja liituda
          edetabeliga
        </p>
        <p>Prototüüp valminud bakalaureusetöö raames TLÜ 2021</p>
        <img src={badmintonPhoto} className="welcome--photo" alt="Badminton" />
        <p className="attribution text-center">
          Pildi on teinud{" "}
          <a
            href="https://unsplash.com/@xuanming?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            炫铭
          </a>{" "}
          ja saadud aadressilt{" "}
          <a
            href="https://unsplash.com/s/photos/badminton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </p>
        <p className="attribution">
          Logo on teinud{" "}
          <a
            href="https://www.freepik.com"
            title="Freepik"
            target="_blank"
            rel="noreferrer"
          >
            Freepik
          </a>{" "}
          ja saadud aadressit{" "}
          <a
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noreferrer"
          >
            flaticon.com
          </a>
        </p>
      </main>
    </>
  );
};

export default Home;
