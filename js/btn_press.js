
if ('ontouchstart' in window) {
    $(".btn_highlight_large").on("touchstart", sele1);
    $(".btn_highlight_large").on("touchend", sele2);
    $(".btn_normal_large").on("touchstart", sele3);
    $(".btn_normal_large").on("touchend", sele4);
} else {
    $(".btn_highlight_large").on("mousedown", sele1);
    $(".btn_highlight_large").on("mouseup", sele2);
    $(".btn_normal_large").on("mousedown", sele3);
    $(".btn_normal_large").on("mouseup", sele4);
}


function sele1() {
    $(this).addClass("btn_highlight_large_to");
}
function sele2() {
    $(this).removeClass("btn_highlight_large_to");
}
function sele3() {
    $(this).addClass("btn_normal_large_to");
}
function sele4() {
    $(this).removeClass("btn_normal_large_to");
}



/*
$(".btn_highlight_large").on("touchstart mousedown", function () {
    $(this).addClass("btn_highlight_large_to");
});
$(".btn_highlight_large").on("touchend mouseup", function () {
    $(this).removeClass("btn_highlight_large_to");
});
$(".btn_normal_large").on("touchstart mousedown", function () {
    $(this).addClass("btn_normal_large_to");
});
$(".btn_normal_large").on("touchend mouseup", function () {
    $(this).removeClass("btn_normal_large_to");
});*/

