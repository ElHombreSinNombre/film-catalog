document.addEventListener('astro:page-load', () => {
  const btnStar = document.getElementById('star-button') as HTMLButtonElement
  if (!btnStar) return
  btnStar.addEventListener('click', async (e) => {
    if (btnStar.disabled) return
    btnStar.disabled = true
    btnStar.style.pointerEvents = 'none'
    const imdb_id = btnStar.dataset.imdb_id
    const tmdb_id = btnStar.dataset.tmdb_id
    const item = (e.target as HTMLElement).closest(
      '.star-container'
    ) as HTMLElement
    const index = Number(item?.dataset.index)
    const isAmber = item?.querySelector('.text-amber-400')
    const vote_average = index - (isAmber ? 1 : 0)
    try {
      const response = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote_average, tmdb_id, imdb_id }),
      })
      if (!response.ok) throw new Error('Error in response')
      const data = await response.json()
      if (!data) throw new Error('No data received')
      btnStar.dataset.vote_average = String(data.vote_average)
      const allStars = btnStar.querySelectorAll('.star-container svg')
      allStars.forEach((svg, i) => {
        if (i < data.vote_average) {
          svg.classList.remove('text-zinc-600')
          svg.classList.add('text-amber-400')
        } else {
          svg.classList.remove('text-amber-400')
          svg.classList.add('text-zinc-600')
        }
      })
      const message = isAmber ? 'Stars removed' : 'Stars added'
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: { message: `${message} ⭐` },
        })
      )
    } catch (error) {
      console.error('Error toggling favourite', error)
      document.dispatchEvent(
        new CustomEvent('notify', {
          detail: { message: '❌ Error updating stars' },
        })
      )
    } finally {
      setTimeout(() => {
        btnStar.disabled = false
        btnStar.style.pointerEvents = 'auto'
      }, 1500)
    }
  })
})
