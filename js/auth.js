function initializeUsers() {
    if (!localStorage.getItem('USERS')) {
        const dummyUsers = [
            { id: "user", password: "1234", name: "일반사용자", isAdult: true }
        ];
        localStorage.setItem('USERS', JSON.stringify(dummyUsers));
    }
}

initializeUsers();

function getUsers() {
    return JSON.parse(localStorage.getItem('USERS')) || [];
}

function signup(id, password, name, birthDateStr) {
    const users = getUsers();

    if (users.find(u => u.id === id)) {
        alert('이미 존재하는 아이디입니다.');
        return false;
    }

    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const isAdult = age >= 19;

    const newUser = { id, password, name, isAdult, birthDate: birthDateStr };
    users.push(newUser);
    localStorage.setItem('USERS', JSON.stringify(users));

    alert(`회원가입이 완료되었습니다!\n(성인 여부: ${isAdult ? '성인' : '미성년자'})`);
    return true;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('loggedInUser');
    return userStr ? JSON.parse(userStr) : null;
}

function getCurrentUserFresh() {
    const sessionUser = getCurrentUser();
    if (!sessionUser) return null;
    const users = getUsers();
    return users.find(u => u.id === sessionUser.id) || null;
}

function isPagesDirectory() {
    return window.location.pathname.includes('/pages/');
}

function login(id, password) {
    const users = getUsers();
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify({ id: user.id, name: user.name }));
        alert(`환영합니다, ${user.name}님!`);
        window.location.href = isPagesDirectory() ? '../index.html' : 'index.html';
        return true;
    }
    alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    return false;
}

function logout() {
    localStorage.removeItem('loggedInUser');
    alert('로그아웃 되었습니다.');
    window.location.reload();
}

const GUEST_ADULT_CERT_KEY = 'guestAdultCert';
const GUEST_BOOKINGS_KEY = 'guestBookings';

function getGuestBookings() {
    return JSON.parse(localStorage.getItem(GUEST_BOOKINGS_KEY)) || [];
}

function addGuestBooking(booking) {
    const bookings = getGuestBookings();
    bookings.push(booking);
    localStorage.setItem(GUEST_BOOKINGS_KEY, JSON.stringify(bookings));
}

function addUserBooking(userId, booking) {
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) return false;
    if (!users[userIndex].bookings) users[userIndex].bookings = [];
    users[userIndex].bookings.push(booking);
    localStorage.setItem('USERS', JSON.stringify(users));
    return true;
}

function saveBooking(booking) {
    const currentUser = getCurrentUser();
    if (currentUser) {
        addUserBooking(currentUser.id, booking);
    } else {
        addGuestBooking(booking);
    }
}

function getMyBookings() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const users = getUsers();
        const user = users.find((u) => u.id === currentUser.id);
        return user && user.bookings ? [...user.bookings] : [];
    }
    return getGuestBookings();
}

function isGuestAdultCertified() {
    return localStorage.getItem(GUEST_ADULT_CERT_KEY) === 'true';
}

function setGuestAdultCertified() {
    localStorage.setItem(GUEST_ADULT_CERT_KEY, 'true');
}

function checkAdultAccess() {
    const inPages = isPagesDirectory();
    const pagesPrefix = inPages ? '' : 'pages/';
    const certUrl = `${pagesPrefix}adult_cert.html`;

    const user = getCurrentUserFresh();
    if (user) {
        if (user.isAdult) return true;
        alert('미성년자이거나 성인 인증이 필요합니다. 인증 페이지로 이동합니다.');
        window.location.href = certUrl;
        return false;
    }

    if (isGuestAdultCertified()) return true;

    alert('성인 인증이 필요한 콘텐츠입니다. 인증 페이지로 이동합니다.');
    window.location.href = certUrl;
    return false;
}

function setupTopNav() {
    const topNav = document.querySelector('.top-nav');
    if (!topNav) return;

    topNav.querySelectorAll('a').forEach((link) => {
        if (link.textContent.trim() === '장바구니') {
            link.remove();
        }
    });

    const inPages = isPagesDirectory();
    const pagesPrefix = inPages ? '' : 'pages/';

    let loginLink = topNav.querySelector('#nav-login');
    let bookingLink = topNav.querySelector('#nav-my-booking');
    let logoutLink = topNav.querySelector('#nav-logout');

    if (!loginLink) {
        loginLink = [...topNav.querySelectorAll('a')].find(
            (a) => a.textContent.trim() === '로그인'
        );
        if (loginLink) loginLink.id = 'nav-login';
    }

    if (!loginLink) {
        loginLink = document.createElement('a');
        loginLink.id = 'nav-login';
        loginLink.href = `${pagesPrefix}login.html`;
        loginLink.textContent = '로그인';
        topNav.appendChild(loginLink);
    }

    if (!bookingLink) {
        bookingLink = document.createElement('a');
        bookingLink.id = 'nav-my-booking';
        bookingLink.href = `${pagesPrefix}my_booking.html`;
        bookingLink.textContent = '예매한 영화';
        bookingLink.classList.add('nav-hidden');
        topNav.appendChild(bookingLink);
    }

    if (!logoutLink) {
        logoutLink = document.createElement('a');
        logoutLink.id = 'nav-logout';
        logoutLink.href = '#';
        logoutLink.textContent = '로그아웃';
        logoutLink.classList.add('nav-hidden');
        topNav.appendChild(logoutLink);
    }

    logoutLink.onclick = (e) => {
        e.preventDefault();
        logout();
    };

    loginLink.href = `${pagesPrefix}login.html`;

    if (window.location.pathname.includes('my_booking')) {
        bookingLink.classList.add('active');
    }

    const currentUser = getCurrentUser();
    bookingLink.classList.remove('nav-hidden');
    if (currentUser) {
        loginLink.classList.add('nav-hidden');
        logoutLink.classList.remove('nav-hidden');
    } else {
        loginLink.classList.remove('nav-hidden');
        logoutLink.classList.add('nav-hidden');
    }
}

function setupLegacyNav() {
    const currentUser = getCurrentUser();
    const inPages = isPagesDirectory();
    const pagesPrefix = inPages ? '' : 'pages/';

    const links = document.querySelectorAll('nav ul li a');
    links.forEach((link) => {
        if (link.innerText === '로그인' || link.innerText === '로그아웃') {
            if (currentUser) {
                link.innerText = '로그아웃';
                link.href = '#';
                link.onclick = (e) => {
                    e.preventDefault();
                    logout();
                };
            } else {
                link.innerText = '로그인';
                link.href = `${pagesPrefix}login.html`;
                link.onclick = null;
            }
        }
    });

    if (currentUser) {
        const navUl = document.querySelector('nav ul');
        if (navUl && !document.getElementById('nav-my-booking-li')) {
            const li = document.createElement('li');
            li.id = 'nav-my-booking-li';
            const a = document.createElement('a');
            a.href = `${pagesPrefix}my_booking.html`;
            a.innerText = '예매한 영화';
            li.appendChild(a);
            navUl.insertBefore(li, navUl.lastElementChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupTopNav();
    setupLegacyNav();
});
