import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FloatingLabel, Col, Row, Container } from "react-bootstrap";

function KomootData() {
  return (
    <Container>
      <Row>
        <Col />
        <Form>
          <FloatingLabel
            controlId="floatingInput"
            label="Komoot-Email"
            className="mb-3"
          >
            <Form.Control type="email" placeholder="name@example.com" />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Komoot-Password"
            className="mb-3"
          >
            <Form.Control type="password" placeholder="Password" />
          </FloatingLabel>

          <FloatingLabel
            className="mb-3"
            controlId="floatingInput"
            label="Komoot-ID"
          >
            <Form.Control type="text" placeholder="Komoot-ID" />
          </FloatingLabel>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Col />
        </Form>
      </Row>
    </Container>
  );
}

export default KomootData;
