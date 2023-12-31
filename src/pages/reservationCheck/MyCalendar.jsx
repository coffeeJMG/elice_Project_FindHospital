import React, { useState, useEffect } from "react";
import axios from "axios";
// 공통 컴포넌트
import { Container, CardBox } from "../../components/index";
// 아이콘
import IconLeft from "../../assets/iconLeftGreen.svg";
import IconRight from "../../assets/iconRightGreen.svg";
import MiniChk from "../../assets/miniLogo4.svg";

import dayjs from "dayjs";
import Calendar from "react-calendar";
import { ReDetail } from "./reDetail";
// css
import styled from "styled-components";
//utils
import { BE_URL, getUserToken, endpoint_reserve } from "../../utils.js";

export const MyCalendar = () => {
  const curDate = new Date(); // 현재 날짜
  const [value, onChange] = useState(curDate); // 클릭한 날짜 - 초기값 현재 날짜
  const activeDate = dayjs(value); // 클릭한 날짜 (dayjs 객체로 변경)
  const activeDateString = activeDate.format("YY.MM.DD"); // 클릭한 날짜 (년-월-일)
  const activeMonth = dayjs(value).format("M월");

  const [datesOnly, setDatesOnly] = useState([]); //날짜만 추출
  const [extractedData, setExtractedData] = useState([]); //예약 정보만 추출

  const [showTooltip, setShowTooltip] = useState(false); // 툴팁 표시 여부 상태를 추가

  const userToken = getUserToken();

  useEffect(() => {
    axios
      .get(`${BE_URL}${endpoint_reserve}user`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        // 추출된 정보들을 저장할 배열
        const resData = res.data.data;
        // hospital의 dutyName, reservedDate, reservedTime, memo만 추출한 배열
        const extractedData = resData.map((item) => ({
          id: item.id,
          date: dayjs(item.reservedDate, "YYYYMMDD").format("YYYY-MM-DD"),
          dutyName: item.hospital.dutyName,
          reservedTime: item.reservedTime,
          memo: item.memo,
        }));

        // 날짜와 시간에 따라 extractedData 배열 정렬
        extractedData.sort((a, b) => {
          // 날짜를 먼저 비교
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;

          // 날짜가 동일한 경우 시간을 비교
          if (a.reservedTime > b.reservedTime) return 1;
          if (a.reservedTime < b.reservedTime) return -1;

          return 0;
        });

        // 날짜만 추출
        const datesOnly = extractedData.map((item) => item.date);
        setDatesOnly(datesOnly); // 날짜만 추출된 배열 설정
        setExtractedData(extractedData); // 추출된 예약 정보 배열 설정
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 예약 있는 날에 표시 추가
  const addContent = ({ date }) => {
    if (datesOnly.includes(dayjs(date).format("YYYY-MM-DD"))) {
      return (
        <>
          <img
            alt="reservation-chk"
            src={MiniChk}
            className="reservation-icon"
          />{" "}
          {/* 이미지 표시 */}
        </>
      );
    }
    return null; // 예약 없는 경우는 아무 내용도 반환하지 않음
  };

  // 예약된 날짜에 해당하는 타일에 클래스 이름 추가
  const tileClassName = ({ date }) => {
    if (datesOnly.includes(dayjs(date).format("YYYY-MM-DD"))) {
      return "reserved-date"; // 예약된 날짜에 해당하는 클래스 이름
    }
    return null; // 예약 없는 경우는 클래스 이름 없음
  };

  const viewDate = ({ date }) => {
    const formattedDate = dayjs(date).format("MM/DD");
    return `${formattedDate}`;
  };

  const viewHour = ({ time }) => {
    const formattedTime = `${time.slice(0, 2)}:${time.slice(2)}`;
    return `${formattedTime}`;
  };

  // 날짜 범위 계산하는 코드
  const calculateCal = (activeDate, targetDate) => {
    const diffInDays = dayjs(targetDate).diff(dayjs(activeDate), "day");
    const isSameMonth = dayjs(activeDate).isSame(targetDate, "month");

    if (isSameMonth || diffInDays <= 7) {
      return true; // 일치하는 조건인 경우 true 반환
    }

    return false; // 일치하지 않는 경우 false 반환
  };

  // 디데이 계산하는 코드
  const calculateDday = (activeDate, targetDate) => {
    const diffInDays = dayjs(targetDate).diff(dayjs(activeDate), "day");

    if (diffInDays !== 0) {
      if (diffInDays < 0) {
        return `D+${Math.abs(diffInDays)}`;
      } else {
        return `D-${diffInDays}`;
      }
    } else {
      if (dayjs(activeDate).isSame(targetDate, "day")) {
        return "Today";
      } else {
        return `D-1`; // targetDate가 activeDate 다음날인 경우
      }
    }
  };

  // 예약 memo 업데이트 하는 코드
  const handleSavedMemo = (date, reservedTime, memo) => {
    // 추출된 예약 정보 배열에서 해당 날짜와 일치하는 항목의 memo 값을 업데이트
    const updatedData = extractedData.map((item) => {
      if (
        item.date === dayjs(date).format("YYYY-MM-DD") &&
        item.reservedTime === reservedTime
      ) {
        // 예약 ID를 가져와서 API 호출에 사용할 URL 생성
        const reservationId = item.id;
        const url = `${BE_URL}${endpoint_reserve}memo/${reservationId}`;

        // memo를 업데이트하기 위한 데이터 생성
        const data = {
          memo: memo,
        };

        // axios를 사용하여 PATCH 요청 전송
        axios
          .patch(url, data, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .catch((error) => {
            console.error(error);
          });

        return {
          ...item,
          memo: memo,
        };
      }
      return item;
    });

    setExtractedData(updatedData); // 업데이트된 예약 정보 배열 설정
  };

  // 말풍선에 나타날 내용
  const msg = `펜 아이콘을 눌러 예약 메모를 작성해보세요!`;

  // 말풍선을 보여주는 함수
  const handleShowTooltip = () => {
    setShowTooltip(true);
  };

  // 말풍선을 숨기는 함수
  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <CardBox bxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)">
        <ShowDate>
          <h1>{activeDateString}</h1>
        </ShowDate>
      </CardBox>
      <CardBox bxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}>
        <ShowCalendar>
          <ReCalendar
            locale="ko"
            onChange={onChange}
            value={value}
            nextLabel={<img alt="icon-right" src={IconRight}></img>}
            prevLabel={<img alt="icon-left" src={IconLeft}></img>}
            next2Label={null}
            prev2Label={null}
            showNeighboringMonth={false} // 앞뒤달에 이어지는 날짜
            tileContent={addContent}
            tileClassName={tileClassName}
          />
        </ShowCalendar>
      </CardBox>
      <CardBox
        bxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(#00ad5c, #00ad5c)",
          backgroundSize: "100% 100px",
        }}
      >
        <DiaryHeader>
          <h2>예약 상세</h2>
        </DiaryHeader>
        <DiaryMain
          onMouseEnter={handleShowTooltip}
          onMouseLeave={handleHideTooltip}
        >
          {/* 말풍선을 showTooltip 함수를 통해 표시 */}
          {showTooltip && <div className="tooltip">{msg}</div>}
          {extractedData
            .filter(
              (item) =>
                (dayjs(item.date).isSame(activeDate, "day") ||
                  dayjs(item.date).isAfter(activeDate, "day")) &&
                calculateCal(activeDate, item.date)
            )
            .map((item, index) => (
              <DiaryItemWrapper key={index}>
                <DiaryItem>
                  <ReTime>
                    <h3>{viewDate({ date: item.date })}</h3>
                    <p>{viewHour({ time: item.reservedTime })}</p>
                  </ReTime>
                  <ReDetail
                    hospitalName={item.dutyName}
                    memo={item.memo}
                    onSaved={(memo) =>
                      handleSavedMemo(item.date, item.reservedTime, memo)
                    }
                    onHideTooltip={handleHideTooltip} // handleHideTooltip 함수를 전달
                  />{" "}
                  <DueDate
                    isToday={calculateDday(activeDate, item.date) === "Today"}
                  >
                    <h2>{calculateDday(activeDate, item.date)}</h2>
                  </DueDate>
                </DiaryItem>
              </DiaryItemWrapper>
            ))}
        </DiaryMain>
      </CardBox>
    </>
  );
};

