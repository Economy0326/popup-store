# PopFitUp Frontend

네이버 지도 기반 팝업스토어 탐색 서비스 **PopFitUp**의 프론트엔드입니다.

지역, 날짜, 카테고리, 키워드 기반 검색과 팝업 상세 조회, 즐겨찾기, 제보/운영자 관리 화면을 제공합니다.

---

## Tech Stack

| 구분 | 기술 |
| --- | --- |
| Language | TypeScript |
| Framework | React |
| Build Tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| Map | Naver Maps JavaScript SDK |

---

## 주요 기능

- 팝업스토어 목록 / 상세 조회
- 지역, 날짜, 카테고리, 키워드 기반 검색
- URL query string 기반 검색 상태 유지
- 최신 / 인기 / 월별 팝업스토어 섹션
- 네이버 지도 기반 위치 표시
- 로그인 사용자 즐겨찾기
- 팝업스토어 제보 등록 및 내 제보 관리
- 운영자 제보 답변 / 삭제
- 반응형 UI

---

## Folder Structure

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

## API Structure

페이지 컴포넌트에서 직접 `fetch`를 호출하지 않고, 공통 API 클라이언트와 도메인별 API 모듈을 분리했습니다.

```text
api
├─ auth.ts       # 로그인, 로그아웃, 내 정보 조회
├─ client.ts     # 공통 API 클라이언트
├─ favorites.ts # 즐겨찾기 조회, 추가, 삭제
├─ popups.ts    # 팝업 목록, 검색, 상세, 추천
└─ reports.ts   # 제보 등록, 내 제보, 관리자 제보 관리
```

---

## 주요 페이지

| 페이지 | 설명 |
| --- | --- |
| `/` | 홈, 검색 결과, 최신/인기/월별 팝업 |
| `/popups/:id` | 팝업스토어 상세 페이지 |
| `/favorites` | 즐겨찾기 목록 및 지도 |
| `/register` | 팝업스토어 제보 등록 |
| `/my-reports` | 내 제보 목록 |
| `/admin/reports` | 운영자 제보 관리 페이지 |

---

## 실행 방법

```bash
npm install
npm run dev
```

---

## 환경변수

```env
VITE_API_URL=https://api.popfitup.com
```

로컬 개발 환경에서는 다음과 같이 설정할 수 있습니다.

```env
VITE_API_URL=http://localhost:8080
```

---

## Build

```bash
npm run build
```

---

## Preview

```bash
npm run preview
```
