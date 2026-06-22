# 🛍️ PopFitUp Frontend

네이버 지도 기반 팝업스토어 탐색 서비스 **PopFitUp**의 프론트엔드입니다.

> 지역, 날짜, 카테고리, 키워드 기반 검색과  
> 팝업 상세 조회, 즐겨찾기, 제보/운영자 관리 화면을 제공합니다.

---

## 📌 프로젝트 개요

PopFitUp Frontend는 사용자가 팝업스토어를 직관적으로 탐색할 수 있도록 구현한 React 기반 프론트엔드 프로젝트입니다.

홈, 검색, 상세, 즐겨찾기, 제보, 관리자 페이지를 제공하며, 백엔드 API와 네이버 지도 SDK를 연동하여 팝업스토어 탐색 흐름을 구현했습니다.

이 README는 `popup-frontend` 폴더만 따로 확인할 때 필요한 실행 방법과 구조를 정리한 문서입니다.

서비스 전체 설명, 주요 화면, 백엔드 API 구조, 인증 흐름, 배포 구조는 루트 README를 참고합니다.

---

## 🧰 Tech Stack

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

## ✨ 주요 기능

- 팝업스토어 목록 / 상세 조회
- 지역, 날짜, 카테고리, 키워드 기반 검색
- URL query string 기반 검색 상태 유지
- 최신 / 인기 / 월별 팝업스토어 섹션
- 네이버 지도 기반 위치 표시
- 비슷한 카테고리 / 주변 지역 팝업 추천
- 로그인 사용자 즐겨찾기
- 즐겨찾기 목록 지도 + 리스트 동시 확인
- 지도 마커 클릭 시 말풍선 표시
- 말풍선 클릭 시 관련 카드로 자동 스크롤
- 팝업스토어 제보 등록 및 내 제보 관리
- 운영자 제보 답변 / 삭제
- 크롤링 데이터 누락 상황에 대한 fallback UI
- 반응형 UI

---

## 📄 주요 페이지

| 페이지 | 설명 |
| --- | --- |
| `/` | 홈, 검색 결과, 최신/인기/월별 팝업 |
| `/popups/:id` | 팝업스토어 상세 페이지 |
| `/favorites` | 즐겨찾기 목록 및 지도 |
| `/register` | 팝업스토어 제보 등록 |
| `/my-reports` | 내 제보 목록 |
| `/admin/reports` | 운영자 제보 관리 페이지 |

---

## 📁 Folder Structure

```text
src
├─ api          # 서버 API 요청 함수
├─ components   # 공통 UI 컴포넌트
├─ hooks        # 커스텀 훅 / 인증 / 즐겨찾기 상태
├─ lib          # 카테고리 매핑 등 공통 유틸
├─ routes       # 페이지 컴포넌트
├─ shared       # 공통 레이아웃 / 요소
└─ types        # API 응답 타입
```

---

## 🔌 API Structure

페이지 컴포넌트에서 직접 `fetch`를 호출하지 않고, 공통 API 클라이언트와 도메인별 API 모듈을 분리했습니다.

```text
src/api
├─ auth.ts       # 로그인, 로그아웃, 내 정보 조회
├─ client.ts     # 공통 API 클라이언트
├─ favorites.ts  # 즐겨찾기 조회, 추가, 삭제
├─ popups.ts     # 팝업 목록, 검색, 상세, 추천
└─ reports.ts    # 제보 등록, 내 제보, 관리자 제보 관리
```

---

## 🧩 핵심 구현 포인트

- URL query string 기반 검색 조건 유지
- 홈 초기 진입과 검색 요청의 로딩 상태 분리
- 네이버 지도 SDK 비동기 로딩 대응
- 지도 인스턴스 재사용 및 마커 위치 갱신
- 지도 마커와 카드 리스트 동기화
- 로그인 필요 화면 분기
- 크롤링 데이터 누락 상황에 대한 fallback UI
- 모바일 / 태블릿 / 데스크탑 반응형 UI

---

## 🔧 환경변수

`.env`

```env
VITE_API_URL=http://localhost:3000
```

운영 환경에서는 `VITE_API_URL`을 배포된 API 서버 주소로 변경합니다.

---

## 🚀 실행 방법

```bash
npm install
npm run dev
```

---

## 📦 Build

```bash
npm run build
```

---

## 🔍 Preview

```bash
npm run preview
```

---

## 📎 참고

이 README는 통합 저장소 안의 `popup-frontend` 폴더를 설명하기 위한 문서입니다.

서비스 전체 설명, 주요 화면, 백엔드 API 구조, 인증 흐름, 배포 구조는 루트 README를 참고합니다.
