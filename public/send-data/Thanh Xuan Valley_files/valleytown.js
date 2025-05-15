
// Focus Input
function inputHolder() {
    $('.form-control .input-txt, .form-control .area-txt').focus(function (e) {
        $(this).addClass('focus');
    }).focusout(function (e) {
        if ($(this).val() === '') {
            $(this).removeClass('focus');
        }
    });

}

function loadNews(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            $('#articleItems').append(data);
            loading = true;
        }
    });
}


function loadAlbum(id) {

    $.ajax({
        type: 'GET',
        url: '/Gallery/GalleryView/' + id,
        success: function (data) {
            $('#albumLoad').html(data);
            setTimeout(function () {
                createAlbumSlider();
                $('.album-overlay').addClass('show');
                loading = true;
            }, 50);
        }
    });
}



function loadLightBox() {

    $.ajax({
        type: 'GET',
        url: 'lightbox-dummy.html',
        success: function (data) {
            $('#lightboxLoad').html(data);
            setTimeout(function () {
                createLightBoxSlider();
                $('.lightbox').addClass('show');
                loading = true;
            }, 50);
        }
    });

}

var loading = true;

// ViewAlbum
$(document).on('click', '.view-album', function () {
    if (loading) {
        loading = false;
        var id = $(this).attr('id');
        loadAlbum(id);
    }
});

// Close Album
$(document).on('click', '.close-album', function () {
    $('.album-overlay').removeClass('show');
});

// View LightBox
$(document).on('click', '.act-item', function () {
    var index = parseInt($(this).attr('data-index'));
    swiperAlbum.slideToLoop(index, 1000, null);
    $('.lightbox').addClass('show');
});


// Close LightBox
$('.close-lightbox').click(function () {
    $('.lightbox').removeClass('show');
});


// ScrollDown
$(document).on('click', '.scroll-down', function () {
    var parent = $(this).closest('.section').next();
    if (parent) {
        var top = parent.offset().top;
        $('html, body').animate({
            scrollTop: top - 80
        }, 500);
    }
});

$(document).on('click', '.view-more', function () {
    var that = $(this);
    if (that.prev().hasClass('active')) {
        that.prev().removeClass('active');
        that.text('Xem thêm...');
    } else {
        that.prev().addClass('active');
        that.text('Thu gọn');
    }
});


$(document).on('click', '.floating-calen', function () {
    var offsetBotPage = document.body.scrollHeight;
    if ($('.contact').length) {
        var offetConnect = $('.contact').offset().top;
        $('html, body').animate({ scrollTop: offetConnect - 100 }, 800);
    } else {
        $('html, body').animate({ scrollTop: offsetBotPage }, 800);
    }
});

$(document).on('click', '.navigation .has-child span', function () {
    if (window.innerWidth < 1023) {
        if ($(this).parent().hasClass('show-child')) {
            $(this).parent().removeClass('show-child')
        } else {
            $(this).parent().addClass('show-child')
        }
    }
});

// Open menu
$(document).on('click', '.nav__but', function () {
    if ($('body').hasClass('open-menu')) {
        $('body').removeClass('open-menu');
    } else {
        $('body').addClass('open-menu');
    }
});


// change language
$(document).on('click', '.language', function () {
    var changeLanguage = $('html').attr('lang')
    if (changeLanguage === 'en') {
        $('html').attr('lang', 'vi');
    } else {
        $('html').attr('lang', 'en');
    }
});


function groupTabspainSlider() {
    $('.grouptab-block').each(function () {
        var $block = $(this);
        var swiper = new Swiper($block.find('.grouptab-spain-swiper')[0], {
            effect: "slide",
            loop: false,
            speed: 800,
            spaceBetween: 20,
            slidesPerView: 1,
            slidesPerGroup: 1,
            watchOverflow: true,
            navigation: {
                nextEl: $block.find('.swiper-button-next')[0],
                prevEl: $block.find('.swiper-button-prev')[0],
            },
            a11y: {
                enabled: false,
            },
            on: {
                slideChange: function () {
                    setTabReal($block, swiper.realIndex + 1);
                }
            }
        });
    });
}


function initGroupTab() {
    // Click tab sẽ điều khiển đúng swiper cùng block
    $(document).on('click', '.grouptab-block .tab-list li', function () {
        console.log('00');
        var $li = $(this);
        var $block = $li.closest('.grouptab-block'); // block riêng
        var index = $li.data('tab') - 1;

        // Tìm swiper trong block đó
        var swiperEl = $block.find('.grouptab-spain-swiper')[0];
        if (swiperEl && swiperEl.swiper) {
            swiperEl.swiper.slideTo(index);
        }

        // Set tab active
        $block.find('.tab-list li').removeClass('active');
        $li.addClass('active');
    });
}

