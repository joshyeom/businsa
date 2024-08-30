# 코드 컨벤션

1. 파일 및 폴더 구조

- 컴포넌트 파일: PascalCase로 작성, 각 컴포넌트는 별도의 파일로 분리.

2. 폴더 구조

- components/: 재사용 가능한 컴포넌트.
- hooks/: 커스텀 훅.
- pages/: 페이지 컴포넌트.
- styles/: 스타일 파일.
- utils/: 함수 모듈
- contexts/: context API 모듈

3. 이름 규칙

- 컴포넌트: PascalCase (예: MyComponent)
- 훅: use... (예: useFetchData)
- 함수: ...Handler (예: clickHandler)

3. 컴포넌트 작성

- 함수형 컴포넌트 사용
- PropTypes로 props 명세 작성.

4. JSX

- Self-closing 태그 사용.
- JSX 줄바꿈: 복잡한 JSX는 줄바꿈하여 가독성 유지.
- 조건부 렌더링: 삼항 연산자 또는 && 사용.

5. 훅 사용

- 훅은 최상위에서만 호출.
- 조건부 훅 호출 금지.
- 의존성 배열 관리 철저.

6. 코드 정렬 및 포맷팅

- ESLint와 Prettier 사용.
- 세미콜론 사용.
- dobule quote 사용

7. 상태 관리

- 지역 상태는 useState, 전역 상태는 useContext 사용.

8. API 호출

- useEffect에서 API 호출, 에러 처리

9. 테스트

- 컴포넌트 및 훅에 대해 유닛 테스트 작성.

10. 타입스크립트

- 파일 확장자: .ts, .tsx 사용.
- 타입 정의: Props, 상태를 인터페이스로 정의.
- 함수 반환 타입 명시.

# 깃 컨벤션

1. 브랜치 이름

- 배포: main
- 기능 개발: dev

2. 커밋 메시지

- 형식: "타입: 설명"
  - feat: 새로운 기능 추가
  - fix: 버그 수정
  - refactor: 코드 리팩토링
  - docs: 문서 수정
  - style: 코드 포맷팅, 세미콜론 누락 등 비즈니스 로직에 영향 없는 변경
  - test: 테스트 코드 추가 또는 수정
  - chore: 기타 변경사항 (빌드 스크립트 수정 등)

3. 커밋 단위

- 자주 커밋: 의미 있는 작은 단위로 자주 커밋.
- 단일 책임 원칙: 하나의 커밋에 하나의 변경 사항만 포함.
