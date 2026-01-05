document.addEventListener('astro:page-load', () => {
  const btnHeart = document.getElementById('heart-button') as HTMLButtonElement
  if (!btnHeart) return
  btnHeart.addEventListener('click', async () => {
    if (btnHeart.disabled) return
    btnHeart.disabled = true
    btnHeart.style.pointerEvents = 'none'
    const imdb_id = btnHeart.dataset.imdb_id
    const tmdb_id = btnHeart.dataset.tmdb_id
    const isFavourite = btnHeart.dataset.favourite === 'true'
    const favourite = !isFavourite
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favourite, tmdb_id, imdb_id }),
      })
      if (!response.ok) throw new Error('Error in response')
      const data = await response.json()
      if (!data) throw new Error('No data received')
      btnHeart.dataset.favourite = String(data.favourite)
      const icon = btnHeart.querySelector('svg')
      if (icon) {
        icon.classList.toggle('text-red-500', data.favourite)
        icon.classList.toggle('text-gray-200', !data.favourite)
      }
      const message = data.favourite
        ? 'Favourite added ❤️'
        : 'Favourite removed💔'
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: { message: message },
        })
      )
    } catch (error) {
      console.error('Error toggling favourite', error)
      new CustomEvent('notify', {
        detail: { message: '❌ Error updating heart' },
      })
    } finally {
      setTimeout(() => {
        btnHeart.disabled = false
        btnHeart.style.pointerEvents = 'auto'
      }, 1500)
    }
  })
})
