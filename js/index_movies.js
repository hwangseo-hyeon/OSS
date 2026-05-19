const MOVIES = [
    { image: 'pokemon_diancie.webp', title: '파괴의 포켓몬 디안시', price: 14000, synopsis: '지하 깊숙이 위치한 다이아몬드 광산국. 보석포켓몬 멜리시들이 평화롭게 살아가는 나라의 에너지원인 신성한 다이아가 사라지려 한다. 공주 디안시는 지우와 피카츄와 함께 생명의 포켓몬 제르네아스를 찾는 여행을 시작하지만, 파괴의 포켓몬 이벨타르가 그들을 기다리고 있다.' },
    { image: 'volcanion.webp', title: '볼케니온과 기계왕국의 마기아나', price: 14000, synopsis: '여행 중 하늘에서 떨어진 환상의 포켓몬 볼케니온. 인간을 싫어하는 그는 지우와 사슬에 묶인 채 아조트왕국으로 향한다. 인조포켓몬 마기아나를 노리는 악당에 맞서, 지우와 볼케니온이 힘을 합쳐 구출에 나선다.' },
    { image: 'kungfupanda3.webp', title: '쿵푸팬더3', price: 16000, synopsis: '포는 친아버지 리와 재회하고, 악당 카이가 쿵푸 마스터들의 영혼을 빼앗아 세계를 정복하려 한다. 팬더들의 치유의 기만이 카이를 막을 수 있다는 사실을 알게 된 포는 비밀의 팬더 마을로 향한다.' },
    { image: 'howtotrain_dragon2.webp', title: '드래곤 길들이기2', price: 15000, synopsis: '청년이 된 히컵은 족장이 되기보다 넓은 세상을 보고 싶어 한다. 신비한 얼음 대륙 탐험 중 드래곤 사냥꾼의 덫에 걸리고, 드래곤들을 위협하는 어둠의 존재에 맞서기로 결심한다.' },
    { image: 'wonka.webp', title: '웡카', price: 15000, synopsis: '초콜릿 메이커 윌리 웡카는 달콤 백화점에 가게를 열 꿈을 품는다. 숙박비 빚과 초콜릿 카르텔의 견제, 움파룸파의 등장까지—세계 최고의 초콜릿 메이커가 되는 길은 험난하다.' },
    { image: 'exit.webp', title: '엑시트', price: 14000, synopsis: '취업에 실패한 용남은 어머니 칠순 잔치에서 후배 의주를 만난다. 잔치가 한창일 때 빌딩에서 유독가스가 퍼지고, 산악 동아리 시절의 체력과 스킬로 탈출을 시도한다.' },
    { image: 'summerwars.webp', title: '썸머워즈', price: 14000, synopsis: 'OZ는 전 세계가 아바타로 살아가는 사이버 가상 세계다. OZ 관리 아르바이트를 하던 겐지는 시스템 마비 메시지를 받고, 가상 세계의 혼란이 현실의 위기가 되자 세계를 구하기 위한 모험에 떠난다.' },
    { image: 'weathering_with_you.webp', title: '날씨의 아이', price: 15000, synopsis: '비가 그치지 않던 여름, 도쿄로 온 가출 소년 호다카는 비를 멈추게 하는 소녀 히나를 만난다. 히나의 능력으로 돈을 벌 계획을 세우지만, 그 힘에는 대가가 따른다.' },
    { image: 'your_name.jpg', title: '너의 이름은', price: 16000, synopsis: '도쿄의 소년 타키와 시골의 소녀 미츠하. 어느 날 서로의 몸이 바뀐 채 하루를 살게 되고, 반복되는 바뀜 속에서 두 사람은 특별한 인연임을 깨닫는다.' },
    { image: 'roundup2.jpg', title: '범죄도시2', price: 16000, synopsis: '가리봉동 소탕 4년 후, 금천서 강력반은 베트남 도주 용의자 인도 임무를 받는다. 마석도와 전일만 반장은 무자비한 악행의 강해상을 쫓아 한국과 베트남을 오간다.' },
    { image: 'wailing.webp', title: '곡성', price: 16000, synopsis: '외지인이 나타난 뒤 연쇄 사건으로 마을이 발칙해진다. 경찰 종구는 목격자 무명을 만나 의심을 키우고, 딸 효진이 같은 증상으로 아프자 외지인과 무속인 일광을 불러들인다.' },
    { image: 'how_do_you_live.jpg', title: '그대들은 어떻게 살것인가', price: 15000, synopsis: '11살 소년 마히토가 돌아가신 엄마의 고향에서 파란 털의 왜가리를 만난다. 미스터리한 탑으로 유도되는 왜가리를 따라 이세계로의 모험이 시작된다.' },
    { image: 'harrypotter.jpg', title: '해리포터와 죽음의 성물 2부', price: 17000, synopsis: '해리 일행은 마지막 호크룩스를 찾아 호그와트로 돌아온다. 볼드모트가 호그와트를 향하자 마법사들의 전쟁이 시작되고, 해리는 최종 결전의 실마리를 얻는다.' },
    { image: 'exhuma.webp', title: '파묘', price: 16000, synopsis: '기이한 병이 대물림되는 집안의 의뢰를 받은 무당 화림. 무속인 봉길, 풍수사 상덕, 장의사 영근과 함께 불길한 묘를 파내다 끔찍한 진실과 마주한다.' },
    { image: 'baker_street.webp', title: '베이커가의 망령', price: 15000, synopsis: '가상현실 게임 코쿤 시연회에 초대된 코난 일행. 인공지능 노아의 방주가 시스템을 점령하자, 코난은 셜록 홈즈의 영국을 배경으로 한 게임 속에서 잭 더 리퍼를 추적한다.' },
    { image: 'mononoke.webp', title: '모노노케: 우주망령', price: 15000, synopsis: '정념이 소용돌이치는 오오쿠. 신입 시녀 아사와 카메가 의식에 참여하며 사건을 겪고, 축적된 여인들의 정념 속에서 약장수 모노노케가 퇴마의 의식을 시작한다.' },
    { image: 'roundup1.webp', title: '범죄도시1', price: 18000, synopsis: '괴력의 형사 마석도와 전일만 반장이 신흥 범죄조직 보스 장첸을 일망타진한다. 형사·주민 합동 작전과 함께 마석도와 장첸의 일대일 격돌이 펼쳐진다.' },
    { image: 'parasite.webp', title: '기생충', price: 18000, synopsis: '반지하에 사는 기택 가족에게 기회가 찾아온다. 아들 기우가 부잣집 과외를 맡게 되며, 극과 극의 두 가족 사이 예측 불가능한 만남이 시작된다.' },
    { image: 'new_world.webp', title: '신세계', price: 17000, synopsis: '범죄 조직 골드문에 잠입한 경찰 자성. 실권자 정청을 깊이 신뢰하는 그는 조직과 경찰 사이에서 갈등에 빠진다.' },
    { image: 'demonslayer.webp', title: '귀멸의 칼날: 무한성 편', price: 16000, synopsis: '혈귀 무잔의 본거지 무한성으로 소환된 귀살대와 탄지로 일행. 상현 혈귀들과 맞서 목숨을 건 최종 결전이 벌어진다.' },
    { image: 'seoul_station.jpg', title: '서울역', price: 15000, synopsis: '서울역에서 피를 흘리던 노숙자가 좀비가 된다. 가출한 혜선과 아버지, 기웅은 여관에서 도망치다 서울 전역으로 바이러스가 퍼진다.' },
    { image: 'king_of_pigs.webp', title: '돼지의 왕', price: 15000, synopsis: 'CEO 경민이 아내를 살해한 뒤 15년 만에 동창 종석을 찾아온다. 중학교 시절 집단괴롭힘의 희생자였던 두 사람의 과거가 다시 드러난다.' },
    { image: 'paprika.webp', title: '파프리카', price: 15000, synopsis: '꿈 속으로 접속해 환자를 치료하는 치바 아스코 박사. 의료 기기가 도난당하자, 악의 세력에 맞서 사람들의 무의식을 지키기 위한 모험이 펼쳐진다.' },
    { image: 'salmokji.webp', title: '살목지', price: 17000, synopsis: '저수지 살목지 로드뷰에 정체불명의 형체가 포착된다. 촬영을 위해 향한 PD 수인과 팀은 설명되지 않는 공포에 빠지고, 살아서는 못 나온다는 소문이 현실이 된다.' }
];

function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function renderNowShowing() {
    const container = document.getElementById('movie-scroll');
    if (!container) return;

    const selected = shuffleArray(MOVIES).slice(0, 13);
    container.innerHTML = selected.map((movie, index) => `
        <article class="movie-card" data-index="${index}">
            <div class="movie-poster">
                <img src="images/${movie.image}" alt="${movie.title}">
            </div>
            <h3 class="movie-title">${movie.title}</h3>
            <button type="button" class="btn-book" data-index="${index}">예매하기</button>
        </article>
    `).join('');

    container.querySelectorAll('.btn-book').forEach((btn) => {
        btn.addEventListener('click', () => {
            const movie = selected[parseInt(btn.dataset.index, 10)];
            openMovieModal({
                id: movie.image,
                title: movie.title,
                price: movie.price,
                posterSrc: `images/${movie.image}`,
                synopsis: movie.synopsis,
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectMovieModal();
    renderNowShowing();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMovieModal();
    });
});
