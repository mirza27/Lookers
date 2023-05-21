const carousel = document.getElementById('carousel');
let currentSlide = 0;

function showSlide(slideIndex) {
    const slides = Array.from(carousel.getElementsByClassName('carousel-item'));

    if (slideIndex >= slides.length) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    slides.forEach((slide) => {
        slide.style.display = 'none';
    });

    slides[slideIndex].style.display = 'block';
    currentSlide = slideIndex;
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

showSlide(currentSlide);
setInterval(nextSlide, 2000); // Mengganti slide setiap 2 detik
