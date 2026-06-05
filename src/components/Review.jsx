import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import check from '../assets/img/check.svg'

const Review = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    const savedVideoInfo = localStorage.getItem("videoInfo");
    const savedFaces = localStorage.getItem("faces");
    const savedGenerate = localStorage.getItem("generateSetting");

    if (!savedVideoInfo) {
      navigate("/upload");
      return;
    }

    setVideoInfo(JSON.parse(savedVideoInfo));

    if (savedFaces) {
      setFaces(JSON.parse(savedFaces));
    }

    if (savedGenerate) {
      setIsGenerating(JSON.parse(savedGenerate));
    }
  }, [navigate]);

  const steps = [
    "동영상 업로드",
    "본인 얼굴 등록",
    "동영상 생성",
    "동영상 검수",
    "동영상 다운로드",
  ];
  const handleReturn = () => {
    navigate("/generate");
  };
  const handleNext = () => {
    navigate("/download");
  };
  return (
    <div className='review-page'>
      <div className="review-container">
        <div className="review-header">
          <div>
            <h1>동영상 미리보기</h1>
            <p>
              블러 처리된 영상을 미리 확인해 보세요.
            </p>
          </div>

          <div className="stepper">
            {steps.map((label, index) => (
              <div className="step-wrap" key={label}>
                <div className={`step ${index === 3 ? "active" : ""}`}>
                  <div className="circle">{index + 1}</div>
                  <span>{label}</span>
                </div>
                {index !== steps.length - 1 && <div className="line" />}
              </div>
            ))}
          </div>
        </div>
        <din className="review-content">
          <div className="preview_div">
            <div className="preview_text">
              <div className="title">결과 미리보기</div>
              <div className="preview_done">
                <img src={check} className='check' />
                <div className="done_text">블러 처리가 성공적으로 완료되었습니다.</div>
              </div>
            </div>
            <div className="video"></div>
          </div>
          <div className="video_info_div">
            <div className="title">동영상 정보</div>
            <div className="info_contents">
              <div className="info_normal_div">
                <div className="info_title">원본 파일</div>
                <div className="info_text">{videoInfo?.name || "-"}</div>
              </div>
              <div className="info_normal_div">
                <div className="info_title">길이</div>
                <div className="info_text">{videoInfo
                  ? `${videoInfo.duration} (${videoInfo.size})`
                  : "-"}</div>
              </div>
              <div className="info_normal_div">
                <div className="info_title">해상도</div>
                <div className="info_text">input_video.mp4</div>
              </div>
              <div className="info_normal_div">
                <div className="info_title">등록 인물</div>
                <div className="info_text">{faces.length}명</div>
              </div>
              <div className="info_normal_div">
                <div className="info_title">블러 범위</div>
                <div className="info_text">{isGenerating?.blurTarget === "face" ? "모든 얼굴" : "등록 인물 제외"}</div>
              </div>
              <div className="info_normal_div">
                <div className="info_title">처리 방식</div>
                <div className="info_text">{isGenerating?.processType === "mosaic" ? "블러" : "이모지"}</div>
              </div>
              <div className="info_bottom_div">
                <div className="info_title">완료 시간</div>
                <div className="info_text">input_video.mp4</div>
              </div>
            </div>
          </div>
        </din>
        <div className="bottom_btn_div">
          <button className="retry" onClick={handleReturn}>다시 생성하기</button>
          <button className="next" onClick={handleNext}>다음</button>
        </div>
      </div>

    </div>
  )
}

export default Review
