import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Hyperledger from '../../Assets/Projects/Hyperledger.png'
import ComputedTomography from '../../Assets/Projects/ComputedTomography.png'
import WirelessSpybot from '../../Assets/Projects/WirelessSpybot.png'
import ieee1 from '../../Assets/Projects/IEEEPaper1.png'
import ieee2 from '../../Assets/Projects/IEEEPaper2.png'
import ijert from '../../Assets/Projects/IJERTPaper.png'


function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Projects </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Hyperledger}
              isBlog={false}
              title="Hyperledger Framework to Maintain Vehicular Depreciation and Ownership History"
              description="Smart Contract on Hyperledger N/W to track vehicle ownership and soft attach a depreciation index to the Vehicular Identification Number (VIN) to promote Automotive Security and Privacy.
              This whole project was designed so as to have a potential course with a deliverable assignments at uOttawa for future students."
              ghLink=""
              demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ComputedTomography}
              isBlog={false}
              title="Image Reconstruction from Projections and Analysis of Computed Tomography"
              description="The project was conceived by keeping the primary objective of Radon Transformation which was implemented by taking a random image to the workspace of MATLAB. We projected the particular image into 18, 36,90 and 180 number of projections one after the other. The projection was implemented by computing the image matrix into specified projected directions and obtained a 2-D line integral in a certain direction. Wavelet Toolbox was used in order to get a better version of the reconstructed image by removing the noise that was present on the reconstructed image obtained from Inverse Radon Transform.
              This technique of image reconstruction from projections and the use of Computed Tomography would benefit the medical industry by easy & simple analysis of cancerous tumors. "
              ghLink=""
              demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={WirelessSpybot}
              isBlog={false}
              title="Wireless Spybot"
              description="Generally security is a concern everywhere and thus this project was planned. A wireless robot was created that worked on the basic principle of ATMega-16 microcontroller and could be maneuvered by a custom wireless remote. The movement of the robot was controlled by seeing the live footage that was relayed to a laptop thereby achieving a mobile security that can add a layer of safety and protection in vulnerable areas.
               
              Transmitter Circuit (Remote):
              Micro-controller: ATMEGA 16
              Encoder IC: HT12E
              Power Supply: 7805 for constant 5V DC Supply
              Transmitter IC: TX 455   
              
              Receiver Circuit (On the robot):
              Decoder IC: HT12D
              Driver IC: L293D 
              Receiver IC: RX 455
              "
              ghLink=""
              demoLink=""              
            />
          </Col>

        </Row>
      </Container>
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Research Papers </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few papers I've published recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ieee1}
              isBlog={false}
              title="Impacts of Machine Learning and Artificial Intelligence on Mankind - IEEE Xplore - DOI: 10.1109/I2C2.2017.8321908 "
              description="
              With each passing day and gradually as we move into future, smart or intelligent machines will slowly replace and enhance human capabilities in many areas. 
              The intelligence exhibited by machines or softwares are often termed as “Artificial Intelligence” which is a subfleld of computer science.
              Artificial intelligence along with machine learning is now a potential game changer in the history of computing backed with strong data analytics.
              Study in this area of artificial intelligence has rapidly influenced the emergence of smart technologies that has a huge impact on our daily lives. 
              The field of science, engineering, business and medicine has become smarter with prediction capabilities to smoothen our lives in our daily activities.
              The areas employing artificial intelligence has seen an increase in the quality and efficiency which has been illustrated in this paper."
              ghLink="https://ieeexplore.ieee.org/document/8321908"
              demoLink=""
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ieee2}
              isBlog={false}
              title="Blockchain : The Perfect Data Protection tool IEEE Xplore - DOI: 10.1109/I2C2.2017.8321932 "
              description="
              It is a technology for decentralizing transaction and managing data. 
              Immense research and deep thinking has gone into conceptualizing blockchain since the time it was first showcased by Satoshi Nakamoto in 2008.
              The growing interest among researchers and technologists is the central attribute of blockchain that provides a high level of security, anonymity and data integrity without any intervention from third party who is in control of the transactions. Here in this study we have carried out through a well-defined study with the sole aim of collecting all relevant research areas and technologies on Blockchain Technology.
              With Blockchain becoming future in transactions in financial sector, it also comes with its own burden of risks.
              But since it has the potential to revolutionize the existing technology, it feels right to take the plunge."
              ghLink="https://ieeexplore.ieee.org/document/8321932"
              demoLink=""
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ijert}
              isBlog={false}
              title="Analysis of Channel Capacity using MIMO-OFDM for 4G Applications - IJERT - 2016 (Volume 4 - Issue 28)"
              description="To reach and connect people all around, unlike previous generations, 4G is a set of evolved network technologies which aim to provide dramatically fast data rates.
              This can be best achieved using Multiple Input Multiple Output (MIMO) Antenna system, as MIMO has the potential to enhance the system capacity of wireless communication.
              This paper focuses on increasing the channel capacity, reliability i.e., lowering the Bit Error Rate(BER) and improving the spectral efficiency for MIMO systems.
              Since the technology behind is Orthogonal Frequency Division Multiplexing (OFDM), the above advantages are achieved at a very low transmitted power in the entire system which makes it smart yet state of the art."
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
