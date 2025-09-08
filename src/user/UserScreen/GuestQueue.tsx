import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';

const GuestQueue = () => {
    const queueCode = "F2-b34D-xY";
    const peopleAhead = 3;
    const waitTime = 8;

    const handleCopy = () => {
        navigator.clipboard.writeText(queueCode);
        alert("대기 코드를 복사했습니다.");
    };

  return (
    <Container style={{ maxWidth: 480, minHeight: '100vh' }} className="d-flex flex-column justify-content-start align-items-center py-4">
        <div className="w-100 px-3">
            <Button variant="link" onClick={() => window.history.back()} className="px-0 mb-3">
            ← 동양미래대 축제부스
            </Button>

            <Card className="text-center p-4 shadow-sm border-0">
            <Card.Body>
                <div className="mb-2">
                <span role="img" aria-label="user">👥</span> 앞에 <strong>{peopleAhead}명</strong> 대기 중
                </div>
                <div className="text-muted mb-3">
                ⏱ 예상 대기 시간: <strong>{waitTime}분</strong>
                </div>

                <div className="progress mb-3" style={{ height: 6 }}>
                <div className="progress-bar bg-primary" style={{ width: `${Math.min((peopleAhead / 10) * 100, 100)}%` }}></div>
                </div>

                <div className="mb-2">나의 대기열 코드</div>
                <div
                className="border rounded py-2 px-3 mb-2"
                style={{ fontWeight: 'bold', letterSpacing: 1.2, backgroundColor: '#f5f5f5', cursor: 'pointer' }}
                onClick={handleCopy}
                >
                {queueCode}
                </div>
                <div className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>누르면 복사됩니다</div>

                <Row className="mb-2 gx-2">
                <Col>
                    <Button variant="secondary" className="w-100" disabled>
                    로그인 후 알림받기
                    </Button>
                </Col>
                <Col>
                    <Button variant="outline-secondary" className="w-100" disabled>
                    대기 취소
                    </Button>
                </Col>
                </Row>

                <Button variant="primary" className="w-100">
                대기 미루기
                </Button>
            </Card.Body>
            </Card>
        </div>
        </Container>
    );
};

export default GuestQueue;