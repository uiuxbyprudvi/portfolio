import { Component, signal, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  protected readonly title = signal('portfolio');
  protected readonly gitUrl = 'https://github.com/this-is-thiru/investment-tracker-fe';
  protected readonly figmaUrl = 'https://words-spider-91556155.figma.site/';
  protected caseStudyExpanded = signal(false);
  protected mobileMenuOpen = signal(false);
  private scrollListener?: () => void;
  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  toggleCaseStudy() {
    this.caseStudyExpanded.set(!this.caseStudyExpanded());
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

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
    // Handled by Angular Signal `caseStudyExpanded` in the template now.

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