// 날짜 표시
const ShowDate = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;

  & h1 {
    font-size: 30px;
    color: #00ad5c;
    font-weight: bold;
    text-decoration-line: none;
  }
`;

// 달력 부분
const ShowCalendar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const ReCalendar = styled(Calendar)`
  .react-calendar {
    width: 100%;
    max-width: 832px;
    background-color: #fff;
    border: 1px solid #a0a096;
    font-family: Arial, Helvetica
  }

  /* 상단 네비게이션 바 */
  .react-calendar__navigation {
    display: flex;
    width: 100%;
    height: 80px;
    margin-bottom: 10px;

    .react-calendar__navigation__label {
      font-weight: bold;
      font-size: 20px;
      background: none;
      border:none;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
      background: none;
      border:none;
    }

    .react-calendar__navigation__label > span {
      font-size: 25px;
      font-weight: bold;
      color: #121212;
    }
  }

  /* 요일 표시 */
  .react-calendar__month-view__weekdays {
    background-color: rgba(0,173,92,0.5);
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 10px;
    abbr { /*월,화,수... 글자 부분*/
      color: #121212};
      font-size: 18px;
      margin-bottom: 10px;
    }
  }

  /* day 타일 모양 */
  .react-calendar__tile {
    position: relative; /* 상대적 위치 설정 */
    background: none;
    text-align: center;
    border: 5px solid white;
    line-height: 80px;
    font-size: 18px;
    color: #121212;
    border-radius: 100%;

    width: 100%;
    height: 100%;
    padding-top: 15px;
    padding-bottom: 5px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .react-calendar__tile img {
    position: absolute; /* 절대적 위치 설정 */
    bottom: 5px; /* 이미지를 아래쪽으로 20px 내리기 */
    left: 50%; /* 이미지를 가운데로 정렬하기 위해 왼쪽 위치 설정 */
    transform: translateX(-50%); /* 이미지의 가로 중앙 정렬 */
    width: 20px;
    height: 20px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: white;
  }
  }
  /*hover, focus, 선택됐을 시 */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background: #00ad5c;
    border-radius: 100%;
    color: white;
    font-weight: bold;
    border: 5px solid #00ad5c;
  }

  /* 오늘 표시 */
  .react-calendar__tile--now {
    border: 5px solid #00ad5c;
    color: #121212;
    font-weight: bold;
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    background-color: #00ad5c;
    color: white;
  }

  /* 주말일때 일 표시 */
  .react-calendar__month-view__days__day--weekend {
    color: #a9a9a9;
  }
