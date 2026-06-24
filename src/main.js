import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Navbar Scroll Behavior
  const navbar = document.getElementById('navbar')
  const handleScroll = () => {
    if (!navbar) return
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll() // Initial check

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menu-btn')
  const mobileMenu = document.getElementById('mobile-menu')
  const mobileLinks = document.querySelectorAll('.mobile-link')

  const toggleMenu = () => mobileMenu?.classList.toggle('hidden')
  menuBtn?.addEventListener('click', toggleMenu)

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileMenu?.classList.add('hidden'))
  })

  // GSAP Animations
  if (!prefersReducedMotion) {
    // Set initial hidden states via GSAP
    gsap.set('#hero-label, #hero-title, #hero-sub, #hero-ctas', { opacity: 0, y: 40 })
    gsap.set('#hero-img-wrap', { opacity: 0, y: 60 })
    gsap.set('.gsap-fade-up:not(#hero .gsap-fade-up)', { opacity: 0, y: 40 })
    gsap.set('.gsap-gallery-item', { opacity: 0, y: 50 })

    // Hero entrance timeline
    const heroTl = gsap.timeline()
    heroTl.fromTo('#hero-label',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    ).fromTo('#hero-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    ).fromTo('#hero-sub',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    ).fromTo('#hero-ctas',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    ).fromTo('#hero-img-wrap',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, ease: 'back.out(1.4)' },
      '-=0.4'
    )

    // Hero parallax background
    gsap.to('#hero-bg', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    // Scroll fade-up (not inside #hero)
    const fadeUpElements = document.querySelectorAll('.gsap-fade-up:not(#hero .gsap-fade-up)')
    fadeUpElements.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      )
    })

    // Gallery stagger
    gsap.fromTo('.gsap-gallery-item',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: { amount: 0.6, from: 'start' },
        scrollTrigger: {
          trigger: '#gallery-grid',
          start: 'top 85%'
        }
      }
    )

    // Gallery title parallax (desktop only)
    if (window.innerWidth >= 768) {
      gsap.to('#gallery-title-wrapper', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '#gallery-section',
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        }
      })
    }

    // CTA heading reveal
    gsap.fromTo('#cta h2',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#cta',
          start: 'top 80%'
        }
      }
    )
  } else {
    gsap.set('.gsap-fade-up, .gsap-gallery-item, #hero-img-wrap, #hero-label, #hero-title, #hero-sub, #hero-ctas', {
      opacity: 1, y: 0, transform: 'none'
    })
  }

  // Bouquet Carousel
  const bouquetCarousel = document.getElementById('bouquet-carousel')
  const bouquetDots = document.querySelectorAll('.bouquet-dot')
  let currentSlide = 0

  const updateDots = () => {
    if (!bouquetCarousel) return
    const scrollLeft = bouquetCarousel.scrollLeft
    const width = bouquetCarousel.offsetWidth
    const index = Math.round(scrollLeft / width)
    bouquetDots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-mocha', 'ring-2', 'ring-white')
        dot.classList.remove('bg-white/50')
      } else {
        dot.classList.remove('bg-mocha', 'ring-2', 'ring-white')
        dot.classList.add('bg-white/50')
      }
    })
    currentSlide = index
  }

  bouquetCarousel?.addEventListener('scroll', updateDots)

  const scrollToSlide = (index) => {
    if (!bouquetCarousel) return
    const width = bouquetCarousel.offsetWidth
    bouquetCarousel.scrollTo({ left: width * index, behavior: 'smooth' })
  }

  const moveBouquet = (direction) => {
    const totalSlides = 4
    if (direction === 'next') {
      currentSlide = (currentSlide + 1) % totalSlides
    } else {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    }
    scrollToSlide(currentSlide)
  }

  // Bind dot buttons
  bouquetDots.forEach((dot, index) => {
    dot.addEventListener('click', () => scrollToSlide(index))
  })

  // Bind navigation arrows
  const prevBtn = document.getElementById('carousel-prev')
  const nextBtn = document.getElementById('carousel-next')
  prevBtn?.addEventListener('click', () => moveBouquet('prev'))
  nextBtn?.addEventListener('click', () => moveBouquet('next'))

  // Refresh ScrollTrigger and initial dots on window load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh()
    updateDots()
  })

  // Trigger refresh on image load to ensure correct offsets
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) return
    img.addEventListener('load', () => ScrollTrigger.refresh())
  })
})
