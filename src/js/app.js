// svg4everybody();



// Fixed header scroll
var header = document.getElementById('header');
var origOffsetY = header.offsetTop + 600;

function onScroll(e) {
    //window.scrollY >= origOffsetY ? header.classList.add('header-sticky') : header.classList.remove('header-sticky');

    var windowScrollY = window.scrollY;

    if ( windowScrollY >= 300 && windowScrollY < origOffsetY ) {
        header.classList.add('header-offtop');
    } else if ( windowScrollY >= origOffsetY ) {
        header.classList.remove('header-offtop');
        header.classList.add('header-sticky');
    } else {
        header.classList.remove('header-offtop');
        header.classList.remove('header-sticky');
    }
}
document.addEventListener('scroll', onScroll);



// Swiper autoHeight mode fix on resize
function someSwiperAutoHeightFix() {
    setTimeout(function () {
        // Click on the first pagination bullet to fix height
        var someSwiperSliderPaginationElem = document.getElementsByClassName('swiper-pagination-bullet')[0];
        someSwiperSliderPaginationElem.click();

        //someSwiperSlider = document.querySelector('.some-swiper-slider').swiper;
        //someSwiperSlider.update();
    }, 1200);
}



// On resize events
window.onresize = function(event) {

    // Call function to fix Swiper autoHeight mode on resize
    var someSwiperSlider = document.querySelector('.some-swiper-slider');
    if (someSwiperSlider) {
        someSwiperAutoHeightFix();
    }

    //console.log('window resized');
};


