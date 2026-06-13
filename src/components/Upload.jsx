import React from "react";
import { useNavigate } from "react-router-dom";
import Cloud from "../assets/img/Cloud.svg";
import load from "../assets/img/load.svg";

const Upload = () => {
    const navigate = useNavigate();

    const handleVideoUpload = (e) => {
        console.log("업로드 실행");
        
        const file = e.target.files[0];

        if (!file) return;

        const maxSize = 4 * 1024 * 1024 * 1024;

        console.log("파일 크기:", file.size);

        if (file.size > maxSize) {
            alert("최대 4GB까지 업로드할 수 있습니다.");
            return;
        }

        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);

            const duration = video.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);

            const videoInfo = {
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
                duration: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
            };

            localStorage.setItem("videoInfo", JSON.stringify(videoInfo));

            window.uploadedVideoFile = file;

            navigate("/register");
        };

        video.src = URL.createObjectURL(file);
    };

    return (
        <div className="upload-page">
            <div className="upload-container">
                <div className="upload-top">
                    <h1 className="page-title">동영상 업로드</h1>

                    <div className="stepper">
                        <div className="step active">
                            <div className="circle">1</div>
                            <span>동영상 업로드</span>
                        </div>

                        <div className="line"></div>

                        <div className="step">
                            <div className="circle">2</div>
                            <span>본인 얼굴 등록</span>
                        </div>

                        <div className="line"></div>

                        <div className="step">
                            <div className="circle">3</div>
                            <span>동영상 생성</span>
                        </div>

                        <div className="line"></div>

                        <div className="step">
                            <div className="circle">4</div>
                            <span>동영상 검수</span>
                        </div>

                        <div className="line"></div>

                        <div className="step">
                            <div className="circle">5</div>
                            <span>동영상 다운로드</span>
                        </div>
                    </div>
                </div>


                <div className="upload-card">
                    <img src={Cloud} className="img-cloud" alt="Cloud" />

                    <h3>새로운 프로젝트 시작하기</h3>

                    <div className="drop-zone">
                        <img src={load} className="img-upload" alt="Upload" />

                        <p>파일을 드래그하거나 클릭</p>

                        <span>MP4, MOV 지원 · 최대 4GB</span>

                        <input
                            type="file"
                            accept="video/mp4, video/quicktime"
                            onChange={handleVideoUpload}
                        />
                    </div>
                </div>

                <p className="notice">
                    업로드된 파일은 안전하게 보호되며,
                    프로젝트 내에서만 접근할 수 있습니다.
                </p>
            </div>
        </div>
    );
};

export default Upload;