// document.addEventListener("DOMContentLoaded", () => {
//     const counters = document.querySelectorAll('.counter');
//     const speed = 200; // Animation duration

//     counters.forEach(counter => {
//         const animateCounter = () => {
//             const target = +counter.getAttribute('data-target');
//             const current = +counter.innerText;

//             const increment = target / speed;

//             if (current < target) {
//                 counter.innerText = Math.ceil(current + increment);
//                 setTimeout(animateCounter, 10);
//             } else {
//                 counter.innerText = target;
//             }
//         };

//         animateCounter();
//     });
// });
// Counter animation script
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        counter.innerText = '0';
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;

            const increment = target / 100;

            if (count < target) {
                counter.innerText = `${Math.ceil(count + increment)}`;
                setTimeout(updateCounter, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
});

