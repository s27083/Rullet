document.addEventListener('DOMContentLoaded', function() {
    const MIN_NUMBER = 3;
    const MAX_NUMBER = 150;
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const selectedNumberElement = document.getElementById('selectedNumber');
    const lastSelectedNumberElement = document.getElementById('lastSelectedNumber');
    
    let isSpinning = false;
    
    // Generowanie liczb dla ruletki
    function initializeWheel() {
        // Wypełniamy koło pojedynczym kolorem
        wheel.style.backgroundColor = '#3498db';
        
        // Wyświetlanie bieżącej liczby podczas obrotu
        const centerNumber = document.createElement('div');
        centerNumber.className = 'center-number';
        centerNumber.id = 'centerNumber';
        centerNumber.textContent = '';
        wheel.appendChild(centerNumber);
        
        // Wczytaj ostatnio wylosowaną liczbę z localStorage
        const lastNumber = localStorage.getItem('lastNumber');
        if (lastNumber) {
            lastSelectedNumberElement.textContent = lastNumber;
        }
        
        // Sprawdzenie ograniczenia czasowego
        checkTimeLimitation();
    }
    
    // Sprawdza ograniczenie czasowe (raz na godzinę)
    function checkTimeLimitation() {
        const lastSpinTime = localStorage.getItem('lastSpinTime');
        
        if (lastSpinTime) {
            const currentTime = new Date().getTime();
            const timeDifference = currentTime - parseInt(lastSpinTime);
            const oneHour = 60 * 60 * 1000; // milisekundy w godzinie
            
            if (timeDifference < oneHour) {
                // Nie minęła jeszcze godzina
                const remainingTime = oneHour - timeDifference;
                const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
                const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
                
                spinButton.disabled = true;
                spinButton.textContent = `Czekaj ${remainingMinutes}m ${remainingSeconds}s`;
                
                // Aktualizacja czasu oczekiwania co sekundę
                const timerInterval = setInterval(() => {
                    const currentTime = new Date().getTime();
                    const timeDifference = currentTime - parseInt(lastSpinTime);
                    
                    if (timeDifference >= oneHour) {
                        // Minęła godzina, można losować ponownie
                        clearInterval(timerInterval);
                        spinButton.disabled = false;
                        spinButton.textContent = 'Zakręć Ruletką';
                    } else {
                        // Aktualizacja czasu pozostałego
                        const remainingTime = oneHour - timeDifference;
                        const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
                        const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
                        spinButton.textContent = `Czekaj ${remainingMinutes}m ${remainingSeconds}s`;
                    }
                }, 1000);
            }
        }
    }
    
    // Losowanie liczby i obracanie koła
    function spinWheel() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        selectedNumberElement.textContent = '-';
        
        // Losowanie liczby
        const selectedNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
        
        // Symulacja obrotu koła poprzez animację
        let spins = 0;
        const totalSpins = 30; // Ilość "migotań" liczb podczas obrotu
        let spinInterval = 50; // ms między zmianami liczb na początku
        const centerNumber = document.getElementById('centerNumber');
        
        let spinAnimation = setInterval(function() {
            // Losowa liczba podczas animacji
            const randomAnimNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
            centerNumber.textContent = randomAnimNumber;
            
            spins++;
            
            // Stopniowe spowalnianie animacji
            if (spins > totalSpins * 0.7) {
                spinInterval += 10;
                clearInterval(spinAnimation);
                spinAnimation = setInterval(arguments.callee, spinInterval);
            }
            
            // Zakończenie animacji
            if (spins >= totalSpins) {
                clearInterval(spinAnimation);
                centerNumber.textContent = selectedNumber;
                selectedNumberElement.textContent = selectedNumber;
                
                // Zapisanie wylosowanej liczby
                localStorage.setItem('lastNumber', selectedNumber.toString());
                lastSelectedNumberElement.textContent = selectedNumber;
                
                // Zapisanie czasu ostatniego losowania
                localStorage.setItem('lastSpinTime', new Date().getTime().toString());
                
                // Odblokowujemy przycisk po zakończeniu animacji, ale informujemy o ograniczeniu
                setTimeout(() => {
                    isSpinning = false;
                    spinButton.disabled = true;
                    spinButton.textContent = 'Czekaj 60m 0s';
                    
                    // Rozpocznij odliczanie czasu
                    checkTimeLimitation();
                }, 500);
            }
        }, spinInterval);
        
        // Animacja obrotu koła
        wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        const rotations = Math.floor(Math.random() * 3) + 5; // 5-7 pełnych obrotów
        wheel.style.transform = `rotate(${rotations * 360}deg)`;
    }
    
    // Inicjalizacja koła
    initializeWheel();
    
    // Obsługa przycisku
    spinButton.addEventListener('click', spinWheel);
}); 