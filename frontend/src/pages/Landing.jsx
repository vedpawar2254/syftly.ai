import { useState, useEffect, useRef, useCallback } from 'react';

// ===== CONSTANTS =====
const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 7);

// ===== HOOKS =====
function useCountdown(targetDate) {
    const calculateTimeLeft = useCallback(() => {
        const difference = targetDate - new Date();
        if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return timeLeft;
}

function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setIsVisible(true),
            { threshold, rootMargin: '0px 0px -80px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, isVisible];
}

function useParallax() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => setOffset(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return offset;
}

function useScrollProgress(ref) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementHeight = rect.height;

            // Calculate how far through the element we've scrolled
            const scrollStart = rect.top + windowHeight;
            const scrollEnd = rect.bottom;
            const scrollRange = elementHeight + windowHeight;

            let progress = 1 - (scrollEnd / scrollRange);
            progress = Math.max(0, Math.min(1, progress));

            setProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref]);

    return progress;
}

// ===== COMPONENTS =====

function AnimatedWord({ children, delay = 0, isVisible }) {
    return (
        <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
                transitionDelay: `${delay}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(30px) rotateX(-20deg)',
                filter: isVisible ? 'blur(0)' : 'blur(4px)',
            }}
        >
            {children}
        </span>
    );
}

function AnimatedHeadline({ text, isVisible, className = '' }) {
    const words = text.split(' ');
    return (
        <h2 className={className}>
            {words.map((word, i) => (
                <AnimatedWord key={i} delay={i * 80} isVisible={isVisible}>
                    {word}{' '}
                </AnimatedWord>
            ))}
        </h2>
    );
}

function CountdownSmall({ countdown }) {
    return (
        <div className="flex items-center gap-4 text-sm">
            <span className="text-label hover-expand-letters cursor-default">Launching  in</span>
            <div className="flex items-center gap-3 font-editorial text-lg tracking-wide">
                <span>{countdown.days}<span className="text-[var(--color-ink-muted)] ml-1">d</span></span>
                <span className="opacity-20">:</span>
                <span>{String(countdown.hours).padStart(2, '0')}<span className="text-[var(--color-ink-muted)] ml-1">h</span></span>
                <span className="opacity-20">:</span>
                <span>{String(countdown.minutes).padStart(2, '0')}<span className="text-[var(--color-ink-muted)] ml-1">m</span></span>
            </div>
        </div>
    );
}

// Floating chaotic article
function ChaoticArticle({ article, index, chaos }) {
    // Each article has unique position and rotation based on index
    const positions = [
        { x: -15, y: -20, rotate: -12 },
        { x: 25, y: -10, rotate: 8 },
        { x: -30, y: 15, rotate: -5 },
        { x: 35, y: 25, rotate: 15 },
        { x: 5, y: -30, rotate: -18 },
        { x: -25, y: 30, rotate: 10 },
        { x: 40, y: -5, rotate: -8 },
        { x: -10, y: 35, rotate: 20 },
        { x: 20, y: 40, rotate: -15 },
        { x: -35, y: -15, rotate: 5 },
        { x: 30, y: 10, rotate: -20 },
        { x: -20, y: 5, rotate: 12 },
    ];

    const pos = positions[index % positions.length];

    // As chaos decreases (0 = chaos, 1 = clarity), articles fly away
    const translateX = pos.x + (chaos < 0.5 ? (1 - chaos * 2) * (pos.x > 0 ? 200 : -200) : 0);
    const translateY = pos.y + (chaos < 0.5 ? (1 - chaos * 2) * (pos.y > 0 ? 150 : -150) : 0);
    const rotate = pos.rotate * (chaos < 0.5 ? 1 + (1 - chaos * 2) * 2 : 1);
    const opacity = chaos < 0.5 ? chaos * 2 : 1;
    const blur = chaos < 0.5 ? (1 - chaos * 2) * 20 : 0;
    const scale = chaos < 0.3 ? chaos / 0.3 : 1;

    return (
        <div
            className="absolute bg-white/90 backdrop-blur-sm border border-[var(--color-paper-darker)] p-4 md:p-5 rounded shadow-lg max-w-xs transition-none"
            style={{
                left: `${50 + pos.x}%`,
                top: `${50 + pos.y}%`,
                transform: `translate(-50%, -50%) translate(${translateX}%, ${translateY}%) rotate(${rotate}deg) scale(${scale})`,
                opacity,
                filter: `blur(${blur}px)`,
                zIndex: 10 - index,
            }}
        >
            <div className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wider mb-2">
                {article.source} • {article.time}
            </div>
            <div className="font-editorial text-sm md:text-base leading-snug">
                {article.headline}
            </div>
        </div>
    );
}

// Immersive chaos-to-clarity timeline section
function ChaosToClarity({ progress }) {
    const chaosArticles = [
        { source: 'Reuters', time: '2h ago', headline: 'Venezuela: Opposition claims election victory' },
        { source: 'BBC', time: '2h ago', headline: 'Venezuelan opposition declares win in disputed vote' },
        { source: 'CNN', time: '3h ago', headline: 'Breaking: Tensions rise as election results contested' },
        { source: 'AP', time: '1h ago', headline: 'International observers raise concerns over Venezuela vote' },
        { source: 'Al Jazeera', time: '2h ago', headline: 'Venezuela election: What we know so far' },
        { source: 'NYT', time: '4h ago', headline: 'Opposition leaders claim victory in Venezuela' },
        { source: 'Guardian', time: '3h ago', headline: 'EU calls for transparency in Venezuelan election' },
        { source: 'WSJ', time: '1h ago', headline: 'Markets react to Venezuela election uncertainty' },
        { source: 'France24', time: '2h ago', headline: 'Venezuela vote count continues amid protests' },
        { source: 'DW', time: '5h ago', headline: 'Analysis: What Venezuela election means for region' },
        { source: 'Bloomberg', time: '1h ago', headline: 'Oil prices fluctuate on Venezuela news' },
        { source: 'CNBC', time: '30m ago', headline: 'Breaking: New developments in Venezuela crisis' },
    ];

    const timelineEvents = [
        {
            time: '3  days  ago',
            title: 'Opposition  claims  victory',
            description: 'Multiple sources report opposition declaring win based on exit polls.',
            type: 'claim',
        },
        {
            time: '2  days  ago',
            title: 'International  concerns',
            description: 'EU and OAS monitoring teams report irregularities.',
            type: 'development',
        },
        {
            time: '1  day  ago',
            title: 'Government  disputes',
            description: 'Electoral commission announces different results.',
            type: 'contradiction',
        },
        {
            time: '2  hours  ago',
            title: 'AP  confirms  irregularities',
            description: 'Investigation corroborates concerns with evidence.',
            type: 'confirmation',
        },
    ];

    // Phase 1: 0-0.4 = chaos visible
    // Phase 2: 0.4-0.6 = transition (chaos fades, timeline enters)
    // Phase 3: 0.6-1 = timeline fully visible

    const chaosOpacity = progress < 0.4 ? 1 : progress < 0.6 ? 1 - (progress - 0.4) / 0.2 : 0;
    const timelineVisible = progress > 0.35;
    const timelineProgress = progress < 0.4 ? 0 : Math.min(1, (progress - 0.4) / 0.5);

    // Calculate which timeline items are active
    const activeItems = Math.floor(timelineProgress * 5) - 1;

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Chaos layer - floating articles */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: chaosOpacity, pointerEvents: chaosOpacity > 0.5 ? 'auto' : 'none' }}
            >
                {/* Background noise text */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <div className="text-[120px] md:text-[200px] font-editorial leading-none text-center">
                        NOISE
                    </div>
                </div>

                {/* Floating articles */}
                {chaosArticles.map((article, i) => (
                    <ChaoticArticle
                        key={i}
                        article={article}
                        index={i}
                        chaos={chaosOpacity}
                    />
                ))}

                {/* Center question */}
                <div
                    className="relative z-20 bg-[var(--color-paper)] px-8 py-6 shadow-2xl border border-[var(--color-paper-darker)]"
                    style={{
                        opacity: chaosOpacity > 0.7 ? 1 : chaosOpacity / 0.7,
                        transform: `scale(${0.9 + chaosOpacity * 0.1})`,
                    }}
                >
                    <p className="font-editorial-italic text-xl md:text-2xl text-center">
                        "12  articles.  Same  story.<br />What  actually  changed?"
                    </p>
                </div>
            </div>

            {/* Clarity layer - timeline */}
            <div
                className="absolute inset-0 flex items-center"
                style={{
                    opacity: timelineVisible ? 1 : 0,
                    pointerEvents: timelineVisible ? 'auto' : 'none',
                }}
            >
                <div className="w-full max-w-5xl mx-auto px-6 md:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Message */}
                        <div
                            className="transition-all duration-1000"
                            style={{
                                opacity: timelineProgress,
                                transform: `translateX(${(1 - timelineProgress) * -100}px)`,
                            }}
                        >
                            <div className="text-label mb-6">Instead</div>
                            <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
                                One  story.<br />
                                <span className="font-editorial-italic">Four</span>  changes.<br />
                                Complete  clarity.
                            </h2>

                            {/* Understanding box */}
                            <div
                                className={`paper-layer p-6 mt-8 transition-all duration-700 ${activeItems >= 3 ? 'pulse-glow' : ''}`}
                                style={{ opacity: activeItems >= 3 ? 1 : 0.4 }}
                            >
                                <div className="text-label mb-2">Current  Understanding</div>
                                <p className="font-editorial text-lg">
                                    {activeItems >= 3
                                        ? "Election  disputed.  Irregularities  confirmed  by  AP."
                                        : "Building  understanding..."}
                                </p>
                            </div>
                        </div>

                        {/* Right: Timeline */}
                        <div
                            className="transition-all duration-1000"
                            style={{
                                opacity: timelineProgress,
                                transform: `translateX(${(1 - timelineProgress) * 100}px)`,
                            }}
                        >
                            <div className="relative pl-8 md:pl-12">
                                {/* Track */}
                                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-paper-darker)] overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-ink)]"
                                        style={{
                                            height: `${Math.max(0, (activeItems + 1) / timelineEvents.length) * 100}%`,
                                            transition: 'height 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                                        }}
                                    />
                                </div>

                                {/* Events */}
                                {timelineEvents.map((event, i) => {
                                    const isActive = i <= activeItems;
                                    const delay = i * 150;

                                    return (
                                        <div
                                            key={i}
                                            className="relative pb-8 last:pb-0 transition-all duration-700"
                                            style={{
                                                transitionDelay: `${delay}ms`,
                                                opacity: timelineProgress > 0.2 ? 1 : 0,
                                                transform: timelineProgress > 0.2 ? 'translateX(0)' : 'translateX(30px)',
                                            }}
                                        >
                                            {/* Node */}
                                            <div
                                                className={`absolute -left-[22px] md:-left-[26px] top-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] transition-all duration-500 ${
                                                    isActive
                                                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] scale-110'
                                                        : 'bg-[var(--color-paper)] border-[var(--color-paper-darker)]'
                                                }`}
                                            >
                                                {isActive && (
                                                    <div className="absolute inset-[-6px] rounded-full border-2 border-[var(--color-accent)] opacity-30 animate-ping" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="ml-4">
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-widest">
                                                        {event.time}
                                                    </span>
                                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                                                        event.type === 'claim' ? 'bg-amber-100 text-amber-800' :
                                                        event.type === 'development' ? 'bg-blue-100 text-blue-800' :
                                                        event.type === 'contradiction' ? 'bg-red-100 text-red-800' :
                                                        'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        {event.type}
                                                    </span>
                                                </div>
                                                <h4 className="font-editorial text-lg md:text-xl mb-1">{event.title}</h4>
                                                <p className="text-sm text-[var(--color-ink-light)]">{event.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator at bottom when in chaos phase */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
                style={{ opacity: progress < 0.3 ? 0.6 : 0 }}
            >
                <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-[0.3em]">Scroll  for  clarity</span>
                <div className="w-px h-8 bg-gradient-to-b from-[var(--color-ink-muted)] to-transparent breathe" />
            </div>
        </div>
    );
}

// ===== MAIN COMPONENT =====
function Landing() {
    const countdown = useCountdown(TARGET_DATE);
    const scrollY = useParallax();

    // Chaos section ref and progress
    const chaosRef = useRef(null);
    const chaosProgress = useScrollProgress(chaosRef);

    // Section refs
    const [heroRef, heroVisible] = useScrollReveal(0.1);
    const [problemRef, problemVisible] = useScrollReveal();
    const [noiseRef, noiseVisible] = useScrollReveal();
    const [shiftRef, shiftVisible] = useScrollReveal();
    const [principlesRef, principlesVisible] = useScrollReveal(0.05);
    const [compareRef, compareVisible] = useScrollReveal();
    const [closingRef, closingVisible] = useScrollReveal();

    const principles = [
        {
            number: '01',
            title: 'Situations,  not  articles',
            desc: 'The world unfolds in evolving stories. We track the story itself — not the endless posts about it.',
        },
        {
            number: '02',
            title: 'Changes,  not  updates',
            desc: 'If nothing meaningful shifted, you hear nothing. Silence is a feature, not a bug.',
        },
        {
            number: '03',
            title: 'Understanding,  not  volume',
            desc: 'Reading less is the goal. Being correctly informed is what matters.',
        },
    ];

    return (
        <div className="relative">
            {/* Fixed countdown in corner */}
            <div
                className="fixed top-6 right-6 z-50 transition-all duration-700"
                style={{
                    opacity: scrollY > 500 ? 1 : 0,
                    transform: scrollY > 500 ? 'translateY(0)' : 'translateY(-20px)',
                }}
            >
                <div className="bg-[var(--color-paper)]/95 backdrop-blur-sm border border-[var(--color-paper-darker)] px-5 py-3 rounded-sm shadow-lg">
                    <CountdownSmall countdown={countdown} />
                </div>
            </div>

            {/* ===== HERO ===== */}
            <section
                ref={heroRef}
                className="min-h-screen flex flex-col justify-center relative"
                style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            >
                <div className="py-20">
                    {/* Masthead line */}
                    <div
                        className="flex items-center gap-6 mb-16 transition-all duration-1000"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                        }}
                    >
                        <div
                            className="h-px bg-[var(--color-ink)] opacity-30 transition-all duration-1000 delay-300"
                            style={{ width: heroVisible ? '48px' : '0px' }}
                        />
                        <span className="text-label hover-expand-letters">Issue  No.  001</span>
                        <div
                            className="h-px flex-1 bg-[var(--color-ink)] opacity-10 transition-all duration-1000 delay-500"
                            style={{ transform: heroVisible ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}
                        />
                    </div>

                    {/* Main title */}
                    <h1
                        className="font-editorial text-7xl md:text-8xl lg:text-9xl mb-8 tracking-tight transition-all duration-1000 delay-200"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(50px)',
                            filter: heroVisible ? 'blur(0)' : 'blur(12px)',
                        }}
                    >
                        <span className="underline-draw">syftly</span>
                    </h1>

                    {/* Tagline */}
                    <div className="max-w-2xl mb-20">
                        <p className="text-2xl md:text-3xl text-[var(--color-ink-light)] leading-relaxed tracking-wide">
                            <AnimatedWord delay={500} isVisible={heroVisible}>Cut</AnimatedWord>{'  '}
                            <AnimatedWord delay={580} isVisible={heroVisible}>the</AnimatedWord>{'  '}
                            <AnimatedWord delay={660} isVisible={heroVisible}>noise.</AnimatedWord>{'  '}
                            <br className="hidden md:block" />
                            <AnimatedWord delay={820} isVisible={heroVisible}>Preserve</AnimatedWord>{'  '}
                            <AnimatedWord delay={900} isVisible={heroVisible}>understanding.</AnimatedWord>{'  '}
                            <br className="hidden md:block" />
                            <AnimatedWord delay={1060} isVisible={heroVisible}>Respect</AnimatedWord>{'  '}
                            <AnimatedWord delay={1140} isVisible={heroVisible}>attention.</AnimatedWord>
                        </p>
                    </div>

                    {/* Accent line */}
                    <div
                        className="divider-accent mb-10 transition-all duration-1000 delay-700"
                        style={{ width: heroVisible ? '120px' : '0px' }}
                    />

                    {/* Countdown */}
                    <div
                        className="transition-all duration-1000 delay-900"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                        }}
                    >
                        <CountdownSmall countdown={countdown} />
                    </div>

                    {/* Scroll indicator */}
                    <div
                        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700"
                        style={{ opacity: scrollY < 100 ? 0.6 : 0, transform: `translateY(${scrollY * 0.3}px)` }}
                    >
                        <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-[0.3em]">Scroll</span>
                        <div className="w-px h-12 bg-gradient-to-b from-[var(--color-ink-muted)] to-transparent breathe" />
                    </div>
                </div>
            </section>

            {/* ===== THE PROBLEM ===== */}
            <section ref={problemRef} className="py-32 md:py-48">
                <div className="max-w-4xl">
                    <div
                        className="text-label mb-10 transition-all duration-700"
                        style={{
                            opacity: problemVisible ? 1 : 0,
                            transform: problemVisible ? 'translateX(0)' : 'translateX(-30px)',
                        }}
                    >
                        The  Problem
                    </div>

                    <AnimatedHeadline
                        text="You're  drowning  in  updates  about  things  that  haven't  actually  changed."
                        isVisible={problemVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-12"
                    />
                </div>
            </section>

            {/* ===== NOISE VISUALIZATION ===== */}
            <section ref={noiseRef} className="py-20 md:py-28 overflow-hidden">
                <div className="relative h-32 md:h-40">
                    <div
                        className="absolute inset-0 transition-all duration-1000"
                        style={{
                            opacity: noiseVisible ? 0.12 : 0,
                            filter: noiseVisible ? 'blur(0)' : 'blur(10px)',
                        }}
                    >
                        <div className="flex whitespace-nowrap marquee">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center gap-10 mr-10">
                                    <span className="text-2xl md:text-3xl font-editorial">Breaking:  Markets  react</span>
                                    <span className="text-2xl opacity-30">•</span>
                                    <span className="text-2xl md:text-3xl font-editorial">Update:  Situation  develops</span>
                                    <span className="text-2xl opacity-30">•</span>
                                    <span className="text-2xl md:text-3xl font-editorial">Alert:  New  information</span>
                                    <span className="text-2xl opacity-30">•</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-500"
                        style={{
                            opacity: noiseVisible ? 1 : 0,
                            transform: noiseVisible ? 'scale(1)' : 'scale(0.95)',
                        }}
                    >
                        <div className="bg-[var(--color-paper)] px-10 py-6 shadow-xl border border-[var(--color-paper-darker)] hover-scale">
                            <p className="font-editorial-italic text-xl md:text-2xl lg:text-3xl text-[var(--color-ink)]">
                                "Did  anything  actually  change?"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div
                    className="grid grid-cols-3 gap-6 md:gap-12 mt-20 md:mt-28 max-w-4xl mx-auto text-center transition-all duration-1000 delay-800"
                    style={{
                        opacity: noiseVisible ? 1 : 0,
                        transform: noiseVisible ? 'translateY(0)' : 'translateY(50px)',
                    }}
                >
                    {[
                        { value: '90%', label: 'of  updates  repeat  what  you  know' },
                        { value: '12×', label: 'the  same  story,  different  headline' },
                        { value: '0', label: 'meaningful  changes' },
                    ].map((stat, i) => (
                        <div key={i} className="group cursor-default">
                            <div className="font-editorial text-5xl md:text-6xl lg:text-7xl mb-4 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                {stat.value}
                            </div>
                            <div className="text-xs md:text-sm text-[var(--color-ink-muted)] tracking-wide">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== THE SHIFT ===== */}
            <section ref={shiftRef} className="py-32 md:py-48">
                <div className="max-w-4xl">
                    <div
                        className="text-label mb-10 transition-all duration-700"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateX(0)' : 'translateX(-30px)',
                        }}
                    >
                        The  Shift
                    </div>

                    <AnimatedHeadline
                        text="What  if  news  only  spoke  when  something  actually  changed?"
                        isVisible={shiftVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-10"
                    />

                    <p
                        className="text-xl md:text-2xl text-[var(--color-ink-light)] max-w-2xl leading-relaxed text-spaced transition-all duration-1000 delay-600"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        Syftly  treats  news  as  <span className="font-editorial-italic text-[var(--color-ink)]">evolving  situations</span>,
                        not  isolated  posts.
                    </p>
                </div>
            </section>

            {/* ===== CHAOS TO CLARITY - Immersive Timeline ===== */}
            <section
                ref={chaosRef}
                className="relative"
                style={{ height: '250vh' }} // Extra scroll room for the effect
            >
                <div className="sticky top-0 h-screen">
                    <ChaosToClarity progress={chaosProgress} />
                </div>
            </section>

            {/* ===== PRINCIPLES ===== */}
            <section ref={principlesRef} className="py-24 md:py-32">
                <div className="max-w-3xl ml-8 md:ml-16">
                    {principles.map((item, i) => (
                        <div
                            key={i}
                            className="principle-item transition-all duration-700"
                            style={{
                                transitionDelay: `${i * 200}ms`,
                                opacity: principlesVisible ? 1 : 0,
                                transform: principlesVisible ? 'translateX(0)' : 'translateX(-40px)',
                            }}
                        >
                            <div className="principle-number float float-delay-1">
                                {item.number}
                            </div>

                            <h3 className="font-editorial text-2xl md:text-3xl lg:text-4xl mb-4 tracking-wide">
                                {item.title}
                            </h3>

                            <p className="text-lg md:text-xl text-[var(--color-ink-light)] leading-relaxed text-spaced max-w-xl">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== BEFORE/AFTER ===== */}
            <section ref={compareRef} className="py-32 md:py-48">
                <div className="max-w-4xl mx-auto">
                    <AnimatedHeadline
                        text="News  that  respects  your  time."
                        isVisible={compareVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-center mb-16"
                    />

                    <div
                        className="grid md:grid-cols-2 gap-8 md:gap-12 transition-all duration-1000 delay-400"
                        style={{
                            opacity: compareVisible ? 1 : 0,
                            transform: compareVisible ? 'translateY(0)' : 'translateY(50px)',
                        }}
                    >
                        <div className="p-8 md:p-10 border border-[var(--color-paper-darker)] rounded-sm opacity-60">
                            <h4 className="font-editorial text-xl md:text-2xl text-[var(--color-ink-muted)] line-through mb-8">
                                Before
                            </h4>
                            <ul className="space-y-5 text-[var(--color-ink-light)] text-spaced">
                                {[
                                    '47  notifications  about  the  same  story',
                                    'No  idea  what  actually  changed',
                                    'Constantly  catching  up,  never  caught  up',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="text-red-400 mt-0.5 text-lg">×</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="paper-layer p-8 md:p-10 hover-scale">
                            <h4 className="font-editorial text-xl md:text-2xl mb-8">
                                After
                            </h4>
                            <ul className="space-y-5 text-spaced">
                                {[
                                    'One  update  when  something  actually  matters',
                                    'Clear  understanding  of  what  shifted',
                                    'Silence  when  nothing  changed',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="text-emerald-500 mt-0.5 text-lg">✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CLOSING ===== */}
            <section ref={closingRef} className="py-32 md:py-48">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedHeadline
                        text="The  quieter  way  to  stay  informed."
                        isVisible={closingVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-10"
                    />

                    <p
                        className="text-xl md:text-2xl text-[var(--color-ink-light)] mb-16 text-spaced transition-all duration-1000 delay-500"
                        style={{ opacity: closingVisible ? 1 : 0 }}
                    >
                        Launching  in  {countdown.days}  days.
                    </p>

                    <div
                        className="flex justify-center gap-10 md:gap-20 transition-all duration-1000 delay-700"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                            transform: closingVisible ? 'translateY(0)' : 'translateY(40px)',
                        }}
                    >
                        {[
                            { value: countdown.days, label: 'Days' },
                            { value: countdown.hours, label: 'Hours' },
                            { value: countdown.minutes, label: 'Minutes' },
                        ].map((item, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div className="font-editorial text-6xl md:text-8xl mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <div className="text-label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="py-20 border-t border-[var(--color-paper-darker)]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="font-editorial text-2xl underline-draw">syftly</div>
                    <div className="text-sm text-[var(--color-ink-muted)] text-spaced">
                        Understanding  changes,  not  chasing  updates.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