// Jquery
$(function(){

    // Mobile menu
    var checkIfMobileMenuOpen = false;

    // Closing mobile menu
    function closeMobileMenu() {
        checkIfMobileMenuOpen = false;

        $('.mobile__container').removeClass('mobile__container_opened');
        $('.mobile__overlay').fadeOut(200);
        $('body').removeClass('body_mobile_opened').addClass('body_mobile_closed');
    }

    // Opening mobile menu
    function openMobileMenu() {
        checkIfMobileMenuOpen = true;

        $('.mobile__overlay').fadeIn(200);
        $('.mobile__container').addClass('mobile__container_opened');
        $('body').removeClass('body_mobile_closed').addClass('body_mobile_opened');
    }

    // Open mobile menu on click
    $('.header__mobile-btn').click(function() {
        if ( checkIfMobileMenuOpen === false ) {
            // Mobile btn styling
            $(this).find('.header__mobile-btn-bar').addClass('header__mobile-btn-bar_active');

            openMobileMenu();
            checkIfMobileMenuOpen = true;
        }
    });

    // Close mobile menu on click
    $('.mobile__header-btn, .mobile__overlay').click(function() {
        if ( checkIfMobileMenuOpen === true ) {
            // Mobile btn styling
            $('.header__mobile-btn-bar').removeClass('header__mobile-btn-bar_active');

            closeMobileMenu();
            checkIfMobileMenuOpen = false;
        }
    });



    /**
     * [swiper slider]
     * @type {Swiper}
     */
    var someSwiperSlider = new Swiper('.some-swiper-slider', {
        effect: 'fade',
        navigation: {
            nextEl: '.some-swiper-slide-next',
            prevEl: '.some-swiper-slide-prev'
        },
        pagination: {
            el: '.some-swiper-slide-pagination',
            type: 'bullets',
            clickable: true
        },
        spaceBetween: 0,
        loop: false,
        speed: 1000,
        autoHeight: true
    });

    // Safari height fix
    setTimeout(function () {
        $('.some-swiper-slide-pagination-bullet').eq(0).trigger('click');
    }, 500);



    /**
     * [swiper slider]
     * @type {Swiper}
     */
    var someSwiperSliderSecond = new Swiper('.some-swiper-slider-second', {
        slidesPerView: 5,
        navigation: {
            nextEl: '.some-swiper-slider-second-next',
            prevEl: '.some-swiper-slider-second-prev'
        },
        spaceBetween: 0,
        centeredSlides: true,
        watchOverflow: true,
        loop: false,
        speed: 500,
        breakpoints: {
            560: {
                slidesPerView: 1
            },
            991: {
                slidesPerView: 3
            },
            1199: {
                slidesPerView: 5
            }
        }
    });



    // Ajax elems loading
    var startFrom = 12;
    function ajaxLoadContent() {
        $.ajax({
            type:'POST',
            url: 'ajax-content.html',
            data: {"startFrom" : startFrom},
            beforeSend: function(){
                $('.preloader').show().animate({opacity: 1}, 200);
            },
            success:function(data){
                if (data) {

                    $('.some-elems-container').append(data);

                    startFrom += 12;
                    console.log('start from: ' + startFrom);

                    var elemsTotal = $('.some-elem').length;
                    console.log('number of items: ' + elemsTotal);

                    // Remove button when all data loaded
                    if (startFrom > elemsTotal) {
                        console.log('Все данные загружены!');
                        $('.some-btn-container').remove();
                    }

                    // Remove button if there is no data
                } else {
                    console.log('Нет данных для загрузки!');
                    $('.some-btn-container').remove();
                }
            },
            complete:function(data){
                $('.preloader').hide().animate({opacity: 0}, 200);
            }
        });
    }

    $('.some-btn-more').click(function(){
        ajaxLoadContent();
    });



    // Some elems filtering by single data-attr
    var someFilteringElemsBtn = $('.some-filter-btn');
    someFilteringElemsBtn.eq(0).addClass('some-filter-btn-active');
    var someFilteringElem = $('.some-filtering-elems-container').find('.some-elem');
    someFilteringElem.hide().css("opacity","0");
    $(".some-elem[data-category='" + $('.some-filter-btn-active').attr("data-category") +"']").show().animate({opacity: 1}, 500);

    someFilteringElemsBtn.click(function(){
        someFilteringElem.addClass('some-filtered-elem');
        someFilteringElemsBtn.removeClass('some-filter-btn-active');
        someFilteringElem.hide().css("opacity","0");
        $(".some-elem[data-category='" + $(this).attr("data-category") +"']").show().animate({opacity: 1}, 500);
        $(this).addClass('some-filter-btn-active');

        // Check if button has no attr (undefined && false)
        var someFilteringElemsBtnAttr = $(this).attr('data-category');
        //console.log(someFilteringElemsBtnAttr);

        if (someFilteringElemsBtnAttr === undefined || someFilteringElemsBtnAttr === null) {
            someFilteringElem.addClass('some-filtered-elem');
            someFilteringElem.show().animate({opacity: 1}, 500);
        }
    });



    // Current modal-form title's value
    $('.some-elem-order-btn').each(function(){
        $(this).click(function(){
            var someElemTitle = $(this).parent('.some-elem-container').find('.some-elem-title').html();
            var someCurrentModal = $(this).attr('data-target');
            var someModalTitle = $(someCurrentModal).find('input[name="title"]').val(someElemTitle);
        });
    });



    // Get current custom select div value for sending
    $('.select-items div').click(function(){
        var selectedItemValue = $(this).html();
        $('form').find('input[name="select-value"]').val(selectedItemValue);
    });



    // Modal forms validation and sending
    $('#call-modal-form, #consultation-modal-form').submit(function () {
        var currentForm = $(this);
        $.ajax({
            type: "POST",
            url: 'mail.php',
            datatype: 'html',
            data: currentForm.serialize(),
            beforeSend: function(){
                $('.preloader').show().animate({opacity: 1}, 200);
            },
            success: function () {
                //console.log(currentForm);
                //console.log(currentForm.attr('id'));

                currentForm.parents('.modal').modal('hide');
                $('#success-modal').modal('show');

            },
            complete:function(data){
                $('.preloader').hide().animate({opacity: 0}, 200);
            },
            error: function () {
                //console.log(currentForm);
                currentForm.parents('.modal').modal('hide');
                $('#error-modal').modal('show');
            }
        });
        return false;
    });



    // Back-top button
    var backTopBtn = $('#back-top');
    backTopBtn.show(500);

    $(window).scroll(function(){
        if($(window).scrollTop() > 300){
            backTopBtn.removeClass('back-top_hide');
        }else{
            backTopBtn.addClass('back-top_hide');
        }
    });

    backTopBtn.click(function(){
        $('html,body').animate({scrollTop:0},1000);
    });

});