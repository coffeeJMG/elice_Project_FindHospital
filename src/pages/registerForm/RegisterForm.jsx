import React, { useState } from "react";
import styled from "styled-components";
import { Post } from "./Post";
import { Button } from "../../components";
import colors from "../../constants/colors";
import mainLogo from "../../assets/mainLogo.svg";
import { SelectBox } from "./SelectBox";

export const RegisterForm = () => {
  const [dutyName, setDutyName] = useState(""); // 병원명 인풋 관리
  const [phone, setPhone] = useState(""); //

  const handleNameInput = (e) => {
    const value = e.target.value;
    setDutyName(value); // 병원명 값 저장
  };

  const handlePhone = (e) => {
    const value = e.target.value;
    setPhone(value);
  };
  const phoneRegex = /^01[0-9]{1}-[0-9]{4}-[0-9]{4}$/;
  // const phoneValid = phoneRegex.test(phone) ? true : false;

  const onClick = () => {
    console.log(dutyName);
    console.log(phone);
  };
  return (
    <>
      <MainLogoDiv>
        <MainLogoImg src={mainLogo}></MainLogoImg>
        <H1>병원 신규 등록</H1>
      </MainLogoDiv>
      <FormBox>
        <InputBox>
          <InputName>병원명</InputName>
          <InputContent type="text" onChange={handleNameInput} />
        </InputBox>
        <InputBox>
          <InputName>병원 대표번호</InputName>
          <InputContent type="text" onChange={handlePhone} />
        </InputBox>
        <InputBox>
          <InputName>영업시간 및 점심시간</InputName>
          <SelectBox />
        </InputBox>

        <Post />
        <InputBox>
          <InputName>병원 사진</InputName>
          <ImageBox>
            <InputImage type="file" />
          </ImageBox>
        </InputBox>
        <InputBox>
          <Button
            label={"신규 등록하기"}
            width={"100%"}
            height={"35%"}
            btnColor={"#ffffff"}
            bgcolor={colors.primary}
            btnFontSize={"18px"}
            onClick={onClick}
          />
        </InputBox>
      </FormBox>
    </>
  );
};

const MainLogoDiv = styled.div`
  margin-top: 4%;
`;

const MainLogoImg = styled.img`
  padding: 3% 3% 0 3%;
`;

const H1 = styled.p`
  font-size: 38px;
  margin: 0;
  padding: 2%;
  color: #00ad5c;
  font-weight: 700;
`;

const FormBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #a8a8a8;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2%;
`;

export const InputBox = styled.div`
  box-sizing: border-box;
  width: 60%;
  margin: 2% 0;
  display: flex;
  flex-direction: column;
`;

export const InputName = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  justify-content: flex-start;
  color: #121212;
`;

export const InputContent = styled.input`
  width: 100%;
  box-sizing: border-box;
  height: 35%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border: 1px solid #a8a8a8;
  border-radius: 5px;

  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 15px;
`;

const ImageBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  border: 1px solid #a8a8a8;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 10px;
`;

const InputImage = styled.input`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 15px;
`;