`;

const DiaryHeader = styled.div`
  display: flex;
  justify-content: left;
  margin: 10px;
  border-bottom: 1px solid #b2b2b2;

  & > h2 {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    color: #00ad5c;
    margin-bottom: 10px;
  }
`;

const DiaryMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: 10px;
  align-items: flex-start;
  justify-content: space-between;

  & > div:nth-child(1) {
    flex-grow: 1;
  }

  & > div:nth-child(2) {
    flex-grow: 2;
  }

  & > div:nth-child(3) {
    flex-grow: 0.5;
  }

  &:hover > .tooltip,
  &:active > .tooltip {
    display: block;
  }

  .tooltip {
    white-space: pre-line;
    display: none;
    position: absolute;
    bottom: 95%;
    left: 80%;
    background-color: rgba(0, 173, 92, 0.3);
    border: rgba(0, 173, 92, 0.5) solid 1px;
    border-radius: 5px;
    color: #121212;
    font-size: 12px;
    font-weight: bold;
    height: auto;
    letter-spacing: -0.25px;
    margin-top: 6.8px;
    padding: 5px 11px;
    width: max-content;
    z-index: 100;
    transform: translate(-44%, 110%);
  }

  /* 말풍선 테두리와 꼬리를 위한 before, after */
  .tooltip::after {
    border-color: rgba(0, 173, 92, 0.5) transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: "";
    display: block;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
    position: absolute;
    bottom: -8px; /* 아래로 내리는 위치 조정 */
    width: 0;
    z-index: 1;
  }

  .tooltip::before {
    border-color: rgba(0, 173, 92, 0.5) transparent;
    border-style: solid;
    border-width: 0 6px 8px 6.5px;
    content: "";
    display: block;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
    position: absolute;
    bottom: -8px; /* 아래로 내리는 위치 조정 */
    width: 0;
    z-index: 0;
  }
`;

const DiaryItemWrapper = styled.div`
  width: 100%;
`;

const DiaryItem = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 10px 10px 10px;
`;

const ReTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 30%;
  margin-right: 20px;

  & > h3 {
    width: 100%;
    font-size: 18px;
    font-weight: bold;
  }

  & > p {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: 1px solid #00ad5c;
    border-radius: 40px;
    background-color: #00ad5c;
    padding: 5px 0 5px;
  }
`;

const DueDate = styled.div`
  float: left
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;

  & > h2 {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${(props) => (props.isToday ? "#00ad5c" : "#121212")};
    animation: ${(props) => (props.isToday ? "bounce 1s infinite" : "none")};
  }

  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;
