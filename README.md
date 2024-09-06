# Businsa

<!--목차-->
# Table of Contents
- [[1] About the Project](#1-about-the-project)
  - [Features](#features)
  - [Technologies](#technologies)
- [[2] Getting Started](#2-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [[3] Usage](#3-usage)
- [[4] Contribution](#4-contribution)
- [[5] Acknowledgement](#5-acknowledgement)
- [[6] Contact](#6-contact)
- [[7] License](#7-license)

# [1] About the Project

**Businsa**는 사용자가 다양한 상품을 탐색하고 구매할 수 있는 종합 커머스 애플리케이션입니다. 이 프로젝트는 Firebase를 사용한 데이터베이스 및 백엔드 구현과 더불어 이미지 최적화를 통해 성능을 극대화하였습니다.

- 빠르고 직관적인 사용자 인터페이스를 제공합니다.
- 이미지 최적화를 통해 렌더링 시간을 단축하고 사용자 경험을 향상시켰습니다.
- Firebase를 사용한 실시간 데이터베이스 연동으로 신속한 데이터 업데이트를 지원합니다.

## Features
- **상품 탐색**: 사용자가 다양한 상품을 검색하고 상세 정보를 확인할 수 있습니다.
- **장바구니**: 선택한 상품을 장바구니에 추가하고 결제를 진행할 수 있습니다.
- **실시간 데이터 업데이트**: Firebase Firestore와 연동하여 재고 및 상품 정보를 실시간으로 업데이트합니다.
- **이미지 최적화**: 캔버스를 통해 이미지를 webP 형식으로 변환하고 Firebase Storage에 업로드하여 렌더링 성능을 최적화했습니다.

## Technologies
- **React** (18.x)
- **Firebase** (인증, Firestore, Storage)
- **styled-components** (5.x)
- **Vite** (번들러)
- **Yarn** (패키지 매니저)
- **React-Query** (데이터 패칭 라이브러리)
- **PayOne** (결제 SDK 라이브러리)

# [2] Getting Started

## Prerequisites
- **Node.js** (최소 14.x 버전)
- **Yarn** (최신 버전)
- **Firebase**: (최신 버전)

## Installation
1. 이 저장소를 클론합니다:
    ```bash
    git clone https://github.com/joshyeom/businsa.git
    ```
2. 프로젝트 디렉토리로 이동한 후 패키지를 설치합니다:
    ```bash
    yarn
    ```

## Configuration
1. Firebase 콘솔에서 제공된 설정 정보를 `.env` 파일에 추가하세요:
    ```bash
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

2. Firebase에서 인증, Firestore, 그리고 Storage 설정을 완료하세요.

# [3] Usage
Businsa를 로컬에서 실행하려면, 다음 명령어를 실행한 후 브라우저에서 `localhost:5173`에 접속하세요:
```bash
yarn dev
```


주요 기능 사용 예시
상품 검색 및 장바구니 추가: 사용자는 검색 기능을 통해 원하는 상품을 찾아 장바구니에 담을 수 있습니다.
javascript
코드 복사
const addToCart = (productId) => {
  // 장바구니에 상품 추가
};
[4] Contribution
기여해주신 모든 분들께 감사드립니다. contributing guide를 참고해주세요. 이 프로젝트에 기여하신 분들을 소개합니다!

✨ dev-ujin: 이미지 최적화를 통한 성능 개선
[5] Acknowledgement
Best-README-Template - othneildrew
Firebase Documentation
[6] Contact
📧 dev.ujin518@gmail.com
📋 https://dev-ujin.github.io/contact
[7] License
MIT 라이센스에 따라 배포됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

<!--Url for Badges--> <!--Url for Buttons--> <!--URLS-->
