import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import PlusIcon from "../assets/img/plus.png";
import CloseIcon from "../assets/img/del.png";

const BACKEND_BASE_URL = "https://nonwoody-winnie-excitably.ngrok-free.dev";

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [faces, setFaces] = useState([]);

  const handleAddClick = () => {
    if (faces.length >= 3) {
      alert("최대 3명까지 등록할 수 있습니다.");
      return;
    }
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newFace = {
      id: Date.now(),
      name: "",
      image: URL.createObjectURL(file),
      file, 
      action: "no_blur",
    };

    setFaces([...faces, newFace]);
    e.target.value = "";
  };

  const handleNameChange = (id, value) => {
    setFaces(
      faces.map((face) =>
        face.id === id ? { ...face, name: value } : face
      )
    );
  };

  const handleActionToggle = (id, isEmojiOn) => {
    setFaces(
      faces.map((face) =>
        face.id === id ? { ...face, action: isEmojiOn ? "emoji" : "no_blur" } : face
      )
    );
  };

  const handleDelete = (id) => {
    setFaces(faces.filter((face) => face.id !== id));
  };

  const handlePrev = () => {
    navigate("/upload");
  };

  const handleSkip = () => {
    localStorage.removeItem("faces");
    navigate("/generate");
  };

  const handleNext = async () => {
    const videoFile = window.uploadedVideoFile;
    if (!videoFile) {
      alert("업로드된 동영상 파일이 없습니다. 첫 단계부터 다시 진행해 주세요.");
      navigate("/upload");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", videoFile);

      const optionsArray = faces.map((face, index) => {
        const uniqueFilename = `face_${face.id}_${face.file.name}`;
        return {
          person_id: `person_${index + 1}`,
          action: face.action,
          image_filename: uniqueFilename,
          emoji_filename: face.action === "emoji" ? "cat.png" : null 
        };
      });
      formData.append("options", JSON.stringify(optionsArray));

      faces.forEach((face) => {
        const uniqueFilename = `face_${face.id}_${face.file.name}`;
        formData.append("person_images", face.file, uniqueFilename);
      });

      const hasEmojiAction = faces.some(f => f.action === "emoji");
      if (hasEmojiAction) {
        try {
          const catResponse = await fetch("/assets/img/cat.png");
          if (catResponse.ok) {
            const catBlob = await catResponse.blob();
            formData.append("emoji_images", catBlob, "cat.png");
          }
        } catch (err) {
          console.error("이모지 파일 로드 실패:", err);
        }
      }

      console.log("코랩 백엔드로 비식별화 연산 요청 송신 중...", optionsArray);

      const response = await axios.post(`${BACKEND_BASE_URL}/api/blur`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("current_video_id", response.data.video_id);
        
        const faceData = faces.map((face) => ({
          id: face.id,
          name: face.name,
        }));
        localStorage.setItem("faces", JSON.stringify(faceData));

        navigate("/generate");
      }

    } catch (error) {
      console.error("백엔드 API 연동 에러:", error);
      alert("서버 연동 중 오류가 발생했습니다. 코랩 서버 상태나 ngrok 주소를 다시 확인해 주세요!");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div>
            <h1>얼굴 등록</h1>
            <p>
              영상에서 제외할 인물을 등록해 주세요. <br />
              최대 3명까지 등록할 수 있습니다.
            </p>
          </div>

          <div className="stepper">
            {[
              "동영상 업로드",
              "본인 얼굴 등록",
              "동영상 생성",
              "동영상 검수",
              "동영상 다운로드",
            ].map((label, index) => (
              <div className="step-wrap" key={label}>
                <div className={`step ${index === 1 ? "active" : ""}`}>
                  <div className="circle">{index + 1}</div>
                  <span>{label}</span>
                </div>
                {index !== 4 && <div className="line" />}
              </div>
            ))}
          </div>
        </div>

        <div className="face-card-wrap">
          {faces.map((face, index) => (
            <FaceCard
              key={face.id}
              title={`인물 ${index + 1}`}
              selected={index === 0}
              face={face}
              onNameChange={handleNameChange}
              onActionToggle={handleActionToggle} 
              onDelete={handleDelete}
            />
          ))}

          {faces.length < 3 && (
            <FaceAddCard
              title={`인물 ${faces.length + 1}`}
              onClick={handleAddClick}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            hidden
          />
        </div>

        <div className="info-box">
          <span className="info-icon">i</span>
          <div>
            <strong>
              정면 얼굴이 잘 보이는 사진일수록 인식 정확도가 높아집니다.
            </strong>
            <p>
              모자, 선글라스, 마스크는 인식을 낮출 수 있으니 가급적 착용하지 않은
              상태로 등록해 주세요.
            </p>
          </div>
        </div>

        <div className="button-area">
          <button className="outline" onClick={handleSkip}>
            건너뛰기
          </button>
          <button className="outline" onClick={handlePrev}>
            이전
          </button>
          <button className="next" onClick={handleNext}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

const FaceCard = ({ title, selected, face, onNameChange, onActionToggle, onDelete }) => {
  const [isToggleOn, setIsToggleOn] = useState(false);

  const handleToggle = () => {
    const nextState = !isToggleOn;
    setIsToggleOn(nextState);
    onActionToggle(face.id, nextState);
  };

  return (
    <div className="face-card">
      <button className="close-btn" onClick={() => onDelete(face.id)}>
        <img src={CloseIcon} alt="Close" />
      </button>

      <div className="face-title">
        <span>{title}</span>
        {selected && <em>선택됨</em>}
      </div>

      <div className="face-circle">
        <img src={face.image} alt="등록 얼굴" />
      </div>

      <input
        value={face.name}
        onChange={(e) => onNameChange(face.id, e.target.value)}
        placeholder="이름을 입력하세요"
      />

      <p>예) 나, 친구A</p>

      <div className="toggle-wrapper">
        <span>이모지</span>

        <div
          className={`toggle-container ${isToggleOn ? 'toggle--checked' : ''}`}
          onClick={handleToggle}
        >
          <div className={`toggle-circle ${isToggleOn ? 'toggle--checked' : ''}`} />
        </div>
      </div>
    </div>
  );
};

const FaceAddCard = ({ title, onClick }) => {
  return (
    <div className="face-card add-card" onClick={onClick}>
      <div className="face-title">
        <span>{title}</span>
      </div>

      <div className="add-circle">
        <img src={PlusIcon} alt="Add" />
        <strong>얼굴 이미지 추가</strong>
        <p>JPG, PNG 지원</p>
      </div>
    </div>
  );
};

export default Register;