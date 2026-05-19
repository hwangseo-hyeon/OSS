const container = document.querySelector('.row-container');
const count = document.getElementById('count');
const total = document.getElementById('total');
const bookingMessage = document.getElementById('booking-message');
const bookingDateInput = document.getElementById('booking-date');

const SEAT_PRICE = 15000;

function loadBookedSeats() {
    const allSeats = document.querySelectorAll('.row .seat');
    allSeats.forEach(seat => seat.classList.remove('occupied'));

    const date = bookingDateInput && bookingDateInput.value ? bookingDateInput.value : 'default';
    const bookedSeatsStr = localStorage.getItem('bookedSeats');

    if (bookedSeatsStr) {
        const parsed = JSON.parse(bookedSeatsStr);
        let bookedSeatsIndices = [];

        if (Array.isArray(parsed)) {
            if (date === 'default' || !date) bookedSeatsIndices = parsed;
        } else {
            bookedSeatsIndices = parsed[date] || [];
        }

        bookedSeatsIndices.forEach(index => {
            if (allSeats[index]) {
                allSeats[index].classList.add('occupied');
            }
        });
    }
}

function updateSelectedCountAndTotal() {
    const selectedSeatsCount = document.querySelectorAll('.row .seat.selected').length;
    count.innerText = selectedSeatsCount;
    total.innerText = (selectedSeatsCount * SEAT_PRICE).toLocaleString();
}

loadBookedSeats();

if (bookingDateInput) {
    bookingDateInput.addEventListener('change', () => {
        document.querySelectorAll('.row .seat.selected').forEach(seat => seat.classList.remove('selected'));
        updateSelectedCountAndTotal();
        loadBookedSeats();
    });
}

if (container) {
    container.addEventListener('click', e => {
        if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
            e.target.classList.toggle('selected');
            updateSelectedCountAndTotal();
        }
    });
}

function bookSeats() {
    const bookingDate = bookingDateInput ? bookingDateInput.value : null;
    if (bookingDateInput && !bookingDate) {
        alert('예매 날짜를 선택해주세요.');
        return;
    }

    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const selectedSeatsCount = selectedSeats.length;

    if (selectedSeatsCount === 0) {
        alert('좌석을 선택해주세요.');
        return;
    }

    const totalPrice = selectedSeatsCount * SEAT_PRICE;

    const allSeats = document.querySelectorAll('.row .seat');
    const seatsIndex = [...selectedSeats].map(seat => [...allSeats].indexOf(seat));

    const date = bookingDateInput && bookingDateInput.value ? bookingDateInput.value : 'default';
    const bookedSeatsStr = localStorage.getItem('bookedSeats');
    let parsed = bookedSeatsStr ? JSON.parse(bookedSeatsStr) : {};
    if (Array.isArray(parsed)) {
        parsed = { default: parsed };
    }
    if (!parsed[date]) parsed[date] = [];
    parsed[date] = [...parsed[date], ...seatsIndex];
    localStorage.setItem('bookedSeats', JSON.stringify(parsed));

    saveBooking({
        movie: '영화',
        date: new Date().toLocaleString(),
        bookingDate: date,
        seats: seatsIndex,
        seatCount: selectedSeatsCount,
        totalPrice: totalPrice,
    });

    bookingMessage.innerText = `예매가 완료되었습니다! 총 결제 금액: ${totalPrice.toLocaleString()}원`;
    bookingMessage.style.color = '#6feaf6';

    localStorage.removeItem('cart');

    selectedSeats.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('occupied');
    });
    updateSelectedCountAndTotal();

    alert('예매가 완료되었습니다! 예매 내역 페이지로 이동합니다.');
    window.location.href = 'my_booking.html';
}
