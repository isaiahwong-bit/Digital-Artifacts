/* Only progressively enhance the explanatory media. */
document.querySelectorAll('.journey-film').forEach(video => {
  video.addEventListener('error', () => {
    const note = document.createElement('p');
    note.className = 'inline-note';
    note.textContent = 'The film could not load. The full example is explained in the four steps alongside it.';
    video.after(note);
  }, {once:true});
});
