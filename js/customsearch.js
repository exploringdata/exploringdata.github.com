(function() {
  const cx = '017337174147211687926:ocjb1eiqcfw';
  const gcse = document.createElement('script');
  gcse.type = 'text/javascript';
  gcse.async = true;
  gcse.src = `${window.location.protocol}//www.google.com/cse/cse.js?cx=${cx}`;

  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(gcse, s);
})();

document.addEventListener('DOMContentLoaded', function() {
  const query = decodeURIComponent(window.location.search.replace(/\?.*q=/, '')).replace(/\+/g, ' ');

  if (query) {
      document.getElementById('gsc-search').classList.remove('hidden');
      document.getElementById('q').value = query;
  }
});