        let index = 0;
        const cards = document.querySelectorAll('.card');
        const TOTAL = cards.length;
        let wheelLocked = false;
        const WHEEL_LOCK_MS = 400;

        function updateCarousel() {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next', 'hidden');

                const offset = (i - index + TOTAL) % TOTAL;

                if (offset === 0) card.classList.add('active');
                else if (offset === 1) card.classList.add('next');
                else if (offset === TOTAL - 1) card.classList.add('prev');
                else card.classList.add('hidden');
            });
        }

        function navigateCarousel(direction) {
            if (wheelLocked) return;
            
            wheelLocked = true;
            
            if (direction === 'next') {
                index = (index + 1) % TOTAL;
            } else if (direction === 'prev') {
                index = (index - 1 + TOTAL) % TOTAL;
            }
            
            updateCarousel();
            
            setTimeout(() => {
                wheelLocked = false;
            }, WHEEL_LOCK_MS);
        }

        updateCarousel();

        // Wheel navigation
        window.addEventListener(
            'wheel',
            e => {
                if (wheelLocked) return;
                if (Math.abs(e.deltaY) < 30) return;

                e.preventDefault();
                navigateCarousel(e.deltaY > 0 ? 'next' : 'prev');
            },
            { passive: false }
        );

// Keyboard navigation
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                navigateCarousel('next');
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateCarousel('prev');
            }
        });

        // Touch navigation
        let touchStartY = 0;
        let touchEndY = 0;
        const MIN_SWIPE_DISTANCE = 50;

        window.addEventListener('touchstart', e => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchStartY - touchEndY;
            
            if (Math.abs(swipeDistance) < MIN_SWIPE_DISTANCE) return;
            
            if (swipeDistance > 0) {
                // Swiped up - go to next
                navigateCarousel('next');
            } else {
                // Swiped down - go to previous
                navigateCarousel('prev');
            }
        }