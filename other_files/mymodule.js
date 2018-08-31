define(function () {
    'use strict';
    var api = {
    render: function render(container, view, css) {
    loadCss('ch04/mymodule.css');
    $(view).text('Hello, world!')
    .appendTo(container);
    }
    };
    return api;
   });
