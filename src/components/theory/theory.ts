// import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// function App() {
//   // useState => Hooks
//   // useState는 React에서 가장 기본적인 훅(Hook), 함수 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다.
//   // => 이 함수가 호출되면 배열 반환
//   // => 반환된 배열의 첫 요소는 상태 값, 두 번째 요소는 상태 값을 설정하는 함수
//   // => useState 함수의 파라미터(매개변수)에는 상태의 기본값, 초기값을 넣어 준다.

//   const [value, setValue] = useState<number>(0);
//   const [name, setName] = useState<string>("Not Empty");
//   const [nickname, setNickname] = useState<string>("Not Empty");

//   const increment = () => setValue(value + 1);
//   const decrement = () => setValue(value - 1);

//   const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setName(event.target.value);
//   };
//   const onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNickname(event.target.value);
//   };
//   return (
//     <div>
//       <p>
//         현재 카운터 값은: <b>{value}</b>
//       </p>
//       <button onClick={increment}>+1</button>
//       <button onClick={decrement}>-1</button>

//       <div>
//         <input type="text" value={name} onChange={onChangeName} />
//         <input type="text" value={nickname} onChange={onChangeNickname} />
//       </div>

//       <div>
//         <b>이름: {name}</b>
//         <b>닉네임: {nickname}</b>
//       </div>
//     </div>
//   );
// }
//
// export default App;

// function App() {
//   // useEffect => Hooks
//   // useEffect는 React 컴포넌트가 렌더링 될 때마다 특정 작업을 수행하도록 설정할 수 있는 훅(Hook)

//   // - 마운트가 될 때, 최초 1회 실행하고 싶을 떄
//   // 마운트: React DOM에 return 키워드 하단에 작성한 HTML, CSS 영역, 즉 UI가 붙었을 때 => 우리가 HTML을 JS로 통제 가능할 때
//   // useEffect에서 설장한 함수를 컴포넌트가 화면에 맨 처음 렌더링 될 때만 실행하고
//   // 업데이트 될 때는 실행하지 않으려면, 함수에 두 번째 파라미터(매개변수)로 빈 배열을 넣어주면 됩니다.

//   // - 특정 값이 업데이트 될 때만 실행하고 싶을 때
//   // useEffect를 사용할 떄, 특정 값이 변경될 때만 호출하고 싶은 경우
//   // useEffect의 두 번째 파라미터(매개변수)로 전달되는 배열 안에 검사하고 싶은 값을 넣어주면 된다.

//   const [name, setName] = useState<string>("");
//   const [nickname, setNickname] = useState<string>("");

//   // useEffect(() => {
//   //   // 해당 컴포넌트가 최초 렌더링 될 때 useEffect가 실행,
//   //   // 우리가 선언한 state 즉, 상태 값이 변화하더라도 useEffect가 실행되는 것으로 보아
//   //   // state 즉, 상태 값이 변화하면 해당 컴포넌트는 재랜더링이 된다는 것을 알 수 있다.
//   //   console.log("컴포넌트가 렌더링 될 때마다 특정 작업 수행.");
//   //   console.log("name:", name);
//   //   console.log("nickname:", nickname);
//   // });

//   useEffect(() => {
//     console.log("마운트가 될 때만 수행: 최초 1회 실시");
//     console.log("name:", name);
//     console.log("nickname:", nickname);
//   }, []);

//   useEffect(() => {
//     console.log("name이라는 상태 값이 변할 경우에만 수행");
//     console.log("name:", name);
//     console.log("nickname:", nickname);
//   }, [name]);

//   // App.tsx 컴포넌트가 unmount 될 때
//   useEffect(() => {
//     console.log("뒷 정리하기");
//     console.log("updated name:", name);

//     return () => {
//       console.log("cleanup");
//       console.log(name);
//     };
//   }, [name]);

//   const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) =>
//     setName(event.target.value);
//   const onChangeNickname = (event: React.ChangeEvent<HTMLInputElement>) =>
//     setNickname(event.target.value);

//   return (
//     <div>
//       <input type="text" value={name} onChange={onChangeName} />
//       <input type="text" value={nickname} onChange={onChangeNickname} />

//       <div>
//         <b>이름: {name}</b>
//         <b>닉네임: {nickname}</b>
//       </div>
//     </div>
//   );
// }

// export default App;

// function Timer() {
//   const [count, setCount] = useState<number>(0);

//   useEffect(() => {
//     const id = setInterval(() => {
//       console.log("Interval 실행");
//       setCount((c) => c + 1);
//     }, 1000);

