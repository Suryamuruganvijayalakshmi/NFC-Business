/* eslint-disable */
"use client";
import "./hero-02.css";


import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Asset root — flat files in package assets/. */
const A = "/originkit/hero-02";

const NAV_LINKS = [
  { label: "Benefits", href: undefined },
  { label: "Pricing", href: undefined },
  { label: "Testimonials", href: undefined },
] as const;

const BRAND_LOGOS = [
  { name: "Lumina", src: `${A}/brand-lumina.svg` },
  { name: "Vortex", src: `${A}/brand-vortex.svg` },
  { name: "Velocity", src: `${A}/brand-velocity.svg` },
  { name: "Synergy", src: `${A}/brand-synergy.svg` },
  { name: "Enigma", src: `${A}/brand-enigma.svg` },
  { name: "Spectrum", src: `${A}/brand-spectrum.svg` },
] as const;

/** ease-out-cubic — enter animations (Emil Kowalski) */
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

const SHARED_TWEEN = {
  type: "tween" as const,
  duration: 0.4,
  ease: EASE_OUT,
};

const PHONE_STAGGER = 0.09;
const CARD_STAGGER = 0.07;
/** Cards start after the three phones finish staggering in */
const CARD_DELAY_BASE = PHONE_STAGGER * 3 + 0.04;

