import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { SiPostman, SiJenkins, SiJira } from "react-icons/si";

const TOOL_ITEMS = [
  { Icon: SiPostman, labelKey: "postman" },
  { Icon: SiJenkins, labelKey: "jenkins" },
  { Icon: SiJira, labelKey: "jira" },
];

function Toolstack() {
  const { t } = useTranslation();

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {TOOL_ITEMS.map(({ Icon, labelKey }) => (
        <Col
          key={labelKey}
          xs={4}
          md={2}
          className="d-flex justify-content-center mb-2 px-1"
        >
          <div className="tech-icons">
            <span className="tech-icon-graphic" aria-hidden>
              <Icon />
            </span>
            <span className="tech-icon-caption">
              {t(`about.toolLabels.${labelKey}`)}
            </span>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default Toolstack;
