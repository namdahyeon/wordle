/* 규칙!!
1. 5글자 단어 (존재하는 단어가 아니어도 됌)
2. 6번의 시도 가능
3. 존재하면 노랑, 위치도 맞으면 초록으로 표시
4. 게임 종료 판다
(추가) 상단에 게임 시간 표시
(선택) 키보드에도 동일하게 표시
(선택) 키보드 클릭으로도 입력
*/

// const 정답 = 'BRAVE';

let attempts = 0;
let index = 0;
let timer = 0;

function appStart(){
   const displayGameover = () => {
      const div = document.createElement("div");
      div.innerText = '게임이 종료됐습니다.';
      div.style = 'display:flex; justify-content:center; align-items:center; position:absolute; top:42vh; left:50vw; transform:translateX(-50%); background-color:#333; padding:20px 40px; border-radius:30px; font-size:14px; font-weight:600; color:#fff;';
      document.body.appendChild(div);
   }

   const gameover = () => {
      window.removeEventListener("keydown", handleKeydown);
      // .removeEventListener(): event를 지워준다.
      displayGameover();
      clearInterval(timer); // clearInterval(): setInterval의 반복 작업 취소.
   }

   const nextLine = () => {
      if(attempts === 5) return gameover();
      attempts++;
      index = 0;
   }

   const handleEnterKey = async() => {
      let 맞은_갯수 = 0;

      // 서버에서 정답을 받아오는 코드
      const 응답 = await fetch('/answer');
      const 정답 = await 응답.json();
      // await 사용하는 이유: 서버에서 응답이 올 때까지 기다리고 실행.

      for(let i = 0; i < 5; i++){
         const block = document.querySelector(
            `.board-block[data-index='${attempts}${i}']`
         );
         const 입력한_글자 = block.innerText;
         const 정답_글자 = 정답[i];

         if(입력한_글자 === 정답_글자) {
            맞은_갯수++;
            block.style.background = '#6aaa64';
         }
         else if(정답.includes(입력한_글자)) block.style.background = '#c9b458';
         // .includes() : 텍스트 안에 해당 문자가 포함되어 있는지 확인. 값: true & false
         else block.style.background = '#787c7e';
         block.style.color = 'white';
         // console.log("입력한 글자: ", 입력한_글자, "정답_글자: ", 정답_글자);
      }

      block = document.querySelector(`.row-${attempts}`);
      if(맞은_갯수 === 5) {
         block.classList.add('success');
         gameover();
      }else{
         block.classList.add('fail');
         nextLine();
      };
   };

   const handleBackspace = () => {
      if (index > 0){
         const prevBlock = document.querySelector(
            `.board-block[data-index='${attempts}${index - 1}']`
         );
         prevBlock.innerText = '';
      }
      if(index !== 0) index--;
   }

   const handleKeydown = (e) => {
      console.log(e.key, e.keyCode);

      const key = e.key.toUpperCase(); // .toUpperCase(): 대문자 변환
      const keyCode = e.keyCode;
      const thisBlock = document.querySelector(
         `.board-block[data-index='${attempts}${index}']`
      );
      
      if(e.key === 'Backspace') handleBackspace();
      else if(index === 5){
         if(e.key === "Enter") handleEnterKey();
         else return
      }else if(65 <= keyCode && keyCode <= 90){
         thisBlock.innerText = key;
         index++;
      }
   }

   const handleKeyclick = (e) => {
      console.log(e.srcElement.dataset.key);

      const key = e.srcElement.dataset.key;
      const thisBlock = document.querySelector(
         `.board-block[data-index='${attempts}${index}']`
      );
      if(key === 'BACK') handleBackspace();
      else if(key === "ENTER"){
         if(index === 5) handleEnterKey();
         else return
      }else if(key){
         if (index < 5){
            thisBlock.innerText = key;
            index++;
         }
      }else return
   }

   const startTimer = () => {
      const 시작_시간 = new Date();

      function setTime(){
         const 현재_시간 = new Date();
         const 흐른_시간 = new Date(현재_시간 - 시작_시간);
         const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
         const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
         const timeH1 = document.querySelector("#timer");
         timeH1.innerText = `${분}:${초}`;
      }

      // 주기성
      timer = setInterval(setTime, 1000);
   }
   startTimer();
   window.addEventListener("keydown", handleKeydown);
   window.addEventListener("click", handleKeyclick);
}
appStart();