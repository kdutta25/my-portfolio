import React, { useState, useEffect, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Particle from "../Particle";
import pdf from "../../Assets/../Assets/Kaustubh_Dutta_Resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslation } from "react-i18next";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const { t } = useTranslation();
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const scale = width > 786 ? 1.7 : 0.6;

  const onDocumentLoadSuccess = useCallback((loaded) => {
    setNumPages(loaded.numPages);
    setPageNumber(1);
  }, []);

  const goToPrev = () => {
    setPageNumber((p) => Math.max(1, p - 1));
  };

  const goToNext = () => {
    setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p + 1));
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row className="resume">
          <Document
            file={pdf}
            onLoadSuccess={onDocumentLoadSuccess}
            className="d-flex justify-content-center flex-column align-items-center"
          >
            <Page
              key={pageNumber}
              pageNumber={pageNumber}
              scale={scale}
            />
          </Document>
        </Row>

        <Row
          className="justify-content-center flex-column align-items-center gap-3"
          style={{ paddingTop: 8, paddingBottom: 40 }}
        >
          {numPages != null && numPages > 0 && (
            <div className="resume-pdf-pagination d-flex flex-wrap align-items-center justify-content-center gap-2">
              <ButtonGroup>
                <Button
                  type="button"
                  variant="outline-light"
                  onClick={goToPrev}
                  disabled={pageNumber <= 1}
                  aria-label={t("resume.prevPage")}
                >
                  <BsChevronLeft size={18} />
                  <span className="d-none d-sm-inline">&nbsp;{t("resume.prev")}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline-light"
                  onClick={goToNext}
                  disabled={!numPages || pageNumber >= numPages}
                  aria-label={t("resume.nextPage")}
                >
                  <span className="d-none d-sm-inline">{t("resume.next")}&nbsp;</span>
                  <BsChevronRight size={18} />
                </Button>
              </ButtonGroup>
              <span className="text-nowrap resume-pdf-page-label">
                {t("resume.pageOf", { current: pageNumber, total: numPages })}
              </span>
            </div>
          )}
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            rel="noreferrer"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;{t("resume.download")}
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
