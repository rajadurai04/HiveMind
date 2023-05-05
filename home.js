const tabs = document.querySelectorAll(".tabs__content");
const tabBtns = document.querySelectorAll(".tabs__label");
const tab_nav = function (tabBtnClick) {
  tabBtns.forEach((tabBtn) => {
    tabBtn.classList.remove("active");
  });
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  tabBtns[tabBtnClick].classList.add("active");
  tabs[tabBtnClick].classList.add("active");
};
tabBtns.forEach((tabBtn, i) => {
  tabBtn.addEventListener("click", () => {
    tab_nav(i);
  });
});