/** Stable shuffled order — looks random, hydration-safe */
const CARD_REVEAL_ORDER = ["stats", "actions", "liked", "comment"] as const;

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    width="20"
    height="14"
    viewBox="0 0 20 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="size-[20px]"
  >
    <path
      d="M1 1.5h18M1 7h18M1 12.5h11"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar = () => (
  <nav
    aria-label="Primary"
    className="relative z-30 h-[81px] lg:h-[85px] mx-auto flex w-full max-w-[995px] items-center justify-between overflow-clip rounded-full border border-solid border-[#dee5ed] bg-white py-3.5 pr-3.5 pl-5 lg:max-w-[800px]"
  >
    <a
      aria-label="Capable home"
      className="relative h-11 w-[148px] shrink-0 touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6]"
     onClick={(e) => e.preventDefault()}>
      {/* Logo mark — Figma inset + mirrored */}
      <span className="absolute inset-[2.27%_71.59%_2.27%_0] flex items-center justify-center">
        <span className="relative size-full -scale-x-100 overflow-clip">
          <Image
            src={`${A}/logo-capable-mark.svg`}
            alt=""
            width={42}
            height={42}
            className="size-full object-contain"
            aria-hidden="true"
          />
        </span>
      </span>
      {/* Wordmark */}
      <span className="absolute inset-[25.81%_1.65%_22.58%_33.79%] overflow-clip">
        <Image
          src={`${A}/logo-capable-text.svg`}
          alt=""
          width={96}
          height={23}
          className="size-full object-contain object-left"
          aria-hidden="true"
        />
      </span>
    </a>

    <ul
      className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[18px] ipad-landscape:flex"
      aria-label="Navigation links"
    >
      {NAV_LINKS.map((link) => (
        <li key={link.label}>
          <a
            className="inline-flex items-center text-[17px] font-medium leading-normal whitespace-nowrap text-[#333] transition-colors duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6] [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#1d1d1d]"
           onClick={(e) => e.preventDefault()}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>

    <a
      className="text-[17px] hidden shrink-0 touch-manipulation items-center overflow-clip rounded-full bg-[#923cf6] px-5 py-4 text-base font-semibold leading-normal whitespace-nowrap text-white transition-[background-color,transform] duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6] motion-reduce:transition-none ipad-landscape:inline-flex [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#8129e0] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02]"
     onClick={(e) => e.preventDefault()}>
      Join Waitlist
    </a>

    <button
      type="button"
      aria-label="Open menu"
      className="inline-flex h-[53px] w-[64px] shrink-0 touch-manipulation items-center justify-center overflow-clip rounded-full bg-[#923cf6] transition-[background-color,transform] duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6] motion-reduce:transition-none ipad-landscape:hidden [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#8129e0] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02]"
    >
      <MenuIcon />
    </button>
  </nav>
);

const AnnouncementBadge = () => (
  <a
    className="inline-flex touch-manipulation items-center gap-1 overflow-clip rounded-full border border-solid border-[#dee5ed] bg-[#f1f4f8] py-1.5 pr-3 pl-1.5 shadow-[0_0_0_3px_white,0_4px_2px_rgba(140,150,169,0.25),0_8px_17.2px_rgba(140,150,169,0.1)] transition-[background-color,border-color,transform] duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:border-[#c9d3e0] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#e8edf4] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02]"
   onClick={(e) => e.preventDefault()}>
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center justify-center overflow-clip rounded-full bg-[#923cf6] px-3 py-[5px] text-[16px] font-semibold leading-normal text-white">
        New
      </span>
      <span className="text-center text-[17px] font-medium leading-normal whitespace-nowrap text-[#262626]">
        Build your connections now
      </span>
    </span>
    <span className="relative size-[18px] shrink-0 overflow-clip">
      <Image
        src={`${A}/arrow-right.svg`}
        alt=""
        width={18}
        height={18}
        className="size-full"
        aria-hidden="true"
      />
    </span>
  </a>
);

const BrandLogoItem = ({
  brand,
  duplicate = false,
}: {
  brand: (typeof BRAND_LOGOS)[number];
  duplicate?: boolean;
}) => (
  <li
    className="relative h-[42px] w-[126px] shrink-0 overflow-clip"
    aria-hidden={duplicate || undefined}
  >
    <Image
      src={brand.src}
      alt={duplicate ? "" : brand.name}
      width={126}
      height={42}
      className="size-full object-contain"
      aria-hidden={duplicate}
    />
  </li>
);

const TrustedBy = () => (
  <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-7.5 px-0 md:px-5">
    <p className="text-center text-[16px] lg:text-[18px] font-medium leading-normal text-[#1d1d1d]">
      Trusted by 1000+ businesses across the world
    </p>

    <div
      className="relative w-full max-w-[820px] overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      aria-label="Trusted brands"
      role="region"
    >
      <ul className="flex w-max items-center gap-x-2 iphone:gap-x-3.5 animate-trusted-marquee motion-reduce:animate-none will-change-transform">
        {BRAND_LOGOS.map((brand) => (
          <BrandLogoItem key={brand.name} brand={brand} />
        ))}
        {BRAND_LOGOS.map((brand) => (
          <BrandLogoItem
            key={`${brand.name}-duplicate`}
            brand={brand}
            duplicate
          />
        ))}
      </ul>
    </div>
  </div>
);

type PhoneMockupProps = {
  screen: string;
  screenWidth: number;
  screenHeight: number;
  className?: string;
  style?: CSSProperties;
};

/** Mobile.svg frame — Vector + Dynamic Island layered above the solid SVG fill. */
const PhoneMockup = ({
  screen,
  screenWidth,
  screenHeight,
  className = "",
  style,
}: PhoneMockupProps) => (
  <div className={`relative overflow-clip ${className}`} style={style}>
    {/* Device chrome */}
    <Image
      src={`${A}/Mobile.svg`}
      alt=""
      aria-hidden="true"
      width={235}
      height={476}
      priority
      className="pointer-events-none absolute inset-0 size-full object-fill"
    />

    {/* Screen content — above the solid SVG fill, clipped to the display inset */}
    <div
      aria-hidden="true"
      className="absolute inset-[2.1%_4.9%_2.1%_4.9%] z-[1] overflow-clip rounded-[6%] bg-[#1d1d1b]"
    >
      <Image
        src={screen}
        alt=""
        width={screenWidth}
        height={screenHeight}
        priority
        className="pointer-events-none size-full max-w-none object-cover object-top"
      />
    </div>

    {/* Dynamic Island overlays the screen */}
    <Image
      src={`${A}/dynamic-island.svg`}
      alt=""
      aria-hidden="true"
      width={52}
      height={16}
      priority
      className="pointer-events-none absolute top-[3%] left-1/2 z-[2] w-[22.1%] -translate-x-1/2"
    />
  </div>
);

const LikedCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex items-center gap-2.5 overflow-clip rounded-full border border-solid border-[#dee5ed] bg-white py-2 pr-3 pl-2 shadow-[0_0_0_2px_white,0_15px_28.6px_rgba(0,0,0,0.12)] ${className}`}
  >
    <div className="flex items-center">
      {(
        [
          `${A}/avatar-1.png`,
          `${A}/avatar-2.png`,
          `${A}/avatar-3.png`,
        ] as const
      ).map((src, index) => (
        <span
          key={src}
          className={`relative size-7 shrink-0 overflow-clip rounded-full ${index < 2 ? "mr-[-11px]" : ""}`}
        >
          <Image
            src={src}
            alt=""
            width={28}
            height={28}
            className="size-full object-cover"
            aria-hidden="true"
          />
        </span>
      ))}
    </div>
    <span className="flex items-center gap-0.5">
      <Image
        src={`${A}/heart.svg`}
        alt=""
        width={24}
        height={24}
        className="size-6"
        aria-hidden="true"
      />
      <span className="text-[15px] font-medium leading-normal whitespace-nowrap text-[#1d1d1d]">
        Liked
      </span>
    </span>
  </div>
);

const ActionsCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex items-start gap-[5.931px] overflow-clip rounded-full bg-white p-[5.931px] shadow-[0_0_0_2px_white,0_15px_28.6px_rgba(0,0,0,0.12)] ${className}`}
  >
    {(
      [
        { label: "Edit Profile", active: false },
        { label: "Ads", active: false },
        { label: "Insight", active: true },
      ] as const
    ).map((item) => (
      <span
        key={item.label}
        className={
          item.active
            ? "inline-flex items-center rounded-full bg-[#923cf6] px-[14.826px] py-[8.896px] text-[11.861px] font-medium leading-normal whitespace-nowrap text-white"
            : "inline-flex items-center rounded-full border-[0.741px] border-solid border-[#dee5ed] bg-white px-[14.826px] py-[8.896px] text-[11.861px] font-medium leading-normal whitespace-nowrap text-[#262626]"
        }
      >
        {item.label}
      </span>
    ))}
  </div>
);

const StatsCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex w-[216px] items-start justify-between overflow-clip rounded-[10.205px] border-[0.85px] border-solid border-[#dee5ed] bg-white p-[13.606px] shadow-[0_0_0_1.701px_white,0_8.504px_32.315px_rgba(0,0,0,0.12)] ${className}`}
  >
    {(
      [
        { value: "58", label: "Posts" },
        { value: "486", label: "Follower" },
        { value: "397", label: "Following" },
      ] as const
    ).map((stat) => (
      <div
        key={stat.label}
        className="flex flex-col items-center gap-[3.402px]"
      >
        <span className="text-[15.307px] font-bold tracking-[0.1531px] text-[#1d1d1d]">
          {stat.value}
        </span>
        <span className="text-[11.906px] font-medium tracking-[0.1191px] text-[#333]">
          {stat.label}
        </span>
      </div>
    ))}
  </div>
);

const CommentCard = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex w-[279px] flex-col gap-[16.127px] rounded-[16.127px] bg-white p-[16.127px] shadow-[0_-1.613px_14.353px_rgba(124,124,155,0.08),0_17.74px_35.802px_rgba(0,0,0,0.12)] ${className}`}
  >
    <div className="flex w-full items-start gap-[12.095px]">
      <span className="relative size-[40.318px] shrink-0 overflow-clip rounded-full">
        <Image
          src={`${A}/avatar-comment.png`}
          alt=""
          width={40}
          height={40}
          className="size-full object-cover"
          aria-hidden="true"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[7.257px]">
        <p className="text-[12.902px] font-medium leading-normal text-[#1d1d1d]">
          Kurniawan
        </p>
        <p className="text-[9.676px] leading-normal tracking-[0.4838px] text-[#333]">
          I like the overall vibe! How do you create that arrow on the all
          design?
        </p>
      </div>
    </div>
    <div className="flex items-center gap-[20.159px]">
      <span className="flex items-center gap-[6.451px]">
        <Image
          src={`${A}/icon-like.svg`}
          alt=""
          width={15}
          height={15}
          className="size-[14.5px] rotate-180"
          aria-hidden="true"
        />
        <span className="text-[9.676px] text-[#808080]">Like</span>
      </span>
      <span className="flex items-center gap-[6.451px]">
        <span className="relative h-[13.7px] w-4">
          <Image
            src={`${A}/icon-comment-line.svg`}
            alt=""
            width={16}
            height={14}
            className="absolute inset-0 size-full"
            aria-hidden="true"
          />
          <Image
            src={`${A}/icon-comment-dot.svg`}
            alt=""
            width={8}
            height={2}
            className="absolute top-[4.4px] left-[2.8px] h-[1.6px] w-2"
            aria-hidden="true"
          />
        </span>
        <span className="text-[9.676px] text-[#808080]">Comment</span>
      </span>
    </div>
  </div>
);

/** Desktop artboard — Figma 3049:7876 */
const DESKTOP_ARTBOARD = { width: 1440, height: 342 } as const;
/** Below desktop — center phone + 3 cards; crop matches iPad reference */
const TABLET_ARTBOARD = { width: 900, height: 560 } as const;
const TABLET_PHONE = {
  width: 473,
  fullHeight: (735.556 * 473) / 364,
  /** Caps at header → top of post image (ref ≈525 @ 473w) */
  cropHeight: 525,
} as const;
/** Matches Tailwind `lg` (1024px) — 3-phone layout from here up */
const DESKTOP_MIN_WIDTH = 1024;

/** Figma 3049:7876 — artboard scaled to container width. */
const PhoneShowcase = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mql = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);

    const updateLayout = () => {
      const desktop = mql.matches;
      setIsDesktop(desktop);
      const nextArtboard = desktop ? DESKTOP_ARTBOARD : TABLET_ARTBOARD;
      setScale(el.clientWidth / nextArtboard.width);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);
    mql.addEventListener("change", updateLayout);
    return () => {
      observer.disconnect();
      mql.removeEventListener("change", updateLayout);
    };
  }, []);

  const artboard = isDesktop ? DESKTOP_ARTBOARD : TABLET_ARTBOARD;

  const phoneTransition = (index: number) => ({
    ...SHARED_TWEEN,
    delay: reduceMotion ? 0 : index * PHONE_STAGGER,
  });

  const cardDelay = (cardId: (typeof CARD_REVEAL_ORDER)[number]) => {
    if (reduceMotion) return 0;
    const orderIndex = CARD_REVEAL_ORDER.indexOf(cardId);
    return CARD_DELAY_BASE + orderIndex * CARD_STAGGER;
  };

  const phoneInitial = reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 };
  const phoneAnimate = reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 };

  const cardInitial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y: 14, scale: 0.96 };
  const cardAnimate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1 };

  return (
    <div
      ref={ref}
      className="relative w-full overflow-x-clip overflow-y-hidden"
      style={{ height: `${artboard.height * scale}px` }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 origin-top-left will-change-transform"
        style={{
          width: artboard.width,
          height: artboard.height,
          transform: `scale(${scale})`,
        }}
      >
        {/* Left phone — desktop only */}
        {isDesktop ? (
          <motion.div
            className="absolute top-[68px] left-0 z-0 h-[274px] w-[420px] overflow-hidden will-change-transform"
            initial={phoneInitial}
            animate={phoneAnimate}
            transition={phoneTransition(0)}
          >
            <div className="absolute bottom-[-107.78px] left-[49px] flex h-[388.845px] w-[360.122px] items-center justify-center">
              <div className="flex-none rotate-[-18.77deg]">
                <div className="relative h-[318.173px] w-[272.221px] overflow-hidden">
                  <PhoneMockup
                    screen={`${A}/Vector3.png`}
                    screenWidth={362}
                    screenHeight={788}
                    className="absolute top-0 left-0 h-[551.68px] w-[272.221px]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
          <motion.div
            className="overflow-hidden will-change-transform"
            style={
              isDesktop
                ? { width: 364, height: 325 }
                : {
                    width: TABLET_PHONE.width,
                    height: TABLET_PHONE.cropHeight,
                  }
            }
            initial={phoneInitial}
            animate={phoneAnimate}
            transition={phoneTransition(1)}
          >
            <PhoneMockup
              screen={`${A}/Vector.png`}
              screenWidth={417}
              screenHeight={906}
              className={isDesktop ? "h-[735.556px] w-[364px]" : undefined}
              style={
                isDesktop
                  ? undefined
                  : {
                      width: TABLET_PHONE.width,
                      height: TABLET_PHONE.fullHeight,
                    }
              }
            />
          </motion.div>
        </div>

        {/* Right phone — desktop only */}
        {isDesktop ? (
          <motion.div
            className="absolute top-[68px] right-[40px] z-0 h-[274px] w-[400px] overflow-hidden will-change-transform"
            initial={phoneInitial}
            animate={phoneAnimate}
            transition={phoneTransition(2)}
          >
            <div className="absolute top-[-7.07px] right-[20px] flex h-[388.845px] w-[360.122px] items-center justify-center">
              <div className="flex-none rotate-[18.77deg]">
                <div className="relative h-[318.173px] w-[272.221px] overflow-hidden">
                  <PhoneMockup
                    screen={`${A}/Vector2.png`}
                    screenWidth={362}
                    screenHeight={788}
                    className="absolute top-0 left-0 h-[551.68px] w-[272.221px]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Cards — shuffled order, same tween */}
        <motion.div
          className={`absolute z-30 will-change-transform ${
            isDesktop ? "top-[89px] left-[399px]" : "top-[156px] left-[150px]"
          }`}
          initial={cardInitial}
          animate={cardAnimate}
          transition={{ ...SHARED_TWEEN, delay: cardDelay("liked") }}
        >
          <LikedCard />
        </motion.div>

        <motion.div
          className={`absolute z-30 will-change-transform ${
            isDesktop ? "top-[89px] left-[861px]" : "top-[255px] left-[550px]"
          }`}
          initial={cardInitial}
          animate={cardAnimate}
          transition={{ ...SHARED_TWEEN, delay: cardDelay("actions") }}
        >
          <ActionsCard />
        </motion.div>

        <motion.div
          className={`absolute z-30 will-change-transform ${
            isDesktop
              ? "top-[219.61px] left-[360px]"
              : "top-[400px] left-[78px]"
          }`}
          initial={cardInitial}
          animate={cardAnimate}
          transition={{ ...SHARED_TWEEN, delay: cardDelay("stats") }}
        >
          <StatsCard />
        </motion.div>

        {isDesktop ? (
          <motion.div
            className="absolute top-[188px] left-[838px] z-30 will-change-transform"
            initial={cardInitial}
            animate={cardAnimate}
            transition={{ ...SHARED_TWEEN, delay: cardDelay("comment") }}
          >
            <CommentCard />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

const Section11 = () => {
  return (
    <section
      id="top"
      aria-label="Capable hero"
      className="relative w-full h-full overflow-hidden bg-white text-[#0d0d0d]"
    >
      <div className="relative mx-auto w-full">
        {/* Hero shell */}
        <div className="relative overflow-hidden rounded-b-[clamp(1.5rem,4vw,3.125rem)] border-b border-solid border-[#dee5ed] bg-[#f8fafc] shadow-[0_0_0_6px_white,0_7px_6px_rgba(140,150,169,0.12),0_22px_30px_rgba(140,150,169,0.1)]">
          {/* Soft lavender wash under phone showcase */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(52%,28rem)] rounded-b-[inherit]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(248,250,252,0) 0%, #f0edf8 38%, #e3d4f9 72%, #dac2f7 100%)",
            }}
          />
          {/* Dot grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-b-[inherit] bg-size-[186px_186px] bg-top-left opacity-100"
            style={{ backgroundImage: `url(${A}/dots.png)` }}
          />
          {/* Soft top fade over dots */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-b-[inherit]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 100% 70% at 50% 0%, #f8fafc 15%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-4 pt-[30px] ipad:px-10">
            {/* 1. Navbar */}
            <div className="w-full animate-page-reveal will-change-transform">
              <Navbar />
            </div>

            {/* 2. Container — internal stagger */}
            <div
              id="download"
              className="mt-[clamp(2.75rem,7vw,5.375rem)] flex w-full max-w-[1145px] scroll-mt-8 flex-col items-center gap-10"
            >
              <div className="flex w-full flex-col items-center gap-4">
                <div className="animate-page-reveal will-change-transform [animation-delay:80ms]">
                  <AnnouncementBadge />
                </div>

                <div className="flex w-full animate-page-reveal flex-col items-center justify-center gap-5 px-0 text-center will-change-transform ipad:px-[clamp(1rem,6vw,6.25rem)] [animation-delay:140ms]">
                  <h1 className="font-urbanist text-wrap md:mx-auto md:max-w-[450px] lg:max-w-[750px] xl:max-w-[945px] text-[38px] lg:text-[58px] xl:text-[68px] font-bold leading-[46px] lg:leading-[120%] text-[#0d0d0d] text-center">
                    Empower Your Social Connections with Capable
                  </h1>
                  <p className="max-w-md text-[18px] xl:text-[20px] lg:max-w-[550px] mx-auto font-medium leading-normal text-[#666] text-pretty">
                    Join Capable to build authentic connections and share your
                    passions effortlessly.
                  </p>
                </div>
              </div>

              <div className="flex w-full max-w-[556px] animate-page-reveal flex-col items-center will-change-transform [animation-delay:200ms]">
                <a
                  className="inline-flex min-h-14 touch-manipulation items-center rounded-full bg-[#923cf6] px-6 py-4 text-lg font-semibold leading-normal whitespace-nowrap text-white transition-[background-color,transform] duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#923cf6] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[#8129e0] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02]"
                 onClick={(e) => e.preventDefault()}>
                  Download App
                </a>
              </div>
            </div>

            {/* Phone showcase — scales to padded content width, capped at artboard */}
            <div className="relative z-10 mx-auto mt-[clamp(1.5rem,4vw,2.75rem)] w-full max-w-[1440px]">
              <PhoneShowcase />
            </div>
          </div>
        </div>

        {/* 3. Trusted by */}
        <div className="animate-page-reveal py-[clamp(2.5rem,5vw,3.75rem)] will-change-transform [animation-delay:360ms]">
          <TrustedBy />
        </div>
      </div>
    </section>
  );
};

export default Section11;