function setTabReal($block, index) {
    $block.find('.tab-list li').removeClass('active');
    $block.find('.tab-list li[data-tab="' + index + '"]').addClass('active');
}

function journeySlider() {
    if ($('.journeys-slider').length) {
        var loop = true;
        var number = document.querySelectorAll('.journeys-item').length;
        if (number <= 3) {
            loop = false;
            document.querySelector('.journeys-slider').classList.add('hide-controls');
        }
        new Swiper('.journeys-swiper', {
            effect: "slide",
            loop: loop,
            speed: 800,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            slidesPerView: 1,
            slidesPerGroup: 1,
            breakpoints: {
                1023: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    spaceBetween: 20
                },
            },
            spaceBetween: 20,
            watchOverflow: true,
            a11y: {
                enabled: false,
            },
            navigation: {
                nextEl: '.journeys-line .swiper-button-next',
                prevEl: '.journeys-line .swiper-button-prev',
            },
            on: {
                init: function () { },
                transitionStart: function () {
                },
                transitionEnd: function () {
                },
            },
        });
    }
}


function librarySlider() {
    new Swiper('.library-swiper', {
        grid: {
            rows: 2, // Số hàng
            fill: 'row', // Sắp xếp theo hàng
        },
        spaceBetween: 20, // Khoảng cách giữa các cột
        slidesPerView: 1,
        slidesPerGroup: 1,
        breakpoints: {
            1023: {
                slidesPerView: 3,// Số cột hiển thị
                slidesPerGroup: 1,
                spaceBetween: 20
            },
        },

        loop: false, // Cho phép lặp lại
        // Navigation Buttons
        navigation: {
            nextEl: '.library-slider .swiper-button-next',
            prevEl: '.library-slider .swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
        }
    });
    new Swiper('.video-swiper', {
        grid: {
            rows: 2, // Số hàng
            fill: 'row', // Sắp xếp theo hàng
        },
        spaceBetween: 20, // Khoảng cách giữa các cột
        slidesPerView: 1,
        slidesPerGroup: 1,
        breakpoints: {
            1023: {
                slidesPerView: 2,// Số cột hiển thị
                slidesPerGroup: 1,
                spaceBetween: 20
            },
        },

        loop: false, // Cho phép lặp lại
        // Navigation Buttons
        navigation: {
            nextEl: '.video-button-next',
            prevEl: '.video-button-prev',
        }
    });

}


function showcaseSlider() {
    new Swiper('.showcase-swiper', {
        effect: "slide",
        loop: false,
        speed: 800,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        slidesPerView: 1.5,
        slidesPerGroup: 1,
        spaceBetween: 0,
        breakpoints: {
            1023: {
                slidesPerView: 4,
                slidesPerGroup: 1,
            },
        },
        watchOverflow: true,
        a11y: {
            enabled: false,
        },
        on: {
            init: function () { },
            transitionStart: function () {
            },
            transitionEnd: function () {
            },
        },
    });
}

function scrollPopUp() {
    if ($('.boxScroll').length) {
        $('.boxScroll').niceScroll({
            horizrailenabled: false,
            autohidemode: false,
            cursorwidth: "4px",
            cursorcolor: "#377156",
        });
    }
}

function tabSpain() {
    $(document).on('click', '.spain-tab-nav li', function () {
        var that = $(this);
        var parent = $(this).parent();
        var target = that.attr('data-tab');
        if (!that.hasClass('active')) {
            parent.find('li').removeClass('active');
            that.addClass('active');
            parent.prev().find('.item-tab').removeClass('active');
            parent.prev().find('.item-tab[data-tab=' + target + ']').addClass('active');
        }
    });
}

$(document).on('click', '#loadMoreNews', function () {
    if (loading) {
        var url = 'data-news.html';
        loading = false;
        loadNews(url);
    }
});


