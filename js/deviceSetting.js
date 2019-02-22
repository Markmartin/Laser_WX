$(function () {


    $("#range01").slider({
        id: "range001",
        min: 0,
        max: 100,
        step: 1,
        value: 80,
        tooltip: 'always',
        formatter: function (value) {
            return value + '%';
        },

    });
    $("#range02").slider({
        id: "range002",
        min: 3000,
        max: 6000,
        step: 100,
        value: 4000,
        tooltip: 'always',
        formatter: function (value) {
            return value + 'K';
        },
    });

    $("#LightRange").slider({
        id: "range001",
        min: 0,
        max: 100,
        step: 1,
        value: 80,
        tooltip: 'always',
        formatter: function (value) {
            return value + "%";
        },

    });

    $("#ctRange").slider({
        id: "range002",
        min: 0,
        max: 100,
        step: 1,
        value: 80,
        tooltip: 'always',
        formatter: function (value) {
            // 这里只返回整数，算不出4000整
            if(value==29){
                return 4000+"K";
            }
            return 3000 + 3500 * value / 100 + "K";
        },
    });


});