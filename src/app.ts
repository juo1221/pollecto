/// <reference types="webpack/module" />
console.log(import.meta.webpack);
import "../style/css/style.css";

if (module.hot) {
  console.log("핫모듈!");
  // module.hot.accept("./result", async () => {
  //   // 감지하고자 하는 모듈을 첫번째 인자로 등록
  //   console.log("result 모듈 변경됨");
  //   resultEl.innerHTML = await result.render();
  // });
}

console.log("hihihihihihi");
