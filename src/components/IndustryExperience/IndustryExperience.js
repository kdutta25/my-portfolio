import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Particle from "../Particle";
import { industryRoles } from "../../data/industryExperience";
import "./industry-experience.css";

function IndustryExperience() {
  const { t } = useTranslation();

  return (
    <Container fluid className="project-section industry-experience-page">
      <Particle />
      <Container>
        <h1 className="project-heading text-center">
          {t("industryExperience.titleLead")}{" "}
          <strong className="purple">{t("industryExperience.titleAccent")}</strong>
        </h1>
        <p className="industry-experience-lead text-center theme-body">
          {t("industryExperience.subtitle")}
        </p>

        <Row className="justify-content-center">
          <Col lg={10}>
            <ul className="industry-timeline" aria-label={t("industryExperience.titleFull")}>
              {industryRoles.map((job, idx) => (
                <li key={idx} className="industry-timeline-item">
                  <div className="industry-card">
                    {job.companyNote ? (
                      <p className="industry-company-tenure small">{job.companyNote}</p>
                    ) : null}
                    <h2 className="industry-job-title">{job.title}</h2>
                    <p className="industry-company purple">{job.company}</p>
                    <p className="industry-meta">
                      {job.period}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                    <ul className="industry-details">
                      {job.details.map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default IndustryExperience;