//     return () => {
//       console.log("cleanup: 이전 타이머 제거");
//       clearInterval(id);
//     };
//   }, []);

//   return <div>카운트: {count}</div>;
// }

// export default function App() {
//   const [visible, setVisible] = useState<boolean>(true);

//   return (
//     <div>
//       {visible && <Timer />}
//       <button onClick={() => setVisible(!visible)}>
//         {visible ? "숨기기" : "보이기"}
//       </button>
//     </div>
//   );
// }

// const getAverage = (numbers: number[]) => {
//   console.log("평균 값 계산 중");

//   if (numbers.length === 0) return 0;

//   const sum = numbers.reduce((acc, cur) => acc + cur, 0);
//   return sum / numbers.length;
// };

// function App() {
//   // useCallback: useMemo와 유사한 훅(Hook), 특정 함수를 메모이제이션하여 컴포넌트가 렌더링 될 때마다 동일한 함수 인스턴스를 반환하도록 하는 훅
//   // 주로 렌더링 성는 최적화 목적으로 사용
//   // 이 훅을 사용해 만들어 놓았던 함수를 재사용 할 수 있다.

//   // useCallback 파라미터: 생성하고 싶은 함수, 배열(어떤 값이 바뀌었을 때 함수를 새로 생성할지 결정하는 의존성 배열)

//   // onChange처럼 비어있는 배열을 넣게 되면, 컴포넌트가 렌더링 될 때, 만들었던 함수를 계속해서 재사용
//   // onInsert처럼 배열 안에 nmber와 list를 넣으면 input 내용이 바뀌거나 새로운 항목이 추가되었을 때 새로 만들어진 함수를 사용

//   const [list, setList] = useState<number[]>([]);
//   const [number, setNumber] = useState<string>(""); // => 실제 input 태그에 입력된 숫자를 list 배열에 주입할 것, 상태값은 number이지만, input 태그에 입력된 값은 문자열이므로 string 타입으로 선언

//   const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     setNumber(event.target.value);
//   }, []); // 컴포넌트가 처음 렌더링 될 때만 함수 생성

//   const onInsert = useCallback(() => {
//     const newList = list.concat(parseInt(number)); // => parseInt() 함수를 사용하여 문자열을 숫자로 변환
//     // concat: Array instance의 메서드, 두 개 이상의 배열 병합, 기존 배열 변경 없이 새 배열 반환
//     // parseInt: 문자열 인자를 파싱 > 특정 진수의 정수 반환
//     setList(newList); // number[]
//     setNumber(""); // => input 태그에 입력된 숫자를 초기화
//   }, [list, number]); // list 또는 number가 변경될 때마다 함수를 새로 생성

//   // useCallback은 첫 렌더링 때 한 번만 함수 onInsert 생성 ([])
//   // onInsert 안에서 사용되는 list, number는 초기값의 복사본으로 함수에 닫혀있다. (closed over)
//   // 이후 number, list가 변경되어도, onInsert는 옛날 값을 계속 사용

//   // 이게 클로저(closure) 문제 => useCallback의 의존성 배열에 list와 number를 넣어주면, list 또는 number가 변경될 때마다 새로운 onInsert 함수가 생성되고, 이 함수는 최신의 list와 number 값을 참조하게 된다.

//   const average = useMemo(() => getAverage(list), [list]); // => list 배열이 변경될 때마다 getAverage 함수가 호출되어 평균 값이 계산되고, 그 결과가 average 변수에 저장
//   // 의존성 주입: useMemo의 두 번째 파라미터(매개변수), 배열 안에 list를 넣어주면, list 배열이 변경될 때마다 getAverage 함수가 호출되어 평균 값이 계산되고, 그 결과가 average 변수에 저장
//   // 이를 통해 불필요한 계산을 방지할 수 있다. list 배열이 변경되지 않는 한, getAverage 함수는 호출되지 않으므로, 성능 최적화에 도움이 된다.

//   return (
//     <div>
//       <input type="text" value={number} onChange={onChange} />
//       <button onClick={onInsert}>등록</button>

//       <ul>
//         {list.map((item: number, index: number) => {
//           return <li key={index}>{item}</li>;
//         })}
//       </ul>

//       <div>
//         <b>평균 값: {average}</b>
//       </div>
//     </div>
//   );
// }

// export default App;

// function App() {
//   // useRef
//   // 함수 컴포넌트에서 ref라는 속성을 쉽게 사용할 수 있도록 도와주는 훅(Hook)
//   // React의 useRef는 컴포넌트 내에서 변하지 않는 값을 유지하거나 DOM 요소에 직접 접근할 때 사용하는 훅(Hook)
//   // 다른 React Hook과 목적이 다름

