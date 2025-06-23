// 獲取 DOM 元素
        const fabContainer = document.getElementById("fabContainer");
        const fabBtn = document.getElementById("fabBtn");
        const backdrop = document.getElementById("backdrop");
        const closeBtn = document.getElementById("closeBtn");
        const cardContent = document.querySelector(".card-content");

        // 開啟名片
        const openCard = () => {
            fabContainer.classList.add("expanded");
            backdrop.classList.add("active");
            document.body.style.overflow = "hidden";
            fabContainer.setAttribute("aria-expanded", "true");
        };

        // 關閉名片
        const closeCard = () => {
            fabContainer.classList.remove("expanded");
            backdrop.classList.remove("active");
            document.body.style.overflow = "";
            fabContainer.setAttribute("aria-expanded", "false");
        };

        // 事件監聽器
        fabBtn.addEventListener("click", openCard);
        closeBtn.addEventListener("click", closeCard);
        backdrop.addEventListener("click", closeCard);

        // ESC 鍵關閉功能
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && fabContainer.classList.contains("expanded")) {
                closeCard();
            }
        });

        // 防止名片內容的點擊事件冒泡
        cardContent.addEventListener("click", (e) => {
            if (e.target === cardContent) {
                e.stopPropagation();
            }
        });

        // 可選：添加觸控支援
        let touchStartY = 0;
        let touchEndY = 0;

        cardContent.addEventListener("touchstart", (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        cardContent.addEventListener("touchend", (e) => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            // 向下滑動超過 50px 時關閉
            if (touchStartY < touchEndY - 50) {
                closeCard();
            }
        };