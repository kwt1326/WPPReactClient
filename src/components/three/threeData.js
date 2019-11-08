import aquaS1 from '../../image/skybox/aqua_side1.png';
import aquaS2 from '../../image/skybox/aqua_side2.png';
import aquaS3 from '../../image/skybox/aqua_side3.png';
import aquaS4 from '../../image/skybox/aqua_side4.png';
import aquaT from '../../image/skybox/aqua_top.png';
import aquaB from '../../image/skybox/aqua_bottom.png';

const tableData = [
    // introduce 1/3
    `
      <p><h2>< 개발에 대해 임하는 마음가짐 ></h2></p>
      <p>
        개발은 누구나 시작 할 수 있지만, 누구나 계속하기는 쉽지 않습니다.
      어떤 개발 기술을 새롭게 접할 때, 흥미를 느끼는 사람과 거부감을 느끼는 사람이 있습니다.
      직원을 뽑을 때 경험이 많으면 좋지만, 그 경험이 가득 차 있을지, 비어있는 경력일지 판단하기 쉽지 않습니다.
      그렇다면, 정말 코딩을 늘 새로운 마음으로, 신기술의 도입을 두려워 하지 않고, 흥미를 가지고
      배우고자 하는 생각을 가진 사람이 직원으로 있어야 하지 않을까요?
      </p>
      <p>- 1 -</p>
      `,
      // introduce 2/3
      `
      <p>
        1년 7개월의 경력동안, 웹개발을 많이 하지는 않았습니다. javascript를 주로 사용 하긴 했지만,
      pure 한 html 기반으로 프론트 작업을 했었죠. 하지만 본격적으로 웹개발을 스스로 독학으로 공부하면서
      경험하지 못했던 것들을 터득하며 재미가 붙기 시작 했습니다. 아무도 알려줄 사람이 없었지만,
      책과 인터넷 강의를 어느 정도 보다 보니, 굳이 학원을 가지 않아도 새로운 기술을 얼마든지
      이해하고 사용할 수 있다는 자신감이 생겼습니다. 
      </p>
      <p>- 2 -</p>
      `,
      // introduce 3/3
      `
      <p>
        저는 다양한 기술을 익히는 것을 좋아합니다. 만능 엔터테이너를 꿈꾸는 사람이 이런 느낌일지도 모릅니다.
      그래서, 누구나 탐내고 필요로 하는 인재가 되고 싶습니다. 아직 경험하지 못한 기술도, 지금 익히고 있는 기술도
      모두 능숙하게 다루고 싶은 만큼 욕심이 많습니다. 코딩에 관해서 서로 정중하게, 그리고 열정적으로 많이많이 
      얘기하고 같이 익히고 성장하고 싶습니다. 보잘것 없는 글이지만 읽어주신 모든 분께 감사드립니다.
      </p>
      <p>- 3 -</p>
      `,
    // skills
      `
      <div class="btn-style" style="font-size:60px; margin:10px;">Skills</div>
      <div class="css3d-flex">
      <span class="btn-style css3d-flex-child" data-level="Intermediate">JavaScript</span>        <div class="btn-style css3d-flex-child" data-level="Intermediate">Node.js</div>          <div class="btn-style css3d-flex-child" data-level="begginer to Intermediate">React</div> 
      <span class="btn-style css3d-flex-child" data-level="Intermediate">Heroku Platform</span>    <div class="btn-style css3d-flex-child" data-level="Intermediate">Netlify Platform</div><div class="btn-style css3d-flex-child" data-level="Intermediate">Three.js</div>
      </div>
      <div class="css3d-flex">
      <div class="btn-style css3d-flex-child" data-level="begginer">MySql</div>               <div class="btn-style css3d-flex-child" data-level="Intermediate">Windows MFC</div>      <div class="btn-style css3d-flex-child" data-level="begginer to Intermediate">Unity</div> 
      <div class="btn-style css3d-flex-child" data-level="Intermediate">Sequelize ORM</div> <br/> <div class="btn-style css3d-flex-child" data-level="begginer to Intermediate">Win32api</div>         <div class="btn-style css3d-flex-child" data-level="Intermediate">Express</div>
      </div>
      <div class="css3d-flex">
      <div class="btn-style css3d-flex-child" data-level="Intermediate">C++</div>                 <div class="btn-style css3d-flex-child" data-level="begginer to Intermediate">C#</div>                  
      <div class="btn-style css3d-flex-child" data-level="Intermediate">Netlify Platform</div>    <div class="btn-style css3d-flex-child" data-level="begginer to Intermediate">Sequelize ORM</div> <br/>
      <div class="btn-style css3d-flex-child" data-level="begginer">Ubuntu Linux</div>
      </div>
      <div class="css3d-flex">
      <div class="btn-style css3d-flex-child" data-level="Intermediate">Ogre 3D</div>
      </div>
      `,
    // career (1/2)
      `
      <p><h2>< 이력사항 ></h2></p>
      <ul>
        2017.8 ~ 2017.10 - 졸업작품 제작 및 교내 전시전 수상 경력
        <li>[ C#(scripting) + Unity3D ] 1인칭 3D 던전 탐험 게임</li>
        2017.12 ~ 2019.7 - (1 year 8 month) Avrosoft Korea 근무 (사원)
        <li>[ javascript(with JQuery) + Three.js + Html5 ] 서울기록관 관제시스템 프로젝트 단독 수행</li>
        <li>[ C#(UI) + C++(DLL + UI) ] 3D 건물 모델링 시스템 기능 추가 및 유지보수</li>
        <li>[ C++ + MFC ] 3D 건물 모델링 시스템 C++ Only 버전으로 새로 제작</li>
        <p>- 1 -</p>
        `,
    // career (2/2)
        `
        <li>[ Ogre3D ] C++ 솔루션 VS2010 -> VS2015 Migration 경험 (CMake 등을 이용한 라이브러리 빌드, 추가 및 제거 등)</li>
        <li>[ Inno Setup ] 설치파일 제작시 Pascal 언어 이용해 커스터마이징 스트립팅 경험</li>
        <li>[ Ogre3D, Assimp, xtreme toolkit, tinyxml... ] C++ 주요 업무 사용 라이브러리</li>
        <li>[ JQuery, Three.js, gulp... ] Web 주요 업무 사용 라이브러리</li>
        2019.09 ~ currently - Web JS full-stack 이직을 위한 공부 및 경량 포트폴리오
      </ul>
      <p>- 2 -</p>
      `,
];

const skybox = [ aquaS1, aquaS2, aquaS3, aquaS4, aquaT , aquaB ];

export {
    skybox,
    tableData
}