import React from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CgCPlusPlus, CgDisplayFlex } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import { SiMysql, SiTypescript } from "react-icons/si";

const SKILL_ITEMS = [
  { Icon: DiJavascript1, labelKey: "javascript" },
  { Icon: CgCPlusPlus, labelKey: "cpp" },
  { Icon: SiTypescript, labelKey: "typescript" },
  { Icon: DiNodejs, labelKey: "nodejs" },
  { Icon: DiReact, labelKey: "react" },
  { Icon: CgDisplayFlex, labelKey: "htmlCss" },
  { Icon: DiMongodb, labelKey: "mongodb" },
  { Icon: DiGit, labelKey: "git" },
  { Icon: SiMysql, labelKey: "mysql" },
  { Icon: DiPython, labelKey: "python" },
  { Icon: DiJava, labelKey: "java" },
];

function Techstack() {
  const { t } = useTranslation();

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {SKILL_ITEMS.map(({ Icon, labelKey }) => (
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
              {t(`about.skillLabels.${labelKey}`)}
            </span>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;
