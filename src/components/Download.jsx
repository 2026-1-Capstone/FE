import React from 'react'
import check from '../assets/img/check.svg'
import safe from '../assets/img/safe.svg'
import tip from '../assets/img/tip.svg'

const Download = () => {
  const steps = [
    "동영상 업로드",
    "본인 얼굴 등록",
    "동영상 생성",
    "동영상 검수",
    "동영상 다운로드",
  ];
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
        <din className="download-content">
          <div className="preview_div">
            <div className="preview_text">
              <img src={check} className='check' />
              <div className="title">블러 처리된 영상이 준비되었습니다!</div>
            </div>
            <div className="video"></div>
          </div>
          <div className="info_div">
            <div className="safe_info_div">
              <img src={safe} className="safe" />
              <div className="safe_text">
                <div className="safe_title">개인정보 보호 완료</div>
                <div className="safe_txt">타인의 개인정보가 안전하게 블러 처리되었습니다.</div>
              </div>
            </div>
            <div className="tip_div">
              <img src={tip} className="tip" />
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
        </din>
        <div className="download_bottom_btn">
          <button className="download">동영상 다운로드</button>
        </div>
      </div>

    </div>
  )
}

export default Download
