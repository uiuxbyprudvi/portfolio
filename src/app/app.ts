import { Component, signal, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('portfolio');
  private scrollListener?: () => void;
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // 1. Reveal Animations with IntersectionObserver
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = this.el.nativeElement.querySelectorAll('.reveal');
    revealElements.forEach((el: Element) => this.observer?.observe(el));

    // 2. Case Study Toggle Logic
    const toggleBtn = this.el.nativeElement.querySelector('#toggleCaseStudy');
    const content = this.el.nativeElement.querySelector('#caseStudyContent');
    const toggleText = this.el.nativeElement.querySelector('#toggleText');

    if (toggleBtn && content && toggleText) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = content.classList.contains('expanded');
        if (!isExpanded) {
          content.classList.add('expanded');
          content.style.maxHeight = content.scrollHeight + 'px';
          toggleText.textContent = 'SHOW LESS';
        } else {
          content.classList.remove('expanded');
          content.style.maxHeight = '0';
          toggleText.textContent = 'VIEW CASE STUDY';
        }
      });
    }

    // 3. Scroll Spy and Nav Interactions
    const navLinks = this.el.nativeElement.querySelectorAll('.nav-link');
    const sections = this.el.nativeElement.querySelectorAll('section, main');

    const scrollSpy = () => {
      let current = "";
      sections.forEach((section: HTMLElement) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute("id") || "";
          if (!current && section.tagName === 'MAIN') current = ""; // Home/Hero
        }
      });

      navLinks.forEach((link: HTMLElement) => {
        link.classList.remove("active-nav");
        if (link.getAttribute("data-section") === current) {
          link.classList.add("active-nav");
        }
      });
    };

    this.scrollListener = scrollSpy;
    window.addEventListener("scroll", scrollSpy);
    scrollSpy(); // Initial call
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
