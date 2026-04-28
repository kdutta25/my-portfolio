import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import { useTranslation } from "react-i18next";

function ProjectCards(props) {
  const { t } = useTranslation();
  const linkLabel = props.isBlog ? t("common.blog") : t("common.github");

  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>{props.description}</Card.Text>
        {props.ghLink ? (
          <Button variant="primary" href={props.ghLink} target="_blank" rel="noreferrer">
            <BsGithub /> &nbsp;
            {linkLabel}
          </Button>
        ) : null}
        {"\n"}
        {"\n"}

        {!props.isBlog && props.demoLink ? (
          <Button
            variant="primary"
            href={props.demoLink}
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: "10px" }}
          >
            <CgWebsite /> &nbsp;
            {t("common.demo")}
          </Button>
        ) : null}
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
