const DEFAULT_SEAT_PRICE = 15000;
const SEAT_ROWS = 6;
const SEAT_COLS = 8;

let currentModalMovie = null;

function buildSeatRowsHtml() {
    let rows = '';
    for (let r = 0; r < SEAT_ROWS; r++) {
        rows += '<div class="row">';
        for (let c = 0; c < SEAT_COLS; c++) {
            rows += '<div class="seat"></div>';
        }
        rows += '</div>';
    }
    return rows;
}

function injectMovieModal() {
    if (document.getElementById('movie-modal')) return;

    const today = new Date().toISOString().split('T')[0];
    const modal = document.createElement('div');
    modal.id = 'movie-modal';
    modal.className = 'movie-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-panel modal-panel--wide">
            <button type="button" class="modal-close" aria-label="닫기">&times;</button>
            <div class="modal-layout">
                <div class="modal-info">
                    <img class="modal-poster" src="" alt="">
                    <h3 id="modal-title" class="modal-title"></h3>
                    <p class="modal-synopsis"></p>
                </div>
                <div class="modal-booking">
                    <h4 class="booking-heading">예매 · 장바구니</h4>
                    <p class="booking-movie-name"></p>
                    <div class="booking-field">
                        <label for="modal-booking-date">날짜</label>
                        <input type="date" id="modal-booking-date" min="${today}">
                    </div>
                    <ul class="seat-legend">
                        <li><span class="legend-seat available"></span>선택 가능</li>
                        <li><span class="legend-seat selected"></span>선택</li>
                        <li><span class="legend-seat occupied"></span>예매 완료</li>
                    </ul>
                    <div class="cinema-screen">SCREEN</div>
                    <div class="modal-row-container row-container">
                        ${buildSeatRowsHtml()}
                    </div>
                    <p class="booking-summary">
                        <span id="modal-seat-count">0</span>석 선택 · 좌석당 <span id="modal-seat-unit-price">0</span>원 ·
                        총 <span id="modal-total-price">0</span>원
                    </p>
                    <div class="modal-actions">
                        <button type="button" class="btn-modal-cart">장바구니 담기</button>
                        <button type="button" class="btn-modal-book">예매하기</button>
                    </div>
                    <p id="modal-booking-message" class="modal-booking-message"></p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', closeMovieModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeMovieModal);
    modal.querySelector('.modal-row-container').addEventListener('click', onModalSeatClick);
    modal.querySelector('#modal-booking-date').addEventListener('change', onModalDateChange);
    modal.querySelector('.btn-modal-cart').addEventListener('click', addModalBookingToCart);
    modal.querySelector('.btn-modal-book').addEventListener('click', confirmModalBooking);
}

function getModalElements() {
    const modal = document.getElementById('movie-modal');
    return {
        modal,
        dateInput: modal.querySelector('#modal-booking-date'),
        container: modal.querySelector('.modal-row-container'),
        message: modal.querySelector('#modal-booking-message'),
    };
}

function getSeatUnitPrice() {
    return currentModalMovie?.price || DEFAULT_SEAT_PRICE;
}

function getModalSelectedSeats() {
    const { container } = getModalElements();
    return container ? [...container.querySelectorAll('.seat.selected')] : [];
}

function getModalAllSeats() {
    const { container } = getModalElements();
    return container ? [...container.querySelectorAll('.seat')] : [];
}

function loadModalBookedSeats() {
    const allSeats = getModalAllSeats();
    allSeats.forEach((seat) => seat.classList.remove('occupied', 'selected'));

    const { dateInput } = getModalElements();
    const date = dateInput?.value || 'default';
    const movieId = currentModalMovie?.id || 'default';
    const bookedSeatsStr = localStorage.getItem('bookedSeats');

    let indices = [];
    if (bookedSeatsStr) {
        const parsed = JSON.parse(bookedSeatsStr);
        if (Array.isArray(parsed)) {
            if (date === 'default') indices = parsed;
        } else if (parsed[`${movieId}_${date}`]) {
            indices = parsed[`${movieId}_${date}`];
        } else if (parsed[date]) {
            indices = parsed[date];
        }
    }

    indices.forEach((index) => {
        if (allSeats[index]) allSeats[index].classList.add('occupied');
    });
}

function updateModalBookingSummary() {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;

    const selectedCount = getModalSelectedSeats().length;
    const unitPrice = getSeatUnitPrice();

    modal.querySelector('#modal-seat-count').textContent = selectedCount;
    modal.querySelector('#modal-seat-unit-price').textContent = unitPrice.toLocaleString();
    modal.querySelector('#modal-total-price').textContent =
        (selectedCount * unitPrice).toLocaleString();
}

