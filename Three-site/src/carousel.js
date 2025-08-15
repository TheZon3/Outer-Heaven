const workHistory = [
    {
        title: "McDonalds",
        description: "Pioneering the fast-food frontier with innovative burger-flipping techniques and advanced milkshake-machine diagnostics."
    },
    {
        title: "Burger King",
        description: "Engineered the flame-grilling process to perfection, ensuring optimal flavor output for the Whopper series."
    },
    {
        title: "Taco Bell",
        description: "Led the research and development of next-generation synthetic beef substitutes for the Crunchy Taco Supreme."
    },
    {
        title: "Outer Heaven",
        description: "Building the future of robotics, one line of code at a time. Currently developing autonomous systems for deep space exploration."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    const jobTitleEl = document.querySelector('.job-title');
    const jobDescriptionEl = document.querySelector('.job-description');

    if (!track || !dotsContainer || !jobTitleEl || !jobDescriptionEl) {
        console.error("Carousel elements not found");
        return;
    }

    const totalCards = workHistory.length;
    const angle = 360 / totalCards;
    const radius = 290; // This value is chosen to work well with the container size and perspective
    let currentIndex = 0;

    // Create cards and dots, and position them in 3D
    workHistory.forEach((job, index) => {
        // Card
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        const cardAngle = angle * index;
        card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        const title = document.createElement('h3');
        title.textContent = job.title;
        cardContent.appendChild(title);
        card.appendChild(cardContent);
        track.appendChild(card);

        // Dot
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });

    const cards = document.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");

    function updateCarousel(newIndex) {
        currentIndex = (newIndex + totalCards) % totalCards;

        const rotation = -currentIndex * angle;
        // Translate the track back to keep the carousel centered, then rotate
        track.style.transform = `translateZ(-${radius}px) rotateY(${rotation}deg)`;

        // Update job info with fade effect
        jobTitleEl.style.opacity = 0;
        jobDescriptionEl.style.opacity = 0;

        setTimeout(() => {
            jobTitleEl.textContent = workHistory[currentIndex].title;
            jobDescriptionEl.textContent = workHistory[currentIndex].description;
            jobTitleEl.style.opacity = 1;
            jobDescriptionEl.style.opacity = 1;
        }, 300);

        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    leftArrow.addEventListener("click", () => {
        updateCarousel(currentIndex - 1);
    });

    rightArrow.addEventListener("click", () => {
        updateCarousel(currentIndex + 1);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const newIndex = parseInt(e.target.dataset.index);
            if (!isNaN(newIndex)) {
                updateCarousel(newIndex);
            }
        });
    });

    // Initialize
    if (totalCards > 0) {
        updateCarousel(0);
    }
});
