import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusIcon from "../assets/img/plus.png";
import CloseIcon from "../assets/img/del.png";

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

  const handleNext = () => {
    const faceData = faces.map((face) => ({
        id: face.id,
        name: face.name,
    }));

    localStorage.setItem("faces", JSON.stringify(faceData));    
    // 나중에 백엔드 연결 시 여기서 faces 저장 요청 보내면 됨
    console.log("저장할 얼굴 데이터:", faces);
    navigate("/generate");
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

const FaceCard = ({ title, selected, face, onNameChange, onDelete }) => {
  const [isToggleOn, setIsToggleOn] = useState(false);

  const handleToggle = () => {
    setIsToggleOn(!isToggleOn);
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
          className={`toggle-container ${
            isToggleOn ? 'toggle--checked' : ''
          }`}
          onClick={handleToggle}
        >
          <div
            className={`toggle-circle ${
              isToggleOn ? 'toggle--checked' : ''
            }`}
          />
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