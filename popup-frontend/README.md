# 🛍️ PopFitUp Frontend
네이버 지도 기반 팝업스토어 탐색 서비스 **PopFitUp**의 프론트엔드입니다.

> 지역, 날짜, 카테고리, 키워드 기반 검색과  
> 팝업 상세 조회, 즐겨찾기, 제보/운영자 관리 화면을 제공합니다.

---

## 📌 Table of Contents

- 프로젝트 개요
- Tech Stack
- 주요 기능
- 주요 페이지
- Folder Structure
- API Structure
- 핵심 구현 포인트
- 실행 방법
- 환경변수
- Build & Preview
- 참고

---

## 1️⃣ 프로젝트 개요

PopFitUp Frontend는 사용자가 팝업스토어를 직관적으로 탐색할 수 있도록 구성한 React 기반 프론트엔드 프로젝트입니다.

홈, 검색, 상세, 즐겨찾기, 제보, 관리자 페이지를 제공하며,  
백엔드 API와 네이버 지도 SDK를 연동하여 팝업스토어 탐색 흐름을 구현했습니다.

서비스 전체 설명, 주요 화면 스크린샷, 백엔드 API 구조, 인증 흐름은 루트 README에서 확인할 수 있습니다.

---

## 2️⃣ Tech Stack

| 구분 | 기술 |
| --- | --- |
| Language | TypeScript |
| Framework | React |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Map | Naver Maps JavaScript SDK |
| API | Fetch 기반 공통 API Client |
| Auth | Session Cookie |

---

## 3️⃣ 주요 기능

- 팝업스토어 목록 / 상세 조회
- 지역, 날짜, 카테고리, 키워드 기반 검색
- URL query string 기반 검색 상태 유지
- 최신 / 인기 / 월별 팝업스토어 섹션
- 네이버 지도 기반 위치 표시
- 로그인 사용자 즐겨찾기
- 즐겨찾기 목록 지도 + 리스트 동시 확인
- 팝업스토어 제보 등록 및 내 제보 관리
- 운영자 제보 답변 / 삭제
- 크롤링 데이터 누락 상황에 대한 fallback UI
- 반응형 UI

---

## 4️⃣ 주요 페이지

| 페이지 | 설명 |
| --- | --- |
| `/` | 홈, 검색 결과, 최신/인기/월별 팝업 |
| `/popups/:id` | 팝업스토어 상세 페이지 |
| `/favorites` | 즐겨찾기 목록 및 지도 |
| `/register` | 팝업스토어 제보 등록 |
| `/my-reports` | 내 제보 목록 |
| `/admin/reports` | 운영자 제보 관리 페이지 |

---

## 5️⃣ Folder Structure

```text
src
├─ api          # 서버 API 요청 함수
├─ components   # 공통 UI 컴포넌트
├─ hooks        # 커스텀 훅
├─ routes       # 페이지 컴포넌트
├─ shared       # 공통 레이아웃/요소
└─ types        # API 응답 타입
```

---

## 6️⃣ API Structure

페이지 컴포넌트에서 직접 `fetch`를 호출하지 않고,  
공통 API 클라이언트와 도메인별 API 모듈을 분리했습니다.

```text
api
├─ auth.ts       # 로그인, 로그아웃, 내 정보 조회
├─ client.ts     # 공통 API 클라이언트
├─ favorites.ts  # 즐겨찾기 조회, 추가, 삭제
├─ popups.ts     # 팝업 목록, 검색, 상세, 추천
└─ reports.ts    # 제보 등록, 내 제보, 관리자 제보 관리
```

---

## 7️⃣ 핵심 구현 포인트

### 🏠 검색 조건 URL 유지

검색 조건을 React state에만 저장하지 않고 URL query string으로 유지했습니다.

이를 통해 새로고침, 뒤로가기, 링크 공유 시에도 동일한 검색 결과를 복원할 수 있습니다.

---

### 🧭 홈 / 검색 로딩 상태 분리

홈 초기 진입 시 로딩 상태와 검색 요청 시 로딩 상태를 분리했습니다.

- 홈 초기 진입: `initialLoading`
- 검색 요청: `searchLoading`
- 검색 결과 없음: 빈 상태 UI 표시

---

### 🗺️ 네이버 지도 SDK 로딩 처리

네이버 지도 SDK는 외부 스크립트로 비동기 로드되기 때문에,  
지도 컴포넌트에서 `window.naver.maps` 존재 여부를 확인한 뒤 지도를 초기화했습니다.

SDK가 아직 준비되지 않은 경우 일정 시간 후 다시 확인하고,  
지도 인스턴스는 한 번 생성 후 재사용하도록 처리했습니다.

---

### 🔐 로그인 필요 화면 분기

즐겨찾기, 제보, 내 제보 목록은 로그인 사용자 전용 기능입니다.

로그인 상태가 없으면 로그인 필요 안내 UI를 보여주고,  
로그인 이후 기능을 사용할 수 있도록 흐름을 분리했습니다.

---

### 🧩 크롤링 데이터 fallback

팝업스토어 데이터는 외부 수집 기반이므로 이미지, 좌표, 카테고리, 설명이 누락될 수 있습니다.

데이터가 부족해도 화면이 깨지지 않도록 조건부 렌더링과 fallback UI를 적용했습니다.

---

### 📱 반응형 UI

모바일, 태블릿, 데스크탑 환경에서 주요 화면이 자연스럽게 보이도록 반응형 레이아웃을 적용했습니다.

- 검색 필터 반응형 배치
- 카드 그리드 반응형 처리
- 지도 영역 높이 조정
- 모바일 헤더 메뉴 분리

---

## 8️⃣ 실행 방법

```bash
npm install
npm run dev
```

---

## 9️⃣ 환경변수

```env
VITE_API_URL=https://api.popfitup.com
```

로컬 개발 환경에서는 다음과 같이 설정할 수 있습니다.

```env
VITE_API_URL=http://localhost:3000
```

---

## 🔟 Build & Preview

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## 📎 참고

이 README는 `popup-frontend` 폴더를 단독으로 확인할 때 필요한 실행 방법과 구조를 정리한 문서입니다.

서비스 전체 설명, 주요 화면 스크린샷, 백엔드 API 구조, 인증 흐름, 배포 구조는 루트 README를 참고합니다.
