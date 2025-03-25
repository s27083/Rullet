document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const numberContainer = document.querySelector('.number-container');
    const spinButton = document.getElementById('spinButton');
    const selectedNumberElement = document.getElementById('selectedNumber');
    
    // Liczby na ruletce (0-36)
    const numbers = Array.from({length: 37}, (_, i) => i);
    
    // Tworzenie segmentów ruletki
    numbers.forEach((number, index) => {
        const segment = document.createElement('div');
        segment.className = 'number';
        segment.textContent = number;
        
        // Obliczanie kąta dla każdego segmentu
        const angle = (index * 360) / numbers.length;
        segment.style.transform = `rotate(${angle}deg)`;
        
        // Ustawianie koloru tła
        if (number === 0) {
            segment.style.backgroundColor = '#008000'; // zielony dla zera
        } else if (number % 2 === 0) {
            segment.style.backgroundColor = '#000000'; // czarny dla parzystych
        } else {
            segment.style.backgroundColor = '#ff0000'; // czerwony dla nieparzystych
        }
        
        numberContainer.appendChild(segment);
    });
    
    let isSpinning = false;
    
    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        
        isSpinning = true;
        spinButton.disabled = true;
        
        // Losowy kąt obrotu (minimum 5 pełnych obrotów + losowa wartość)
        const rotations = 5 + Math.random() * 5;
        const degrees = rotations * 360;
        
        // Dodatkowy losowy kąt dla końcowej pozycji
        const extraDegrees = Math.random() * 360;
        const totalDegrees = degrees + extraDegrees;
        
        // Animacja obrotu
        wheel.style.transform = `rotate(${totalDegrees}deg)`;
        
        // Obliczanie wylosowanej liczby
        setTimeout(() => {
            const finalRotation = extraDegrees;
            const segmentSize = 360 / numbers.length;
            const selectedIndex = Math.floor(((360 - (finalRotation % 360)) % 360) / segmentSize);
            const selectedNumber = numbers[selectedIndex];
            
            selectedNumberElement.textContent = selectedNumber;
            isSpinning = false;
            spinButton.disabled = false;
        }, 4000);
    });
}); 