import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Kaustubh Dutta </span>
            from <span className="purple"> Ottawa, Canada 🇨🇦</span>
            <br />
            <br />
            I am currently employed as a software developer at Nokia.
            <br />
            As a Software Engineer, I am truly fascinated by the way technology is evolving
            and a way that the human race is gradually moving towards achieving an infinite paradise of knowledge. 
            Be it the thirst to reach the un-reachable territories of the universe or developing a quintessential technology to 
            gradually get closer to the Sun or achieving a quantum computer in the planet itself is what I feel is the distinguishing character of human race that is indeed motivational and what sets us apart in this world.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Swimming 🏊🏻
            </li>
            <li className="about-activity">
              <ImPointRight /> Ping Pong 🏓
            </li>
            <li className="about-activity">
              <ImPointRight /> Photography 📷
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Negating all Negatives, that drives me forward everyday !!"{" "}
          </p>
          <footer className="blockquote-footer">Kaus</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
