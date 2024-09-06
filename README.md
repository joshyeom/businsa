# Businsa

**Businsa**는 사용자가 다양한 상품을 탐색하고 구매할 수 있는 종합 커머스 애플리케이션입니다. 프론트엔드는 React로 구현되었으며, Firebase를 통해 데이터베이스 및 백엔드를 처리합니다.

## 목차
- [주요 기능](#주요-기능)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [기여 방법](#기여-방법)

## 주요 기능
- 사용자는 다양한 카테고리에서 상품을 탐색하고 장바구니에 담을 수 있습니다.
- Firebase를 통한 사용자 인증 및 결제 시스템 지원.
- 실시간으로 재고와 상품 정보를 업데이트합니다.

## 설치 방법
1. 이 저장소를 클론합니다:
    ```bash
    git clone https://github.com/joshyeom/businsa.git
    ```
2. 패키지 설치:
    ```bash
    yarn
    ```
3. 개발 서버 실행:
    ```bash
    yarn dev
    ```

## 사용 방법
- `yarn dev` 명령어로 로컬 서버를 실행한 후, 브라우저에서 `localhost:3000`에 접속하여 애플리케이션을 테스트할 수 있습니다.
- Firebase 콘솔을 통해 백엔드 및 데이터베이스를 관리합니다.

## 기술 스택
- **프론트엔드**: React, styled-components
- **백엔드**: Firebase (인증, 데이터베이스, 호스팅)
- **번들러**: Vite
- **패키지 매니저**: Yarn

## 프로젝트 구조
```bash
├── src
│   ├── components   # 재사용 가능한 컴포넌트
│   ├── hooks        # 커스텀 훅
│   ├── pages        # 각 페이지별 컴포넌트
│   ├── services     # Firebase 및 API 통신 로직
│   └── styles       # styled-components 스타일링
└── public           # 정적 파일
