import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Hyperledger from "../../Assets/Projects/Hyperledger.png";
import ComputedTomography from "../../Assets/Projects/ComputedTomography.png";
import WirelessSpybot from "../../Assets/Projects/WirelessSpybot.png";
import ieee1 from "../../Assets/Projects/IEEEPaper1.png";
import ieee2 from "../../Assets/Projects/IEEEPaper2.png";
import ijert from "../../Assets/Projects/IJERTPaper.png";

function Projects() {
  const { t } = useTranslation();

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          {t("projects.sectionLead")}{" "}
          <strong className="purple">{t("projects.sectionHighlight")} </strong>
        </h1>
        <p className="theme-body">{t("projects.sectionSub")}</p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Hyperledger}
              isBlog={false}
              title={t("projects.items.hyperledger.title")}
              description={t("projects.items.hyperledger.description")}
              ghLink=""
              demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ComputedTomography}
              isBlog={false}
              title={t("projects.items.tomography.title")}
              description={t("projects.items.tomography.description")}
              ghLink=""
              demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={WirelessSpybot}
              isBlog={false}
              title={t("projects.items.spybot.title")}
              description={t("projects.items.spybot.description")}
              ghLink=""
              demoLink=""
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <h1 className="project-heading">
          {t("projects.papersLead")}{" "}
          <strong className="purple">{t("projects.papersHighlight")} </strong>
        </h1>
        <p className="theme-body">{t("projects.papersSub")}</p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ieee1}
              isBlog={false}
              title={t("projects.items.paper1.title")}
              description={t("projects.items.paper1.description")}
              ghLink="https://ieeexplore.ieee.org/document/8321908"
              demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ieee2}
              isBlog={false}
              title={t("projects.items.paper2.title")}
              description={t("projects.items.paper2.description")}
              ghLink="https://ieeexplore.ieee.org/document/8321932"
              demoLink=""
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ijert}
              isBlog={false}
              title={t("projects.items.paper3.title")}
              description={t("projects.items.paper3.description")}
              ghLink="https://www.ijert.org/analysis-of-channel-capacity-using-mimo-ofdm-for-4g-applications"
              demoLink=""
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
