// HTML 문서에서 필요한 요소들을 가져오기
const character = document.querySelector('.character');
const levelUpBtn = document.getElementById('levelUpBtn');
const altitudeValue = document.getElementById('altitudeValue');
const nextGoalText = document.getElementById('nextGoalText');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const achievementPopup = document.getElementById('achievementPopup');
const achievementTitle = document.getElementById('achievementTitle');
const achievementTextEl = document.getElementById('achievementText');

// 게임 상태
let currentAltitude = 0;
let level = 1;

// 목표 고도 정의 (미터)
const milestones = [
    { altitude: 1000, name: "구름층 돌파", reward: "☁️ 첫 번째 도전 완료!" },
    { altitude: 5000, name: "중간권 진입", reward: "🌤️ 높은 곳에 도달했네요!" },
    { altitude: 10000, name: "성층권 돌파", reward: "✈️ 비행기와 같은 고도!" },
    { altitude: 20000, name: "오존층 접근", reward: "🛡️ 지구의 보호막 근처!" },
    { altitude: 50000, name: "중간권 진입", reward: "🌌 거의 우주예요!" },
    { altitude: 100000, name: "우주 경계선", reward: "🚀 카르만 라인 돌파!" },
    { altitude: 200000, name: "저궤도", reward: "🛰️ 인공위성 영역!" },
    { altitude: 400000, name: "국제우주정거장", reward: "🏠 우주에서 살 수 있어요!" },
    { altitude: 1000000, name: "달 궤도", reward: "🌙 달까지 갈 수 있어요!" }
];

// 현재 목표 찾기
function getCurrentGoal() {
    return milestones.find(milestone => milestone.altitude > currentAltitude) || milestones[milestones.length - 1];
}

// 진행률 업데이트
function updateProgress() {
    const currentGoal = getCurrentGoal();
    const previousGoal = milestones.find(m => m.altitude <= currentAltitude);
    const previousAltitude = previousGoal ? previousGoal.altitude : 0;
    
    const progress = ((currentAltitude - previousAltitude) / (currentGoal.altitude - previousAltitude)) * 100;
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    
    // UI 업데이트
    altitudeValue.textContent = `${currentAltitude.toLocaleString()}m`;
    nextGoalText.textContent = `다음 목표: ${currentGoal.name} (${currentGoal.altitude.toLocaleString()}m)`;
    progressFill.style.width = `${clampedProgress}%`;
    progressText.textContent = `${Math.round(clampedProgress)}%`;
}

// 성취 달성 체크 및 알림
function checkAchievements() {
    const achievedMilestone = milestones.find(milestone => 
        milestone.altitude <= currentAltitude && 
        milestone.altitude > (currentAltitude - getAltitudeGain())
    );
    
    if (achievedMilestone) {
        showAchievement(achievedMilestone);
        // 배경 변화 효과
        updateBackgroundForAltitude();
    }
}

// 성취 알림 표시
function showAchievement(milestone) {
    achievementTitle.textContent = `🎉 ${milestone.name} 달성!`;
    achievementTextEl.textContent = milestone.reward;
    achievementPopup.classList.add('show');
    
    // 축하 사운드
    playCelebrationSound();
    
    // 3초 후 자동으로 숨김
    setTimeout(() => {
        achievementPopup.classList.remove('show');
    }, 3000);
}

// 고도에 따른 상승량 계산 (레벨이 높을수록 더 많이 상승)
function getAltitudeGain() {
    return Math.floor(100 + (level * 50) + Math.random() * 200);
}

// 버튼에 'click' 이벤트가 발생했을 때 실행할 함수를 연결
levelUpBtn.addEventListener('click', () => {
    // 캐릭터에 'fly' 클래스가 이미 있다면 중복 실행을 막음
    if (character.classList.contains('fly')) {
        return;
    }

    // 레벨 업 사운드 효과
    playLevelUpSound();
    
    // 고도 상승
    const altitudeGain = getAltitudeGain();
    currentAltitude += altitudeGain;
    level++;
    
    // 버튼 텍스트 업데이트
    levelUpBtn.textContent = `+${altitudeGain}m 상승 중... 🚀`;
    levelUpBtn.disabled = true;

    // 캐릭터에 'fly' 클래스를 추가하여 CSS 애니메이션을 시작
    character.classList.add('fly');

    // 애니메이션이 끝나는 시간(3000ms = 3s) 후에 실행
    setTimeout(() => {
        // 'fly' 클래스를 제거해서 캐릭터를 원래 상태로 되돌림
        character.classList.remove('fly');
        
        // 진행률 업데이트
        updateProgress();
        
        // 성취 확인
        checkAchievements();
        
        // 버튼 다시 활성화
        levelUpBtn.textContent = `목표를 향해 발사! 🚀`;
        levelUpBtn.disabled = false;
    }, 3000); 
});

// 고도에 따른 배경 변화
function updateBackgroundForAltitude() {
    const body = document.body;
    
    if (currentAltitude >= 100000) {
        // 우주 (검은색)
        body.style.background = 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #2a2a2a 100%)';
    } else if (currentAltitude >= 50000) {
        // 중간권 (어두운 파란색)
        body.style.background = 'linear-gradient(135deg, #0c0c2a 0%, #1a1a3e 25%, #16214e 50%, #0f3470 100%)';
    } else if (currentAltitude >= 20000) {
        // 성층권 (진한 파란색)
        body.style.background = 'linear-gradient(135deg, #1a1a4e 0%, #2a2a5e 25%, #26355e 50%, #1f4480 100%)';
    } else if (currentAltitude >= 10000) {
        // 대류권 상층 (파란색)
        body.style.background = 'linear-gradient(135deg, #2a2a6e 0%, #3a3a7e 25%, #36457e 50%, #2f5490 100%)';
    } else if (currentAltitude >= 5000) {
        // 구름층 (밝은 파란색)
        body.style.background = 'linear-gradient(135deg, #3a3a8e 0%, #4a4a9e 25%, #46559e 50%, #3f64a0 100%)';
    } else {
        // 기본 (어두운 우주)
        body.style.background = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)';
    }
}

// 간단한 레벨업 사운드 효과 생성 함수
function playLevelUpSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        oscillator1.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
        oscillator1.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
        
        gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator1.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('오디오 재생을 지원하지 않는 브라우저입니다.');
    }
}

// 축하 사운드 효과
function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 트럼펫 같은 축하 멜로디
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        
        notes.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
            
            oscillator.start(audioContext.currentTime + index * 0.15);
            oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
        });
    } catch (error) {
        console.log('오디오 재생을 지원하지 않는 브라우저입니다.');
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});