//   // useRef는 값을 저장하거나 DOM에 접근하기 위해 사용하는 객체(참조값)을 생성하는 훅
//   // 저장된 값은 컴포넌트가 리렌더링되어도 유지, 값이 바뀌어도 리렌더링을 일으키지 않는다.

//   // ref 속성은 JSX, TSX에서 요소나 컴포넌트에 참조를 연결하는 역할
//   // App 컴포넌트에서 등록 버튼을 눌렀을 때, 포커스가 인풋 태그 쪽으로 넘어가도록 코드를 작성해보자.

//   const inputElement = useRef<HTMLInputElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleClick = () => {
//     // useRef 동작
//     inputElement.current?.focus();
//     fileInputRef.current?.click();
//   };

//   return (
//     <div>
//       <input type="text" ref={inputElement} />
//       <input type="file" ref={fileInputRef} />
//       <button onClick={handleClick}>등록</button>
//     </div>
//   );
// }

// export default App;

// 컴포넌트
// 프론트엔드 개발에서 컴포넌트(Component)는 웹 애플리케이션의 UI를 구성하는 독립적이고 재사용 가능한 코드 조각(모음)

// 보통 HTML, CSS, JS를 포함, 특정 기능이나 디자인 담당
// 컴포넌트를 사용해서 애플리케이션의 복잡성을 줄이고, 쉽게 유지보수 할 수 있으므로 현대 웹 개발에서 필수적인 개념

// 컴포넌트 장점

// 1. 코드의 재사용성(재활용성)
// 같은 컴포넌트를 여러 영역에서 활용 가능, 코드 중복 방지, 효율성 증가
// 특히 전통적인 MPA(Multi Page Application) 구조에서는 각 페이지가 독립적으로 동작하기 때문에, 공통되는 레이아웃이나 UI 코드를 반복해서 작성하는 경우가 많았다.
// 반면, 컴포넌트 기반 개발 방식에서는 이러한 공통 요소를 하나의 컴포넌트로 만들어 재사용할 수 있으므로 유지보수가 쉬워지고 개발 속도도 빨라진다.

// 2. 상태 관리
// 컴포넌트 내부 상태(state)와 로직은 이부에 노출되지 않아 독립성이 유지
// HTML이나 CSS는 고정된 틀이지만, 그 안에서 다루는 데이터는 동적으로 변할 수 있다.
// 컴포넌트는 이런 변화를 유연하게 처리할 수 있도록 설계되어 있으며 주로 내부 상태를 활용하거나 상위 컴포넌트로부터 전달받은 값(props)를 통해 동작

// 3. 확장성
// 여러 개의 컴포넌트를 조합해 더 복잡한 UI 구성 가능
// 예를 들어, 버튼(Button), 입력 필드(Input Field), 카드(Card) 등 작은 단위 컴포넌트를 조합해 폼, 레이아웃, 페이지 등을 만들 수 있다.
// 쉽게 말해, 컴포넌트 + 컴포넌트 = 새로운 컴포넌트가 되는 방식으로, 개발자는 작은 단위의 컴포넌트를 만들어 조합하여 복잡한 UI를 구축할 수 있다.

// Props
// Props는 React에서 부모(상위) 컴포넌트에서 자식(하위) 컴포넌트로 데이터를 전달하는 메커니즘
// 부모 컴포넌트가 정의한 데이터를 자식 컴포넌트에게 전달하여, 컴포넌트 간 데이터 흐름을 효율적으로 관리 가능

// Props의 2가지 규칙
// 1. 단방향 데이터 흐름(one-way data flow): 항상 부모 -> 자식으로만 전달
// 자식 컴포넌트는 전달받은 데이터 직접 수정 불가
// 2. 읽기 전용(Readonly): props는 자식 컴포넌트에서 수정 불가, 조회와 출력에만 사용

// 이러한 규칙 덕분에 데이터 흐름 예측 가능, 애플리케이션 구조가 명확해져 유지보수가 쉬워짐
// 단, Props의 깊이(Depth)가 깊어지면, 데이터 추적이 어려움

// 위와 같은 문제 때문에, 중앙 집중식 상태 관리 라이브러리인 Redux, Redux Toolkit, Recoil, Jotai, Zustand 등이 탄생
// 공통적으로 사용되는 즉, 전역적으로 사용되는 상태(state), 액션(action)의 묶음을 관리하거나 혹은 개별적으로 관리 가능
