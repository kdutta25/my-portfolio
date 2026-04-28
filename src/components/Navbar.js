import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CgGitFork } from "react-icons/cg";
import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
} from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import { BsBriefcase } from "react-icons/bs";
import { useTheme, THEME_MODES } from "../context/ThemeContext";

function NavBar() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);

  const lang = (i18n.language || "en").split("-")[0];
  const safeTheme = THEME_MODES.includes(theme) ? theme : "dark";

  useEffect(() => {
    function scrollHandler() {
      if (window.scrollY >= 20) {
        updateNavbar(true);
      } else {
        updateNavbar(false);
      }
    }
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        <Navbar.Brand href="/" className="d-flex" />
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto align-items-md-center" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> {t("nav.home")}
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/about"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineUser style={{ marginBottom: "2px" }} /> {t("nav.about")}
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/industry-experience"
                onClick={() => updateExpanded(false)}
              >
                <BsBriefcase style={{ marginBottom: "2px" }} />{" "}
                {t("nav.industryExperience")}
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/project"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineFundProjectionScreen
                  style={{ marginBottom: "2px" }}
                />{" "}
                {t("nav.projects")}
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/resume"
                onClick={() => updateExpanded(false)}
              >
                <CgFileDocument style={{ marginBottom: "2px" }} />{" "}
                {t("nav.resume")}
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className="d-flex align-items-center ms-md-2 my-2 my-md-0">
              <Form.Select
                size="sm"
                aria-label={t("nav.language")}
                value={["en", "fr", "hi", "bn"].includes(lang) ? lang : "en"}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                }}
                className="portfolio-nav-select me-2"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="hi">हिन्दी</option>
                <option value="bn">বাংলা</option>
              </Form.Select>
            </Nav.Item>

            <Nav.Item className="d-flex align-items-center my-2 my-md-0">
              <Form.Select
                size="sm"
                aria-label={t("nav.theme")}
                value={safeTheme}
                onChange={(e) => setTheme(e.target.value)}
                className="portfolio-nav-select me-2"
              >
                <option value="dark">{t("nav.themeOptionDark")}</option>
                <option value="enhanced-dark">
                  {t("nav.themeOptionEnhanced")}
                </option>
              </Form.Select>
            </Nav.Item>

            <Nav.Item className="fork-btn">
              <Button
                href="https://github.com/kdutta25/my-portfolio.git"
                target="_blank"
                className="fork-btn-inner"
                rel="noreferrer"
              >
                <CgGitFork style={{ fontSize: "1.2em" }} />{" "}
                <AiFillStar style={{ fontSize: "1.1em" }} />
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