function resetModalBookingForm() {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;

    getModalAllSeats().forEach((seat) => seat.classList.remove('selected'));
    modal.querySelector('#modal-booking-message').textContent = '';
    modal.querySelector('#modal-booking-message').className = 'modal-booking-message';

    const today = new Date().toISOString().split('T')[0];
    modal.querySelector('#modal-booking-date').value = today;

    loadModalBookedSeats();
    updateModalBookingSummary();
}

function onModalSeatClick(e) {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        updateModalBookingSummary();
    }
}

function onModalDateChange() {
    getModalSelectedSeats().forEach((seat) => seat.classList.remove('selected'));
    updateModalBookingSummary();
    loadModalBookedSeats();
}

function validateModalBooking() {
    const { dateInput, message } = getModalElements();

    if (!dateInput.value) {
        message.textContent = '예매 날짜를 선택해주세요.';
        message.className = 'modal-booking-message error';
        return null;
    }

    const selectedSeats = getModalSelectedSeats();

    if (selectedSeats.length === 0) {
        message.textContent = '좌석을 선택해주세요.';
        message.className = 'modal-booking-message error';
        return null;
    }

    const unitPrice = getSeatUnitPrice();
    const totalPrice = selectedSeats.length * unitPrice;
    const allSeats = getModalAllSeats();
    const seatsIndex = selectedSeats.map((seat) => allSeats.indexOf(seat));

    return {
        date: dateInput.value,
        seatCount: selectedSeats.length,
        totalPrice,
        seatsIndex,
        selectedSeats,
        unitPrice,
    };
}

function saveModalBookedSeats(seatsIndex, date) {
    const movieId = currentModalMovie?.id || 'default';
    const key = `${movieId}_${date}`;
    const bookedSeatsStr = localStorage.getItem('bookedSeats');
    let parsed = bookedSeatsStr ? JSON.parse(bookedSeatsStr) : {};
    if (Array.isArray(parsed)) parsed = { default: parsed };
    if (!parsed[key]) parsed[key] = [];
    parsed[key] = [...parsed[key], ...seatsIndex];
    localStorage.setItem('bookedSeats', JSON.stringify(parsed));
}

function addModalBookingToCart() {
    const data = validateModalBooking();
    if (!data || !currentModalMovie) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({
        id: String(currentModalMovie.id),
        name: currentModalMovie.title,
        price: data.unitPrice,
        quantity: data.seatCount,
        bookingDate: data.date,
        seats: data.seatsIndex,
        seatCount: data.seatCount,
        totalPrice: data.totalPrice,
    });
    localStorage.setItem('cart', JSON.stringify(cart));

    const { message } = getModalElements();
    message.textContent = '장바구니에 담았습니다.';
    message.className = 'modal-booking-message success';
}

function confirmModalBooking() {
    const data = validateModalBooking();
    if (!data || !currentModalMovie) return;

    saveModalBookedSeats(data.seatsIndex, data.date);

    saveBooking({
        movie: currentModalMovie.title,
        date: new Date().toLocaleString(),
        bookingDate: data.date,
        seats: data.seatsIndex,
        seatCount: data.seatCount,
        totalPrice: data.totalPrice,
    });

    data.selectedSeats.forEach((seat) => {
        seat.classList.remove('selected');
        seat.classList.add('occupied');
    });

    const { message } = getModalElements();
    message.textContent = `예매 완료! ${data.totalPrice.toLocaleString()}원`;
    message.className = 'modal-booking-message success';
    updateModalBookingSummary();

    setTimeout(() => {
        const myBookingPath = window.location.pathname.includes('/pages/')
            ? 'my_booking.html'
            : 'pages/my_booking.html';
        window.location.href = myBookingPath;
    }, 800);
}

function openMovieModal(movie) {
    injectMovieModal();

    currentModalMovie = {
        id: movie.id || movie.title,
        title: movie.title,
        price: movie.price || DEFAULT_SEAT_PRICE,
        posterSrc: movie.posterSrc || (movie.image ? `images/${movie.image}` : ''),
        synopsis: movie.synopsis || '',
    };

    const modal = document.getElementById('movie-modal');
    modal.querySelector('.modal-poster').src = currentModalMovie.posterSrc;
    modal.querySelector('.modal-poster').alt = currentModalMovie.title;
    modal.querySelector('.modal-title').textContent = currentModalMovie.title;
    modal.querySelector('.modal-synopsis').textContent = currentModalMovie.synopsis;
    modal.querySelector('.booking-movie-name').textContent = currentModalMovie.title;

    resetModalBookingForm();
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeMovieModal() {
    const modal = document.getElementById('movie-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    currentModalMovie = null;
}
