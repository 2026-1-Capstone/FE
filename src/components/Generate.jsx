import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PeopleIcon from "../assets/img/PeopleIcon.svg";
import NonePeopleIcon from "../assets/img/NonePeopleIcon.svg";
import BlurIcon from "../assets/img/BlurIcon.svg";
import EmoIcon from "../assets/img/EmoIcon.svg";

const Generate = () => {
    const navigate = useNavigate();

    const [isGenerating, setIsGenerating] = useState(false);
    const [blurTarget, setBlurTarget] = useState("face");
    const [processType, setProcessType] = useState("mosaic");

    const [videoInfo, setVideoInfo] = useState(null);
    const [faces, setFaces] = useState([]);

    const steps = [
        "동영상 업로드",
        "본인 얼굴 등록",
        "동영상 생성",
        "동영상 검수",
        "동영상 다운로드",
    ];

    useEffect(() => {
        const savedVideoInfo = localStorage.getItem("videoInfo");
        const savedFaces = localStorage.getItem("faces");

        if (!savedVideoInfo) {
            navigate("/upload");
            return;
        }

        setVideoInfo(JSON.parse(savedVideoInfo));

        if (savedFaces) {
            setFaces(JSON.parse(savedFaces));
        }
    }, [navigate]);

    const handlePrev = () => {
        navigate("/register");
    };

    const handleGenerate = () => {
        setIsGenerating(true);

        const generateSetting = {
            blurTarget,
            processType,
            videoInfo,
            faces,
        };

        localStorage.setItem("generateSetting", JSON.stringify(generateSetting));

        // 나중에 백엔드 API 연결 시 이 부분을 API 요청으로 바꾸면 됨
        setTimeout(() => {
            setIsGenerating(false);
            navigate("/review");
        }, 2000);
    };

    return (
        <div className="generate-page">
            <div className="generate-container">
                <div className="generate-header">
                    <div>
                        <h1>동영상 생성</h1>
                        <p>
                            동영상 처리 설정을 선택하고
                            <br />
                            비디오 생성을 시작해 주세요.
                        </p>
                    </div>

                    <div className="stepper">
                        {steps.map((label, index) => (
                            <div className="step-wrap" key={label}>
                                <div className={`step ${index === 2 ? "active" : ""}`}>
                                    <div className="circle">{index + 1}</div>
                                    <span>{label}</span>
                                </div>
                                {index !== steps.length - 1 && <div className="line" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="generate-content">
                    <div className="setting-card">
                        <h3>설정 옵션</h3>

                        <div className="setting-section">
                            <h4>블러 처리 범위</h4>

                            <div className="option-grid">
                                <OptionCard
                                    img={PeopleIcon}
                                    active={blurTarget === "face"}
                                    title="모든 얼굴"
                                    desc="영상 속의 모든 얼굴을 자동으로 처리합니다."
                                    onClick={() => setBlurTarget("face")}
                                />

                                <OptionCard
                                    img={NonePeopleIcon}
                                    active={blurTarget === "except"}
                                    title="선택 인물 제외"
                                    desc="등록된 인물을 제외하고 처리합니다."
                                    onClick={() => setBlurTarget("except")}
                                />
                            </div>
                        </div>

                        <div className="setting-section">
                            <h4>처리 방식</h4>

                            <div className="option-grid">
                                <OptionCard
                                    img={BlurIcon}
                                    active={processType === "mosaic"}
                                    title="블러"
                                    desc="흐림 처리로 인물을 가립니다."
                                    onClick={() => setProcessType("mosaic")}
                                />

                                <OptionCard
                                    img={EmoIcon}
                                    active={processType === "blur"}
                                    title="이모지"
                                    desc="이모지로 인물을 가립니다."
                                    onClick={() => setProcessType("blur")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="summary-card">
                        <h3>설정 요약</h3>

                        <div className="summary-row">
                            <span>원본 파일</span>
                            <strong>{videoInfo?.name || "-"}</strong>
                        </div>

                        <div className="summary-row">
                            <span>길이</span>
                            <strong>
                                {videoInfo
                                    ? `${videoInfo.duration} (${videoInfo.size})`
                                    : "-"}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>등록 인물</span>
                            <strong>{faces.length}명</strong>
                        </div>

                        <div className="summary-row">
                            <span>처리 범위</span>
                            <strong>
                                {blurTarget === "face" ? "모든 얼굴" : "등록 인물 제외"}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>처리 방식</span>
                            <strong>{processType === "mosaic" ? "블러" : "이모지"}</strong>
                        </div>

                        <div className="estimate-box">
                            <span>i</span>
                            <div>
                                <strong>예상 소요 시간 약 5 - 10분</strong>
                                <p>영상 길이에 따라 시간이 달라질 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="generate-buttons">
                    <button
                        className="prev-btn"
                        onClick={handlePrev}
                        disabled={isGenerating}
                    >
                        이전
                    </button>

                    <button
                        className="start-btn"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "블러 처리 중..." : "비디오 생성 시작"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const OptionCard = ({ img, active, title, desc, onClick }) => {
    return (
        <button
            type="button"
            className={`option-card ${active ? "active" : ""}`}
            onClick={onClick}
        >
            <span className="radio" />
            <img src={img} alt={title} className="option-icon" />
            <div>
                <strong>{title}</strong>
                <p>{desc}</p>
            </div>
        </button>
    );
};

export default Generate;