function grouptabSlider() {

    var groups = $('.group-tab');
    $(".group-tab").each(function (index) {
        var group = $(this);
        var lis = group.find('ul.nav-convenient li');
        lis.each(function (index) {
            var that = $(this);
            var target = that.attr("data-tab");
            $(this).on("click", function () {
                if (!that.hasClass('active')) {
                    $(group).find('.nav-convenient li').removeClass('active');
                    that.addClass('active');
                    if (window.innerWidth < 1023) {
                        var navPos = $(group).find('.wrap__nav').scrollLeft();
                        var itemPos = $(this).offset().left;
                        var delW = (8 * $(window).width()) / 100;
                        $(group).find('.wrap__nav').stop().animate({ scrollLeft: (itemPos + navPos) - 2 * delW }, 500);
                    }
                    $(group).find('.convenient-item').removeClass('active');
                    $(group).find('.convenient-item[data-tab="' + target + '"]').addClass('active');
                    /*$(group).find('.boxScroll').getNiceScroll().resize();*/

                    new Swiper('.disconnect-swiper', {
                        effect: "fade",
                        loop: true,
                        speed: 800,
                        autoplay: {
                            delay: 2000,
                            disableOnInteraction: false
                        },
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 20,
                        watchOverflow: true,
                        a11y: {
                            enabled: false,
                        },
                        on: {
                            init: function () { },
                            transitionStart: function () {
                            },
                            transitionEnd: function () {
                            },
                        },
                    });
                }
            });
        });
    });
}



function tabSlider() {
    $(document).on('click', '.nav-convenient li', function () {
        var that = $(this);
        var target = that.attr("data-tab");
        if (!that.hasClass('active')) {
            $('.nav-convenient li').removeClass('active');
            that.addClass('active');
            if (window.innerWidth < 1023) {
                var navPos = $('.wrap__nav').scrollLeft();
                var itemPos = $(this).offset().left;
                var delW = (8 * $(window).width()) / 100;
                $('.wrap__nav').stop().animate({ scrollLeft: (itemPos + navPos) - 2 * delW }, 500);
            }
            $('.convenient-item').removeClass('active');
            $('.convenient-item[data-tab="' + target + '"]').addClass('active');
            $('.boxScroll').getNiceScroll().resize();
        }
    });
}
function sprText() {
    if ($('.buts').length) {
        $('.but-txt.discover').blast({
            delimiter: "character",
            generateValueClass: true
        });
    }
}

function delayText() {
    var text = $('.discover');
    text.each(function (index, el) {
        var eachSpan = $(el).find('span');
        var delay = 0;
        eachSpan.each(function (index, el) {
            delay += 30;
            $(this).attr('style', '--delay:' + delay + 'ms');
        });
    });
}


var scrollbar = null;
var option = {
    alwaysShowTracks: false,
    x: 0,
    time: 1
}

function scrollSmooth() {
    scrollbar = Scrollbar.init(document.querySelector('#scrollbar'), option);
    scrollbar.track.xAxis.element.remove();
}

