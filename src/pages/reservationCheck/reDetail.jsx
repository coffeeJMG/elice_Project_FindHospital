import React, { useState } from "react";
import styled from "styled-components";
import { CardBox, Modal } from "../../components/index";
import IconPen from "../../assets/iconPen.svg";

export const ReDetail = ({ hospitalName, Memo }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [memoValue, setMemoValue] = useState("");

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleMemoChange = (event) => {
    setMemoValue(event.target.value);
  };

  return (
    <>
      <CardBox>
        <HospitalName>{hospitalName}</HospitalName>
        <MemoSection>
          <InputWrapper>
            <MemoInput
              placeholder="메모를 추가해보세요"
              value={Memo ? Memo : memoValue}
              onChange={handleMemoChange}
            />
            <ButtonWrapper onClick={openModal}>
              <img alt="icon-pen" src={IconPen} />
            </ButtonWrapper>
          </InputWrapper>
          <Modal
            isOpen={modalOpen}
            onClose={closeModal}
            title="메모"
            style={{ width: "60%" }}
          ></Modal>
        </MemoSection>
      </CardBox>
    </>
  );
};

const HospitalName = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #121212;
  border-bottom: 1px solid #b2b2b2;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const MemoSection = styled.div`
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MemoInput = styled.input`
  width: 90%;
  border: none;
`;

const ButtonWrapper = styled.button`
  width: 10%;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
