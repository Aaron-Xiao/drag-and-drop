$(document).ready(function() {


	var timer = null;

	var box = $("#box");



	box.on("mousedown", function(e) {

		clearInterval(timer);

		// 鼠标按下时，相对于拖拽元素左上角的距离
		var disX = e.pageX - box.offset().left;
		var disY = e.pageY - box.offset().top;

		// 记录鼠标的历史坐标
		var prevX = e.pageX;
		var prevY = e.pageY;

		// 记录鼠标的移动速度
		var speedX = 0;
		var speedY = 0;

		$(document).on("mousemove", function(e) {

			// 计算拖拽的目标点的坐标
			var top = e.clientY - disY;
			var left = e.clientX - disX;

			// 坐标限制
			if(top < 0) {
				top = 0
			} else if(top >  $(window).height() - box.height()) {
				top =  $(window).height() - box.height();
			}

			if(left < 0) {
				left = 0;
			} else if(left > $(window).width() - box.width()) {
				left = $(window).width() - box.width();
			}

			box.css({
				"top": top + "px",
				"left": left + "px"
			})

			// 每一次检测到鼠标移动时，记录当时的鼠标坐标
			var currentX = e.pageX;
			var currentY = e.pageY;

			// 当前的鼠标坐标与上一次的鼠标坐标之间的差距，就是鼠标移动的速度
			speedX = currentX - prevX;
			speedY = currentY - prevY;

			// 更新鼠标的历史坐标
			prevX = currentX;
			prevY = currentY;
		})

		$(document).on("mouseup", function(e) {
			$(document).off("mousemove mouseup");

			move(speedX, speedY);

		})

		// 解决拖拽图片的问题，禁止图片的默认行为
		return false;
	})




	var show = function(target) {
		var timer = setInterval(function() {
			if(box.width() >= target) {
				clearInterval(timer);
				move(0, 0)
				return;
			} else {
				box.css({
					"width": box.width() + 10 + "px",
					"height": box.height() + 10 + "px",
					"top": box.position().top - 5 + "px",
					"left": box.position().left - 5 + "px",
				})
			}
		}, 50)
	}

	var move = function(speedX, speedY) {

		// 记录元素的坐标
		var eleX = 0;
		var eleY = 0;

		// 关闭计时器的判断
		var flag = 0;

		timer = setInterval(function() {

			// 记录元素的当前可视区坐标
			var currentX = box.position().left;
			var currentY = box.position().top;

			// 加速度
			speedY += 2;

			// 摩擦因子
			var factor = 0.75;

			// 计算元素在可视区的坐标轨迹
			var top = Math.round(currentY + speedY);
			var left = Math.round(currentX + speedX);

			// 碰撞检测
			if(top < 0) {
				top = 0;
				speedY *= -1;
			} else if(top > $(window).height() - box.height()) {
				top = $(window).height() - box.height();
				speedY *= -1;
				speedY *= factor;
				speedX *= factor * 1.1;    // 加快 X 方向的速度损失
			}

			if(left < 0) {
				left = 0;
				speedX *= -1;
				speedX *= factor;
			} else if(left > $(window).width() - box.width()) {
				left = $(window).width() - box.width();
				speedX *= -1;
				speedX *= factor;
			}
			
			// 判断元素的坐标是否改变，以此决定是否停止计时器
			// 如果元素的坐标没有变化，flag + 1
			// 如果元素的坐标一直没有变化，flag 就会一直增加
			// 如果 flag == 5 ，说明坐标已经连续 5 次没有变化过
			// 此时判定动画结束，关闭定时器
			if(top == eleY && left == eleX) {
				flag++;
				if(flag == 5) {
					clearInterval(timer);
				}
				return;
			} else {
				flag = 0;

				// 更新当前元素的坐标，方便下次比较
				eleX = left;
				eleY = top;
			}

			box.css({
				"top": top + "px",
				"left": left + "px"
			})

		}, 25)
	}



	// 入场动画
	show(100);

	
})



