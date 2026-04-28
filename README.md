## 서울 벚꽃 명소 지도

메인페이지 중앙 지도에 **서울 대표 벚꽃 명소 6곳**을 마커로 표시한 정적 웹페이지입니다.

- **표시 장소**: 경복궁, 남산타워, 여의도, 어린이 대공원, 서울숲, 잠실 석촌호수
- **지도**: OpenStreetMap + Leaflet(CDN)

## 실행 방법

### 방법 1) 파일로 바로 열기

- `website/index.html`을 브라우저로 열면 됩니다.
- 인터넷 연결이 있어야 지도 타일/라이브러리(CDN)가 로드됩니다.

### 방법 2) 간단 로컬 서버로 실행(권장)

PowerShell에서:

```powershell
cd c:\myproject\website
python -m http.server 5173
```

그 다음 브라우저에서 `http://localhost:5173` 접속.

