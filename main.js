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

         document.addEventListener('DOMContentLoaded', function() {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    const sliderArrows = document.querySelector('.slider-arrows');
    const sliderNav = document.querySelector('.slider-nav');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const dragIndicator = document.querySelector('.drag-indicator');
    
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    let images = [];
    let isSliderMode = false;
    let isDragging = false;
    let startX, startScrollLeft;
    let autoSlideInterval;

    // Функция для свайпа/перетаскивания
    function initDragToScroll() {
      projectsGrid.addEventListener('mousedown', (e) => {
        if (!isSliderMode) return;
        
        isDragging = true;
        projectsGrid.classList.add('grabbing');
        startX = e.pageX - projectsGrid.offsetLeft;
        startScrollLeft = projectsGrid.scrollLeft;
        
        // Показываем индикатор
        dragIndicator.classList.add('visible');
      });

      projectsGrid.addEventListener('touchstart', (e) => {
        if (!isSliderMode) return;
        
        isDragging = true;
        projectsGrid.classList.add('grabbing');
        startX = e.touches[0].pageX - projectsGrid.offsetLeft;
        startScrollLeft = projectsGrid.scrollLeft;
        
        // Показываем индикатор
        dragIndicator.classList.add('visible');
      });

      document.addEventListener('mouseup', () => {
        if (!isSliderMode) return;
        
        isDragging = false;
        projectsGrid.classList.remove('grabbing');
        
        // Скрываем индикатор с задержкой
        setTimeout(() => {
          dragIndicator.classList.remove('visible');
        }, 1000);
      });

      document.addEventListener('touchend', () => {
        if (!isSliderMode) return;
        
        isDragging = false;
        projectsGrid.classList.remove('grabbing');
        
        setTimeout(() => {
          dragIndicator.classList.remove('visible');
        }, 1000);
      });

      projectsGrid.addEventListener('mousemove', (e) => {
        if (!isDragging || !isSliderMode) return;
        e.preventDefault();
        
        const x = e.pageX - projectsGrid.offsetLeft;
        const walk = (x - startX) * 2; // Умножаем для более быстрой прокрутки
        projectsGrid.scrollLeft = startScrollLeft - walk;
        
        updateActiveDot();
      });

      projectsGrid.addEventListener('touchmove', (e) => {
        if (!isDragging || !isSliderMode) return;
        
        const x = e.touches[0].pageX - projectsGrid.offsetLeft;
        const walk = (x - startX) * 2;
        projectsGrid.scrollLeft = startScrollLeft - walk;
        
        updateActiveDot();
      });

      // Предотвращаем выделение текста при перетаскивании
      projectsGrid.addEventListener('dragstart', (e) => {
        if (isSliderMode) {
          e.preventDefault();
        }
      });
    }

    // Проверяем количество карточек и включаем слайдер если больше 6
    function checkSliderMode() {
      if (projectCards.length > 6) {
        isSliderMode = true;
        projectsGrid.classList.add('slider-mode');
        sliderArrows.classList.add('active');
        initSliderNavigation();
        initDragToScroll();
        startAutoSlide();
      } else {
        isSliderMode = false;
        projectsGrid.classList.remove('slider-mode');
        sliderArrows.classList.remove('active');
        sliderNav.classList.remove('active');
        stopAutoSlide();
      }
    }
    
    // Автопрокрутка слайдера
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        const currentSlide = Math.floor(projectsGrid.scrollLeft / (projectsGrid.offsetWidth + 20));
        const maxSlide = Math.ceil(projectCards.length / 3) - 1;
        const nextSlide = (currentSlide + 1) % (maxSlide + 1);
        scrollToSlide(nextSlide);
      }, 5000);
    }
    
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }
    
    // Инициализация навигации слайдера
    function initSliderNavigation() {
      // Создаем точки навигации
      sliderNav.innerHTML = '';
      sliderNav.classList.add('active');
      
      const slidesCount = Math.ceil(projectCards.length / 3);
      
      for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          scrollToSlide(i);
        });
        sliderNav.appendChild(dot);
      }
      
      // Обработчики для стрелок
      prevArrow.addEventListener('click', () => {
        const currentSlide = getCurrentSlide();
        scrollToSlide(Math.max(0, currentSlide - 1));
      });
      
      nextArrow.addEventListener('click', () => {
        const currentSlide = getCurrentSlide();
        const maxSlide = Math.ceil(projectCards.length / 3) - 1;
        scrollToSlide(Math.min(maxSlide, currentSlide + 1));
      });
      
      // Останавливаем автопрокрутку при взаимодействии
      projectsGrid.addEventListener('mouseenter', stopAutoSlide);
      projectsGrid.addEventListener('touchstart', stopAutoSlide);
      projectsGrid.addEventListener('mouseleave', startAutoSlide);
    }
    
    function getCurrentSlide() {
      return Math.round(projectsGrid.scrollLeft / projectsGrid.offsetWidth);
    }
    
    function updateActiveDot() {
      const currentSlide = getCurrentSlide();
      document.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    // Прокрутка к определенному слайду
    function scrollToSlide(slideIndex) {
      const cardWidth = projectCards[0].offsetWidth + 20;
      projectsGrid.scrollTo({
        left: slideIndex * projectsGrid.offsetWidth,
        behavior: 'smooth'
      });
      
      // Обновляем активную точку
      document.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
      });
    }
    
    // Собираем все изображения и подписи
    projectCards.forEach((card, index) => {
      const img = card.querySelector('img');
      const title = card.querySelector('h3').textContent;
      const description = card.querySelector('p').textContent;
      
      images.push({
        src: img.src,
        alt: img.alt,
        title: title,
        description: description
      });
      
      // Добавляем обработчик клика на каждую карточку
      card.addEventListener('click', () => {
        openModal(index);
      });
    });
    
    // Функция открытия модального окна
    function openModal(index) {
      currentIndex = index;
      updateModalContent();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    
    // Функция обновления содержимого модального окна
    function updateModalContent() {
      const currentImage = images[currentIndex];
      modalImage.src = currentImage.src;
      modalImage.alt = currentImage.alt;
      modalCaption.innerHTML = `<h3>${currentImage.title}</h3><p>${currentImage.description}</p>`;
    }
    
    // Функция закрытия модального окна
    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    // Переход к следующему изображению
    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateModalContent();
    }
    
    // Переход к предыдущему изображению
    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateModalContent();
    }
    
    // Обработчики событий модального окна
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Навигация с помощью клавиатуры
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeModal();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    });
    
    // Инициализируем проверку режима
    checkSliderMode();
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', checkSliderMode);
  });

        $(document).ready(function(){
            // Инициализация маски для телефона с более строгими настройками
            $('#phone').inputmask({
                mask: '+7 (999) 999-99-99',
                placeholder: '_',
                clearIncomplete: true,
                showMaskOnHover: true,
                greedy: false,
                clearMaskOnLostFocus: false,
                onBeforeMask: function(value, opts) {
                    // Удаляем все нецифровые символы перед применением маски
                    return value.replace(/\D/g, '');
                },
                onKeyValidation: function(key, result) {
                    // Блокируем ввод букв и символов
                    if (!result && key !== 8 && key !== 46) { // 8 - backspace, 46 - delete
                        return false;
                    }
                }
            });

            // Валидация при вводе
            $('#phone').on('input', function() {
                validatePhone();
            });

            // Валидация при отправке формы
            $('#orderForm').on('submit', function(e) {
                e.preventDefault();
                
                if (validatePhone()) {
                    // Форма валидна, можно отправлять
                    alert('Форма отправлена! Номер: ' + $('#phone').val());
                    // this.submit(); // раскомментируйте для реальной отправки
                }
            });

            function validatePhone() {
                const phone = $('#phone').val();
                const phoneError = $('#phoneError');
                const submitBtn = $('#submitBtn');
                
                // Проверяем, полностью ли заполнен номер
                const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
                const isValid = phoneRegex.test(phone) && !phone.includes('_');
                
                if (isValid) {
                    phoneError.hide();
                    $('#phone').removeClass('error');
                    submitBtn.prop('disabled', false);
                    return true;
                } else {
                    phoneError.show();
                    $('#phone').addClass('error');
                    submitBtn.prop('disabled', true);
                    return false;
                }
            }

            // Изначально блокируем кнопку
            $('#submitBtn').prop('disabled', true);

            // Дополнительная защита от ввода букв
            $('#phone').on('keypress', function(e) {
                // Разрешаем только цифры, backspace, delete, tab
                if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
                    e.preventDefault();
                }
            });

            // Запрещаем вставку текста с буквами
            $('#phone').on('paste', function(e) {
                const pastedData = e.originalEvent.clipboardData.getData('text');
                if (/\D/.test(pastedData.replace(/[+\-()\s]/g, ''))) {
                    e.preventDefault();
                }
            });
        }); 