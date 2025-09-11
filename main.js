        function toggleCityDropdown() {
            document.getElementById('cityDropdown').classList.toggle('active');
        }
        
        function selectCity(city) {
            document.querySelector('.city-selector span').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${city} <i class="fas fa-chevron-down"></i>`;
            document.getElementById('cityDropdown').classList.remove('active');
        }
        
        // Закрытие выпадающего списка при клике вне его
        window.onclick = function(event) {
            if (!event.target.matches('.city-selector span') && !event.target.matches('.city-selector span *')) {
                document.getElementById('cityDropdown').classList.remove('active');
            }
        }
        
        // Обработка формы
        document.querySelector('.order-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });