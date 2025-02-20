import gsap from 'gsap';
import { RefObject } from 'react';

export const sidebarAnimation = {
  open: (
    sidebarRef: RefObject<HTMLElement>,
    mainContentRef: RefObject<HTMLElement>,
    hamburgerRef: RefObject<HTMLElement>
  )  => {
    gsap.to(sidebarRef.current, {
      x: 0,
      duration: 0.5,
      ease: "power3.out"
    });
    gsap.to(mainContentRef.current, {
      marginLeft: "240px",
      width: "calc(100% - 240px)",
      duration: 0.5,
      ease: "power3.out"
    });
    gsap.to(hamburgerRef.current, {
      left: "180px",
      duration: 0.5,
      ease: "power3.out"
    });
  },
  close: (
    sidebarRef: RefObject<HTMLElement>,
    mainContentRef: RefObject<HTMLElement>,
    hamburgerRef: RefObject<HTMLElement>
  ) => {
    gsap.to(sidebarRef.current, {
      x: "-240px",
      duration: 0.5,
      ease: "power3.out"
    });
    gsap.to(mainContentRef.current, {
      marginLeft: "0",
      width: "100%",
      duration: 0.5,
      ease: "power3.out"
    });
    gsap.to(hamburgerRef.current, {
      left: "16px",
      duration: 0.5,
      ease: "power3.out"
    });
  }
};