document.querySelectorAll('.card-wrap').forEach(cardWrap => {
    const cardBg = cardWrap.querySelector('.card-bg');
    
    // Set the background image from the data attribute
    cardBg.style.backgroundImage = `url(${cardWrap.dataset.image})`;
  
    cardWrap.addEventListener('mousemove', (e) => {
      const { width, height } = cardWrap.getBoundingClientRect();
      const mouseX = e.clientX - cardWrap.offsetLeft - 10;
      const mouseY = e.clientY - cardWrap.offsetTop;
  
      const xPercent = (mouseX / width) * 5;
      const yPercent = (mouseY / height) * 5;
  
      // Apply transformations to create the parallax effect
      cardBg.style.transform = `translate(-${xPercent}%, -${yPercent}%)`;
    });
  
    cardWrap.addEventListener('mouseleave', () => {
      // Reset the background position when the mouse leaves
      cardBg.style.transform = 'translate(0, 0)';
    });
  });
  