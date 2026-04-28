import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { useTranslation } from "react-i18next";

function AboutCard() {
  const { t } = useTranslation();
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            {t("aboutCard.p1")}
            <br />
            <br />
            {t("aboutCard.p2")}
            <br />
            <br />
            {t("aboutCard.p3")}
            <br />
            <br />
            {t("aboutCard.activities")}
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> {t("aboutCard.swim")}
            </li>
            <li className="about-activity">
              <ImPointRight /> {t("aboutCard.pingpong")}
            </li>
            <li className="about-activity">
              <ImPointRight /> {t("aboutCard.photo")}
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>{t("aboutCard.quote")}</p>
          <footer className="blockquote-footer">{t("aboutCard.quoteBy")}</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
