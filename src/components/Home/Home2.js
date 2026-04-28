import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  const { t } = useTranslation();
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <div className="home-about-body home2-intro">
              <p style={{ textAlign: "justify" }}>{t("home2.openingParagraph")}</p>
              <p className="home2-subhead mt-4 mb-2">
                <strong className="purple">{t("home2.keyInterestsLabel")}</strong>
              </p>
              <p>{t("home2.keyInterests")}</p>
              <p className="home2-subhead mt-4 mb-2">
                <strong className="purple">{t("home2.mottoLabel")}</strong>
              </p>
              <p className="home2-motto">{t("home2.motto")}</p>
            </div>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>{t("home2.findMe")}</h1>
            <p>{t("home2.connect")}</p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/kdutta25"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://twitter.com/KaustubhDutta"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineTwitter />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/kaustubh-dutta/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/kausklicks/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
