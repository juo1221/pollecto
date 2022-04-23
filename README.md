
## ⭐️ **소개 & 제작 배경** 

<div align="center">
  <img src="https://user-images.githubusercontent.com/79268108/147741976-b619baa9-1cc6-44e9-8641-8e7dbee249af.png" width="700"/>
</div>

<br/>
<br/>

Pollecto는 많은 이미지들을 간편하고 빠르게  pdf 화할 수 있도록 도와주는 툴입니다. 

과외 선생님을 하고 있는 친구가 수업자료 이미지를 편집기로 하나하나 조작하며 오랫동안 수업 준비를 하는 모습을 보고, **시간을 최소화**시켜줄 앱 Pollecto를 만들게 됐습니다.

어플의 목표는 모든 이미지의 크기와 위치를 먼저 규격화함으로써 다수의 이미지를 빠르게 처리하는 것입니다. 

수업자료를 완성하는데 걸리는 시간 :  약 30 - 40분 [ 40 - 50 개의 이미지 이용].  
Pollecto 이용 시 걸리는 시간 : 약 5 - 10분 [ 40 - 50 개의 이미지 이용 ]

비교 영상 보러 가기: https://www.notion.so/f16e012d71e74909820eb70510427309.  
이용해보기 : https://juo1221.github.io/pollecto/index.html
<br/>

## 🎯 이용자



다수의 사진을 빠르게 a4 사이즈의 pdf로 변경할 필요가 있는 모든 사람들


<br/>

## 📷 간단한 이용방법

자세한 기능 보러 가기: https://www.notion.so/3cfcb7a2ad384461b3f863c3c548713b

1. 업로드할 이미지를 선택한다.
2. 페이지 당 첨부될 이미지 개수를 선택한다.
3. Play 아이콘 클릭하면 화면에 A4 사이즈의 페이지에 이미지가 첨부된 걸 확인한다. 
4. 필요시 이미지의 크기와 위치를 미세조정한다.
5. PDF로 변환한다. 

<br/>

## 💡 추가할 기능



1. 정렬 기능 : 모든 이미지를 왼쪽 혹은 오른쪽으로 정렬할 수 있는 기능 
2. Line 표시 : 각 페이지에 중앙선을 넣거나 빼는 기능 
3. 글 추가 : 페이지에 원하는 글 입력 기능
4. 번호 표시 : 이미지의 번호를 표시할 수 있는 기능 

<br/>


## ✏️ 개발 

- 개발 언어 : typescript
- 개발 라이브러리 : html2pdf.js
- 형상 관리 : git
- 디자인 : Figma

## 🛠 프로젝트 구조



```
src
 ┣ @types
 ┃ ┗ index.d.ts
 ┣ common
 ┃ ┗ constant.ts
 ┣ components
 ┃ ┣ buttons
 ┃ ┃ ┣ type
 ┃ ┃ ┃ ┣ move.ts
 ┃ ┃ ┃ ┣ size.ts
 ┃ ┃ ┃ ┗ zoom.ts
 ┃ ┃ ┗ button.ts
 ┃ ┣ page
 ┃ ┃ ┣ base
 ┃ ┃ ┃ ┗ base.ts
 ┃ ┃ ┣ dialog
 ┃ ┃ ┃ ┗ dialog.ts
 ┃ ┃ ┣ image
 ┃ ┃ ┃ ┗ img.ts
 ┃ ┃ ┣ page.ts
 ┃ ┃ ┣ pageLeft.ts
 ┃ ┃ ┗ pageRight.ts
 ┃ ┗ pagination
 ┃ ┃ ┗ pagination.ts
 ┣ custom
 ┃ ┣ funtions.ts
 ┃ ┗ types.ts
 ┣ images
 ┃ ┗ spinner.png
 ┣ style
 ┃ ┣ css
 ┃ ┃ ┣ style.css
 ┃ ┃ ┗ style.css.map
 ┃ ┗ scss
 ┃ ┃ ┣ _reset.scss
 ┃ ┃ ┗ style.scss
 ┣ app.ts
 ┗ index.html
```

<br/>

## 📦 이용한 패키지 

| 이름        | 목적                     |
| ----------- | ------------------------ |
| html2pdf.js | html을 pdf로 변환시 사용 |

