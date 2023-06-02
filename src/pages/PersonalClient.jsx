import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchList } from "../server/Fetcher";

export const PersonalClient = () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZpcnN0QHRlc3QuZ29vZCIsInN1YiI6IjY0NzdlOTk2YTkwZTQwOWYxYTQ4NzIyMSIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE2ODU1ODA0MTQsImV4cCI6MTcxNzEzODAxNH0.cWYJrF8kSJrmC4csSlR2x5B4v_ASZhinvKl5NFoShGc";
  const { isLoading, data } = useQuery("data", () => fetchList(token));

  if (!data) return console.log(data);
  if (isLoading) return <h1>로딩중입니다..</h1>;
  return (
    <>
      <PersonalTitle>개인 클라이언트 관리</PersonalTitle>
      <InfoBox>
        <Checkbox type="checkbox" />
        <InfoTab>가입날짜</InfoTab>
        <InfoTab>이름</InfoTab>
        <InfoTab>아이디</InfoTab>
        <InfoTab>연락처</InfoTab>
        <div></div>
      </InfoBox>
    </>
  );
};

export const PersonalTitle = styled.p`
  padding-top: 134px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 900;
  font-size: 42px;
  line-height: 51px;
`;

export const InfoBox = styled.div`
  margin-top: 50px;
  border: 1px red solid;
  border-left: none;
  border-right: none;
  border-top: 3px solid;
  border-bottom: 1px solid #929292;
  width: 1257px;
  height: 81px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Checkbox = styled.input``;
export const InfoTab = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
`;