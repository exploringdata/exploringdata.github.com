// adapt containerwidth to screen size
var containerwidth = function(selector) {
    return parseInt($(selector).width())
};
function containerDim(selector, dim) {
    return parseInt(d3.select(selector).style(dim))
}
$(function(){
    $('.nav a[href="'+document.location.pathname+'"]').parent('li').attr('class', 'active');
    $('.showhelp').click(function(e){
        e.preventDefault();
        $('#help').modal();
    });
});