import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import check from '../assets/img/check.svg';
import safe from '../assets/img/safe.svg';
import tip from '../assets/img/tip.svg';

const BACKEND_BASE_URL = "https://nonwoody-winnie-excitably.ngrok-free.dev";

const Download = () => {
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState("");

  const steps = [
    "동영상 업로드",
    "본인 얼굴 등록",
    "동영상 생성",
    "동영상 검수",
    "동영상 다운로드",
  ];

  useEffect(() => {
    const videoId = localStorage.getItem("current_video_id");
    const savedVideoInfo = localStorage.getItem("videoInfo");

    if (!savedVideoInfo) {
      navigate("/upload");
      return;
    }

    if (videoId) {
      setVideoUrl(`${BACKEND_BASE_URL}/api/blur/download/${videoId}`);
    }
  }, [navigate]);

  const handleDownloadClick = () => {
    if (!videoUrl) {
      alert("다운로드할 영상 주소가 존재하지 않습니다.");
      return;
    }

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `blurred_video_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className='download-page'>
      <div className="download-container">
        <div className="download-header">
          <div>
            <h1>동영상 다운로드</h1>
            <p>
              블러 처리된 영상을 안전하게 저장하세요.
            </p>
          </div>

          <div className="stepper">
            {steps.map((label, index) => (
              <div className="step-wrap" key={label}>
                <div className={`step ${index === 4 ? "active" : ""}`}>
                  <div className="circle">{index + 1}</div>
                  <span>{label}</span>
                </div>
                {index !== steps.length - 1 && <div className="line" />}
              </div>
            ))}
          </div>
        </div>

        <div className="download-content">
          <div className="preview_div">
            <div className="preview_text">
              <img src={check} className='check' alt="Check" />
              <div className="title">블러 처리된 영상이 준비되었습니다!</div>
            </div>

            <div className="video">
              {videoUrl ? (
                <video 
                  src={videoUrl} 
                  controls 
                  style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px" }}
                />
              ) : (
                <div className="video-placeholder">영상을 로드하는 중입니다...</div>
              )}
            </div>
          </div>
          
          <div className="info_div">
            <div className="safe_info_div">
              <img src={safe} className="safe" alt="Safe" />
              <div className="safe_text">
                <div className="safe_title">개인정보 보호 완료</div>
                <div className="safe_txt">타인의 개인정보가 안전하게 블러 처리되었습니다.</div>
              </div>
            </div>
            <div className="tip_div">
              <img src={tip} className="tip" alt="Tip" />
              <div className="tip_text">
                <div className="tip_title">Tip</div>
                <div className="tip_txt">
                  - 다운로드한 영상은 언제든지 내보내기 및 편집이 가능합니다.
                  <br />
                  - 프로젝트는 30일간 보관되며, 이후 자동 삭제됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="download_bottom_btn">
          <button className="download" onClick={handleDownloadClick}>
            동영상 다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;