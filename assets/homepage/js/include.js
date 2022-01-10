$w = $(window).width();
$h = $(window).height();

function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}

$duration = 3600 / 10;
var CreateAnimRotate = function ($obj) {
	var AnimStep = function () {
		$ngoc = $obj;
		$totalFrames = 6;
		$speed = 75;
		var ChangePosition = function ({$posLeft, $posTop, index}) {
			setTimeout(function () {
				$ngoc.css({
					backgroundPosition: `${$posLeft}% ${$posTop}%`,
				});
			}, $speed * index);
		};
		for (var i = 0; i < $totalFrames; i++) {
			$posLeft = 0;
			$posTop = 0;
			$rotation = 20;
			if (i === 0) {
				$posLeft = 0;
			}
			else {
				$posLeft = $rotation * i;
			}
			ChangePosition({$posLeft, $posTop, index: i});
		}
	};
	return setInterval(() => {
		AnimStep();
	}, $duration);
};
var gemInterval;
var colorCheckpoints;

var cothuong = $('.cothuong');
var bieudien1 = $('.bieudien1');
var logobacker_1 = $('.logobacker-1');
var bgroadmap_01 = $('.bgroadmap1');
var bgroadmap_02 = $('.bgroadmap2');
var menu = $('.menu');
var vongmathuat = $('.vongmathuat');
var orbitauEgge = $('#orbitau-egge');

window.addEventListener('load', function () {
	$('.background-top-1').css({"height": $h + "px"});
	$('.background-top-2').css({"height": $h + "px"});
	$('.background-top-3').css({"height": $h + "px"});
	$('.background-top-4').css({"height": $h + "px"});
	$('.background-top-5').css({"height": $h + "px"});


	const isMobile = window.matchMedia("only screen and (max-width: 640px)").matches;

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isMobile) {
		vongmathuat.html('');
		orbitauEgge.html(orbitauEggeMobileHtml);
		$('body').find('.bgroadmap1').html(`<img class="background-roadmap" src="/assets/homepage/images/frame-roadmap-2.png" />`)
		$('body').find('#doan1 .cothuong').html(`<img src="/assets/homepage/images/game-features-mb.png" alt="" />`)
		$('body').find('#doan2 .cothuong').html(`<img src="/assets/homepage/images/universe-mb.png" alt="" />`)
		$('body').find('#doan3 .cothuong').html(`<img src="/assets/homepage/images/roadmap-mb.png" alt="" />`)
		$('body').find('#doan4 .cothuong').html(`<img src="/assets/homepage/images/our-team-mb.png" alt="" />`)
		$('body').find('.logobacker-1').html(`<img src="/assets/homepage/images/logobacker-2.png" alt="" />`)
		$('body').find('#doan5').html(`<div class="tokenomic-mobile">
				<img class="" src="/assets/homepage/images/tokenomics-mb.jpg" alt="">
			</div>`)
		$('body').find('#orbitau--videobanner').html(`
			<div class="cover">
				<video playsinline autoplay muted loop class="video-bg">
					<source src="/assets/homepage/images/main-screen-mb.mp4" type="video/mp4">
				</video>
			</div>
		`)
	}
	else {
		vongmathuat.html(vongmathuatHtml)
		orbitauEgge.html(orbitauEggeDesktopHtml)
		$('body').find('.bgroadmap1').html(`<img class="background-roadmap" src="/assets/homepage/images/frame-roadmap.png" />`)
		$('body').find('#doan1 .cothuong').html(`<img src="/assets/homepage/images/game-features.png" alt="" />`)
		$('body').find('#doan2 .cothuong').html(`<img src="/assets/homepage/images/universe.png" alt="" />`)
		$('body').find('#doan3 .cothuong').html(`<img src="/assets/homepage/images/roadmap.png" alt="" />`)
		$('body').find('#doan4 .cothuong').html(`<img src="/assets/homepage/images/our-team.png" alt="" />`)
		$('body').find('.logobacker-1').html(`<img src="/assets/homepage/images/logobacker.png" alt="" />`)
		$('body').find('#doan5').html(``)
		$('body').find('#orbitau--videobanner').html(`
			<div class="cover">
				<video playsinline autoplay muted loop class="video-bg">
					<source src="/assets/homepage/images/main-screen.mp4" type="video/mp4">
				</video>
			</div>
		`)
	}

	colorCheckpoints = [
		{
			colorClass: "grey",
			offsetTop: $("#menu").position().top,
		},
		{
			colorClass: "green",
			offsetTop: $("#doan2").position().top + 1000,
		},
		{
			colorClass: "green",
			offsetTop: $("#map2").position().top + 1000,
		},
		{
			colorClass: "red",
			offsetTop: $("#doan1").position().top + 2500,
		},
		{
			colorClass: "red",
			offsetTop: $("#map1").position().top + 2500,
		},
		{
			colorClass: "blue",
			offsetTop: $("#roadmap").position().top + 300 + 3800,
		},
		{
			colorClass: "grey",
			offsetTop: $("#ourteam").position().top + 300 + 4800,
		},
		{
			colorClass: "orange",
			offsetTop: $("#doan5").position().top + 300 + 5500,
		},
	];

	colorCheckpoints.map((c, index) => {
		// Select gem placement side
		let side = choose(["left", "right"]);
		if ($(`.vien-ngoc.${c.colorClass}.${side}`).length > 0) {
			side = ["left", "right"].find((s) => s != side);
		}

		const gem = $(`
			<div class="rellax vien-ngoc ${side} ${c.colorClass}"
				data-rellax-speed="6"
				style="top: ${c.offsetTop + randomInteger(50, 200)}px;"
				data-section="${index}"
				data-scroll-speed="${randomInteger(12, 20)}"
			>
			</div>
		`);
		gem.css(side, randomInteger(0, 5) + "%");
		gem.appendTo(".gem-container");
	});

	var rellax = new Rellax(".rellax");
	gemInterval = CreateAnimRotate($(".vien-ngoc"));
})


var vongmathuatHtml = `
		<div class="nguhanh"><img src="/assets/homepage/images/vongxoay.png" alt=""></div>
		<div class="avatar-loop">
			<video autoplay muted loop class="video-bg">
				<source src="/assets/homepage/images/logo-loop.mp4" type="video/mp4">
			</video>
		</div>
	`;
var orbitauEggeMobileHtml = `
		<div class="oneblock">
			<div class="trung2"><img src="/assets/homepage/images/trung-2.png" alt="" /></div>
		</div>
	`;
var orbitauEggeDesktopHtml = `
		<div class="oneblock">
			<div class="trung1"><img src="/assets/homepage/images/trung.png" alt="" /></div>
		</div>
	`;


$(window).scroll(function () {
	let a = ($(window).scrollTop() - ($("#doan1").offset().top - 950)) / 400
	let b = ($(window).scrollTop() - ($("#doan2").offset().top - 950)) / 400
	let c = ($(window).scrollTop() - ($("#doan3").offset().top - 950)) / 400
	let d = ($(window).scrollTop() - ($("#doan4").offset().top - 950)) / 400
	let e = ($(window).scrollTop() - ($("#doan5").offset().top - 900)) / 500

	$(".background-top-2").css("opacity", a)
	$(".background-top-3").css("opacity", b)
	$(".background-top-4").css("opacity", c)
	$(".background-top-5").css("opacity", d)
	$(".tokenomic").css("opacity", e)

})

