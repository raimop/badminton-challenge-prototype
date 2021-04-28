import React from "react";
import badmintonPhoto from "../welcome.jpg";
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
          <a
            href="https://unsplash.com/@xuanming?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            炫铭
          </a>{" "}
          <a
            href="https://unsplash.com/s/photos/badminton?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
          {" "}keskkonnast
        </p>
        <p className="attribution">
          <a
            href="https://www.freepik.com"
            title="Freepik"
            target="_blank"
            rel="noreferrer"
          >
            Freepik
          </a>{" "}
          <a
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noreferrer"
          >
            flaticon.com
          </a>
          {" "} keskkonnast
        </p>
      </main>
    </>
  );
};

export default Home;
