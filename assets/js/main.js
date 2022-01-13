(function ($) {
	"use strict";

	var fn = {
		date: new Date(),

		Launch: function () {
			fn.Tooltip();
		},

		Tooltip: function () {
			var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
			var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
				return new bootstrap.Tooltip(tooltipTriggerEl)
			})
		},

		Copy: function (text) {
			var sampleTextarea = document.createElement("textarea");
			document.body.appendChild(sampleTextarea);
			sampleTextarea.value = text;
			sampleTextarea.select();
			document.execCommand("copy");
			document.body.removeChild(sampleTextarea);
		},
	};

	$('#btn-copy').click(function () {
		var text = "";
		text = $('#wallet-id').text();
		fn.Copy(text);
		alert("Copied to Clipboard");
	});

	$('#btn-copy0').click(function () {
		var text = "";
		text = $('#wallet-id0').text();
		fn.Copy(text);
		alert("Copied to Clipboard");
	});

	$(document).ready(function () {
		fn.Launch();
	});

})(jQuery);