function mapSetup() {

    const elem = document.getElementById('map-zoom');
    const panzoom = Panzoom(elem, {
        maxScale: 8,
        disablePan: true,
        contain: 'outside',
        startScale: 1.1
    });

    //panzoom.pan(500, 500);

    //elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);


    $('img[usemap]').rwdImageMaps();

    $("area").mouseenter(function () {
        $('.map-overlay, .marker').removeClass('active');
        var target = $(this).attr('target');
        $('.map-overlay[data-map=' + target + '], .marker[data-map=' + target + ']').addClass('active');
    }).mouseleave(function () {
        $('.map-overlay, .marker').removeClass('active');
    });

    $("area").click(function () {

        !$('.map-introduction').hasClass('fade-out') && $('.map-introduction').addClass('fade-out');

        $('.info.current').addClass('fade-out');
        $('.map-overlay, .info, .marker').removeClass('current');

        $('.map-overlay, .marker').removeClass('current');

        var target = $(this).attr('target');
        $('.map-overlay[data-map=' + target + '], .info[data-map=' + target + '], .marker[data-map=' + target + ']').addClass('current');
        $('.map-info').addClass('current');


    });

    var rect = $('#container')[0].getBoundingClientRect();
    var mouse = { x: 0, y: 0, moved: false };

    $("#container").mousemove(function (e) {
        mouse.moved = true;
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Ticker event will be called on every frame
    gsap.ticker.add(function () {
        if (mouse.moved) {
            //parallaxIt(".map-move", -150);
            parallaxIt(".map-pic", -150);
        }
        mouse.moved = false;
    });

    function parallaxIt(target, movement) {
        gsap.to(target, 2, {
            x: (mouse.x - rect.width / 2) / rect.width * movement,
            y: (mouse.y - rect.height / 2) / rect.height * movement
        });
    }

    $(window).on('resize scroll', function () {
        rect = $('#container')[0].getBoundingClientRect();
    });

}


// Page Ready
var scrollTop = 0;
var scrollPos = 0;
var oldPost = 0;
var windowH = 0;
var threshold = 0;


function aniScroll() {

    scrollTop = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
    windowH = window.innerHeight;

    //var bannerH = (document.querySelector('.banner') && document.querySelector('.banner').clientHeight) || 102;

    if (scrollTop >= 100) {
        document.querySelector('.header').classList.add('fixed');
    } else {
        document.querySelector('.header').classList.remove('fixed');
    }

    [].slice.call(document.querySelectorAll('.banner, .pattern-item, .ani-item, .footer-cnt, .ani-fade')).forEach(function (elm) {
        if (checkVisible(elm)) {
            elm.classList.add('ani');
        } else {
            elm.classList.remove('ani');
        }
    });

    // Floating pic
    [].slice.call(document.querySelectorAll('.green-life, .nature, .parkzone-service')).forEach(function (elm) {
        if (Math.abs(elm.getBoundingClientRect().top) <= windowH) {

            var per = (windowH - elm.getBoundingClientRect().top) / windowH;

            var outerH = $(elm).find('.img-js').height();
            var imgH = $(elm).find('.img-js .pic').height();
            var delH = imgH - outerH;

            if (per >= 0 && per <= 1) {
                $(elm).find('.img-js .pic').css({ 'transform': 'translateY(' + -(per * delH) + 'px)' });
            }

        }
    });


    [].slice.call(document.querySelectorAll('.experience')).forEach(function (elm) {
        var elmH = $('.experience').innerHeight() + 408;
        var y = elm.getBoundingClientRect().top;
        var itemW = $('.experience-item__wrap').width();
        var itemL = $('.experience-item__wrap').length;
        var max = (itemW * itemL - itemL);

        if (Math.abs(y) == 260) {
            var move = elmH / scrollTop;
            var xPer = -10 * move + 7 / 2;
            xPer = xPer < 0 ? 0 : xPer;
            xPer = xPer > 1 ? 1 : xPer;

            var x = xPer * max;
            gsap.to(option, option.time, {
                x: x,
                onUpdate: () => {
                    scrollbar.scrollTo(option.x, 0, 0);
                }
            });

            if (xPer > 0) {
                $('.scroll-arrow, .scroll-note').addClass('scroll-action');
            } else {
                $('.scroll-arrow, .scroll-note').removeClass('scroll-action');
            }

        }


    });

    ImgLazyLoad();


}

function Resize() {
    if (!isMobile) {
        ImgLazyLoad();

        setTimeout(function () {
            $('.experience').css({ 'margin-bottom': $('.experience').innerHeight() + 408 });
        }, 100)
    }
}

function Rotate() {
    setTimeout(function () {
        ImgLazyLoad();
    }, 10);
}

window.addEventListener('scroll', function () {
    aniScroll();
});

window.addEventListener("orientationchange", function () {
    Rotate();
});

window.addEventListener('resize', function () {
    Resize();
});


// Page Ready
(function () {

    // Active menu
    var nav = document.querySelector('body').getAttribute('data-page');
    nav && (document.querySelector('.header li[data-nav=' + nav + ']') && document.querySelector('.header li[data-nav=' + nav + ']').classList.add('active'));

    setTimeout(function () {
        if (document.querySelector('#mainVideo')) {
            document.querySelector('.video-box').classList.add('video-playing');
            document.querySelector('#mainVideo').play();
        }
    }, 1000);

    if ($('.experience').length) {
        scrollSmooth();
    }

    if ($('.map').length) {
        mapSetup();
    }


    inputHolder();

    
    
    showcaseSlider();
    groupTabspainSlider();
    initGroupTab();
    tabSpain();
    journeySlider();
    
    librarySlider();
    /*tabSlider();*/
    grouptabSlider();
    sprText();
    setTimeout(function () {
        delayText();
        scrollPopUp();
    }, 300)

    setTimeout(function () {
        $('.loading-page').addClass('hide-loading');
        $('.experience').css({ 'margin-bottom': $('.experience').innerHeight() + 408 });
        $('.header').addClass('ani');

        aniScroll();

    }, 2000);

})();




function TotalLength() {
    var path = document.querySelector('#naturePath');
    var len = Math.round(path.getTotalLength());
    console.log("Path length - " + len);
};
//TotalLength();
