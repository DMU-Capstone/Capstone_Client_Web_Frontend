import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import GuestService, { getQueueDetail } from '../Service/GuestService';
import axios from 'axios';
import { data } from 'react-router-dom';

interface ActiveQueue {
  id: number;
  name: string;
  count: number;
};

type FormData = {
  phoneNumber: string;
  name: string;
  peopleCount: number;
};

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^010-\d{4}-\d{4}$/, '휴대폰 번호 형식이 올바르지 않습니다.')
    .required('휴대폰 번호는 필수입니다.'),
  name: yup.string().required('대표자 이름은 필수입니다.'),
  peopleCount: yup
    .number()
    .typeError('인원수는 숫자여야 합니다.')
    .min(1, '최소 1명 이상이어야 합니다.')
    .required('인원수는 필수입니다.'),
});
/*
const handleQueueSubmit = async (formData: { phoneNumber: string; name: string; peopleCount: number }) => {
  try {
    const response = await GuestService.joinQueue('123', {
      phoneNumber: formData.phoneNumber,
      name: formData.name,
      count: formData.peopleCount,
    });
    console.log('✅ 대기열 등록 성공:', response);
  } catch (err) {
    console.error('❌ 대기열 등록 실패:', err);
  }
};
*/
export default function QueueRegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  //활성화 큐 임시코드
  const [activeHosts, setActiveHosts] = useState<ActiveQueue[]>([]);
  const [activeHostId, setActiveHostId] = useState<number | null>(null);
  useEffect(() => {
      const fetchActiveHosts = async () => {
        try {
          const { getActiveQueues } = GuestService;
          const activeList = await getActiveQueues();
          const result: ActiveQueue[] = [];

          for (const queue of activeList) {
            const details = await getQueueDetail(queue.id);
            const total = details.reduce((sum: number, item: { count: number }) => sum + item.count, 0);
            result.push({ id: queue.id, name: queue.name, count: total });
          }

          setActiveHosts(result);
          if (result.length > 0) {
            setActiveHostId(result[0].id);
          } else {
            setActiveHostId(null);
            alert('현재 활성화된 대기열이 없습니다.');
          }
        } catch (err) {
          console.error('활성 큐 목록 불러오기 실패', err);
        }
      };
      fetchActiveHosts();
    }, []);

  const onSubmit = async (formData: FormData) => {
    if (!activeHostId) {
      alert("현재 등록 가능한 대기열이 없습니다.");
      return;
    }
    try {
      const response = await GuestService.joinQueue(String(activeHostId), {
        phoneNumber: formData.phoneNumber,
        name: formData.name,
        count: formData.peopleCount,
      });
      console.log('전송할 데이터:', response);
      alert(`대기열 등록 완료! 대기코드: ${response.index}`);

      const details = await getQueueDetail(activeHostId);
      const updatedCount = details.reduce((sum, item) => sum + item.count, 0);
      setActiveHosts(prev =>
        prev.map(q =>
          q.id === activeHostId ? { ...q, count: updatedCount } : q
        )
      );
    } catch (err) {
      console.log('대기열 등록 실패:', err);
      alert('대기열 등록에 실패했습니다.');
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', maxWidth: 480 }}>
      <div className="w-100 px-3">
        <Button variant="link" className="mb-3 px-0" onClick={() => window.history.back()}>
          ←
        </Button>
        <h5 className="fw-bold mb-4">대기열에 등록하기 위한 정보를 입력해주세요.</h5>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>참여할 대기열 선택</Form.Label>
            <Form.Select 
              onChange={(e) => setActiveHostId(Number(e.target.value))} 
              disabled={activeHosts.length === 0}
              value={activeHostId ?? ''}
            >
              {activeHosts.length === 0 ? (
                <option disabled value="">현재 활성화된 대기열이 없습니다</option>
              ) : (
                activeHosts.map((host) => (
                  <option key={host.id} value={host.id}>{host.name} (대기 {host.count}명)</option>
                ))
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>휴대폰 번호</Form.Label>
            <Form.Control type="text" placeholder="010-1111-1111" {...register('phoneNumber')} />
            <Form.Text className="text-danger">{errors.phoneNumber?.message}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>대표자 이름</Form.Label>
            <Form.Control type="text" placeholder="홍길동" {...register('name')} />
            <Form.Text className="text-danger">{errors.name?.message}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>인원수</Form.Label>
            <Form.Control type="number" placeholder="1" {...register('peopleCount')} />
            <Form.Text className="text-danger">{errors.peopleCount?.message}</Form.Text>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={!activeHostId || activeHosts.length === 0}>
            확인
          </Button>
        </Form>
        
      </div>
    </Container>
  );
}