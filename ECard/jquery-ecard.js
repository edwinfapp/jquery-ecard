/**
 * https://github.com/edwinfapp/jquery-ecard 
 */
(function($) {

	$.fn.ecard = function() {
		this.each(function() {

			// ---------------------------------------------------------------------

			var isNew = (this.$ecard === undefined);

			if (isNew) {
				this.$ecard = {
					self : this,
					ec_cards : null,
					touching : false,
					ww : 0,
					initTime : null,
					endTime : null,

					ajust : function() {

						this.self.$ecard.ec_cards = $(this.self).find("> .ec_cards");
						this.self.$ecard.ec_cards.removeClass("ec_cards_hover");

						var ww = $(this.self).width();
						this.self.$ecard.ww = ww;

						this.self.$ecard.ec_cards.each(function() {
							$(this).children().width(ww).each(function(i) {
								$(this).css({
									left : i * ww
								});
							});
							$(this).width(ww * $(this).children().length);
						});

						var ps = parseInt(this.self.$ecard.ec_cards.css("left"));

						var nps = Math.round(ps / ww) * ww;

						var et = this.self.$ecard.endTime;
						var it = this.self.$ecard.initTime;

						if (this.self.$ecard.moving && et != null && it != null) {
							if (et - it < 500 && nps == this.self.$ecard.initcards) {
								if (this.self.$ecard.dx > 0) {
									nps += ww;
								} else {
									nps -= ww;
								}
							}
						}

						if (nps > 0) {
							nps = 0;
						}

						var mw = this.self.$ecard.ec_cards.width() - ww;
						if (nps < -mw) {
							nps = -mw;
						}

						this.self.$ecard.ec_cards.animate({
							left : nps,
						}, 150, function() {
						});

					}
				};
			}

			// ---------------------------------------------------------------------

			this.$ecard.ajust();

			// ----------------------------------------------------------------------

		});
		return this;
	};

}(jQuery));

$(function() {

	$(".ec_area").ecard();

	window.setTimeout(function() {
		$(".ec_area").ecard();
	}, 100);

	$(window).resize(function() {
		$(".ec_area").each(function() {
			if (this.$ecard !== undefined) {
				this.$ecard.ajust();
			}
		});
	});

	// ---------------------------------------------------

	$("body").on('mousedown', ".ec_area", function(e) {

		if (this.$ecard === undefined) {
			return;
		}

		if (this.$ecard.touching) {
			return;
		}

		this.$ecard.touching = true;
		this.$ecard.moving = false;
		this.$ecard.initTime = new Date().getTime();
		this.$ecard.endTime = null;
		this.$ecard.dx = 0;

		this.$ecard.initcards = parseInt(this.$ecard.ec_cards.css("left"));

		this.$ecard.touch_identifier = 0;
		this.$ecard.startPoint = {
			x : e.pageX,
			y : e.pageY
		};

	});

	// ---------------------------------------------------------------------

	$("body").on('touchstart', ".ec_area", function(e) {

		if (this.$ecard === undefined) {
			return;
		}

		if (this.$ecard.touching) {
			return;
		}

		this.$ecard.touching = true;
		this.$ecard.moving = false;
		this.$ecard.initTime = new Date().getTime();
		this.$ecard.endTime = null;
		this.$ecard.dx = 0;

		this.$ecard.initcards = parseInt(this.$ecard.ec_cards.css("left"));

		if (e.originalEvent.touches && e.originalEvent.touches[0]) {

			var touch = e.originalEvent.touches[0];

			this.$ecard.touch_identifier = touch.identifier;
			this.$ecard.startPoint = {
				x : touch.screenX,
				y : touch.screenY
			};

		}
	});

	// ----------------------------------------------------------------------

	$("body").on('mouseup', function(e) {

		$(".ec_area").each(function() {

			if (this.$ecard === undefined) {
				return;
			}

			this.$ecard.endTime = new Date().getTime();

			if (!this.$ecard.touching) {
				return;
			}

			this.$ecard.ajust();
			this.$ecard.touching = false;

		});
	});

	// ----------------------------------------------------------------------

	$("body").on('touchend', function(e) {

		$(".ec_area").each(function() {

			if (this.$ecard === undefined) {
				return;
			}

			this.$ecard.endTime = new Date().getTime();

			if (!this.$ecard.touching) {
				return;
			}

			for (var i = 0; i < e.originalEvent.changedTouches.length; i++) {

				var touch = e.originalEvent.changedTouches[i];

				if (touch.identifier == this.$ecard.touch_identifier) {
					this.$ecard.ajust();
				}
			}

			this.$ecard.touching = false;

		});
	});

	// ----------------------------------------------------------------------

	$("body").on('mouseleave', function(e) {

		$(".ec_area").each(function() {

			if (this.$ecard === undefined) {
				return;
			}

			if (this.$ecard.touching) {
				e.preventDefault();
				this.$ecard.touching = false;
				this.$ecard.ajust();
			}

		});
	});

	// ----------------------------------------------------------------------

	$("body").on('touchcancel', function(e) {

		$(".ec_area").each(function() {

			if (this.$ecard === undefined) {
				return;
			}

			if (this.$ecard.touching) {
				e.preventDefault();
				this.$ecard.touching = false;
				this.$ecard.ajust();
			}

		});
	});

	// ----------------------------------------------------------------------

	$("body").on('mousemove', function(e) {

		$(".ec_area").each(function() {

			if (this.$ecard === undefined) {
				return;
			}

			if (!this.$ecard.touching) {
				return;
			}

			var dx = e.pageX - this.$ecard.startPoint.x;
			var dy = e.pageY - this.$ecard.startPoint.y;

			if (this.$ecard.moving) {
				e.preventDefault();
				this.$ecard.dx = dx;
				var ll = this.$ecard.initcards + dx;
				this.$ecard.ec_cards.css("left", ll + "px");
			} else {

				if (Math.abs(dy) > 15) {
					this.$ecard.touching = false;
					return false;
				}

				if (Math.abs(dx) > 20) {
					this.$ecard.moving = true;
					this.$ecard.ec_cards.addClass("ec_cards_hover");
				}
			}

		});

	});

	// ----------------------------------------------------------------------

	$("body").on('touchmove', function(e) {

		$(".ec_area").each(function() {

			if (this.$ecard === undefined) {
				return;
			}

			if (!this.$ecard.touching) {
				return;
			}

			if (e.originalEvent.touches.length == 0 || this.$ecard.startPoint === null) {
				this.$ecard.touching = false;
				return false;
			}

			for (var i = 0; i < e.originalEvent.touches.length; i++) {

				var touch = e.originalEvent.touches[i];

				if (touch.identifier == this.$ecard.touch_identifier) {
					var dx = touch.screenX - this.$ecard.startPoint.x;
					var dy = touch.screenY - this.$ecard.startPoint.y;

					if (this.$ecard.moving) {
						e.preventDefault();
						this.$ecard.dx = dx;
						var ll = this.$ecard.initcards + dx;
						this.$ecard.ec_cards.css("left", ll + "px");
					} else {

						if (Math.abs(dy) > 15) {
							this.$ecard.touching = false;
							return false;
						}

						if (Math.abs(dx) > 20) {
							this.$ecard.moving = true;
							this.$ecard.ec_cards.addClass("ec_cards_hover");
						}
					}

				}
			}
		});

	});

	// ----------------------------------------------------------------------

});
