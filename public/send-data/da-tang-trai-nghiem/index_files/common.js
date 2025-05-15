var ua = navigator.userAgent;
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    ua
);

function GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf('MSIE');
    if (Idx > 0)
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
    else if (!!navigator.userAgent.match(/Trident\/7\./))
        return 11;
    else
        return 0;
}

var mise = GetIEVersion();
if (mise > 0) {
    document.body.classList.add('isIE');
}


function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}

/*
document.querySelector('.nav__but').addEventListener('click', function () {
    document.body.classList.add('open__menu');

});

document.querySelector('.toggle-transition').addEventListener('click', function () {
    document.body.classList.remove('open__menu');
});
*/

// Open popup
function openPopup(popup) {
    if (document.querySelector(popup)) {
        document.querySelector('.popup__open') && document.querySelector('.popup__open').classList.remove('popup__open');
        document.body.classList.add('no-scroll');
        document.querySelector(popup).classList.add('popup__open');
    }
}

// Close Popup
function closePopup() {
    document.querySelector('.popup__open') && document.querySelector('.popup__open').classList.remove('popup__open');
    document.body.classList.remove('no-scroll');
}

function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight
    );
    return !(rect.bottom < 0 || rect.top - (viewHeight) >= 0);
}

function ImgLazyLoad() {

    lazyImages = window.innerWidth > 1024 ? document.querySelectorAll('.cm.lazy, .pc.lazy') : document.querySelectorAll('.cm.lazy, .sp.lazy');
    lazyBgs = window.innerWidth > 1024 ? document.querySelectorAll('.cm-bg.lazy, .pc-bg.lazy') : document.querySelectorAll('.cm-bg.lazy, .sp-bg.lazy');
  
    [].slice.call(lazyImages).forEach(function (elm) {
      if (elm.getBoundingClientRect().top <= window.innerHeight + threshold) {
        elm.setAttribute('src', elm.getAttribute('data-src'));
        elm.classList.remove('lazy');
      }
    });
  
    [].slice.call(lazyBgs).forEach(function (elm) {
      if (elm.getBoundingClientRect().top <= window.innerHeight + threshold) {
        elm.style.backgroundImage = 'url(' + elm.getAttribute('data-src') + ')';
        elm.classList.remove('lazy');
      }
    });
  
  }
  