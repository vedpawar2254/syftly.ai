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

// Realistic news article card
function NewsArticle({ article, index, chaos }) {
    const positions = [
        { x: -20, y: -25, rotate: -8 },
        { x: 28, y: -15, rotate: 6 },
        { x: -35, y: 10, rotate: -4 },
        { x: 32, y: 20, rotate: 12 },
        { x: 8, y: -35, rotate: -14 },
        { x: -28, y: 28, rotate: 7 },
        { x: 38, y: -8, rotate: -6 },
        { x: -12, y: 32, rotate: 16 },
        { x: 22, y: 35, rotate: -10 },
        { x: -38, y: -12, rotate: 4 },
        { x: 25, y: 8, rotate: -16 },
        { x: -22, y: 2, rotate: 9 },
    ];

    const pos = positions[index % positions.length];

    // Slower transition - chaos fades from 0.3 to 0
    const translateX = pos.x + (chaos < 0.3 ? (1 - chaos / 0.3) * (pos.x > 0 ? 300 : -300) : 0);
    const translateY = pos.y + (chaos < 0.3 ? (1 - chaos / 0.3) * (pos.y > 0 ? 200 : -200) : 0);
    const rotate = pos.rotate * (chaos < 0.3 ? 1 + (1 - chaos / 0.3) * 3 : 1);
    const opacity = chaos < 0.3 ? chaos / 0.3 : 1;
    const blur = chaos < 0.3 ? (1 - chaos / 0.3) * 15 : 0;
    const scale = chaos < 0.2 ? chaos / 0.2 : 1;

    return (
        <div
            className="absolute w-64 md:w-72 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
            style={{
                left: `${50 + pos.x}%`,
                top: `${50 + pos.y}%`,
                transform: `translate(-50%, -50%) translate(${translateX}%, ${translateY}%) rotate(${rotate}deg) scale(${scale})`,
                opacity,
                filter: `blur(${blur}px)`,
                zIndex: 12 - index,
            }}
        >
            {/* Image placeholder */}
            <div
                className="h-28 md:h-32"
                style={{
                    background: `linear-gradient(135deg, ${article.color}15 0%, ${article.color}30 100%)`,
                }}
            >
                <div className="h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
                        <span className="text-2xl">{article.emoji}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Source row */}
                <div className="flex items-center gap-2 mb-2">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: article.color }}
                    />
                    <span className="text-xs font-medium text-gray-600">{article.source}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{article.time}</span>
                </div>

                {/* Headline */}
                <h3 className="font-semibold text-sm leading-snug text-gray-900 mb-2">
                    {article.headline}
                </h3>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{article.readTime} min read</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-500">{article.category}</span>
                </div>
            </div>
        </div>
    );
}

// Chaos to Clarity section
function ChaosToClarity({ progress }) {
    const chaosArticles = [
        { source: 'Reuters', time: '2h ago', headline: 'Venezuela opposition claims victory in disputed presidential election', color: '#ff6b00', emoji: '🗳️', readTime: 4, category: 'Politics' },
        { source: 'BBC News', time: '2h ago', headline: 'Venezuelan opposition says it won Sunday\'s vote', color: '#bb1919', emoji: '📰', readTime: 3, category: 'World' },
        { source: 'CNN', time: '3h ago', headline: 'Breaking: Tensions rise as Venezuela election results contested', color: '#cc0000', emoji: '⚡', readTime: 5, category: 'Breaking' },
        { source: 'AP News', time: '1h ago', headline: 'International observers raise concerns over Venezuela vote count', color: '#ff3b30', emoji: '🔍', readTime: 4, category: 'Politics' },
        { source: 'Al Jazeera', time: '2h ago', headline: 'Venezuela election: Opposition claims win as govt disputes', color: '#fa9f1b', emoji: '🌍', readTime: 6, category: 'Analysis' },
        { source: 'NY Times', time: '4h ago', headline: 'Opposition Leaders Claim Victory in Venezuela', color: '#000000', emoji: '📰', readTime: 7, category: 'World' },
        { source: 'The Guardian', time: '3h ago', headline: 'EU calls for transparency in Venezuelan election results', color: '#052962', emoji: '🇪🇺', readTime: 3, category: 'World' },
        { source: 'WSJ', time: '1h ago', headline: 'Markets React to Venezuela Election Uncertainty', color: '#0274b6', emoji: '📈', readTime: 4, category: 'Markets' },
        { source: 'France 24', time: '2h ago', headline: 'Venezuela: Vote count continues as protests grow', color: '#0055a4', emoji: '🇻🇪', readTime: 3, category: 'Breaking' },
        { source: 'DW News', time: '5h ago', headline: 'Analysis: What the Venezuela election means for the region', color: '#1a1a1a', emoji: '🌎', readTime: 8, category: 'Analysis' },
        { source: 'Bloomberg', time: '1h ago', headline: 'Oil Prices Swing on Venezuela Political Crisis', color: '#2800d7', emoji: '🛢️', readTime: 3, category: 'Markets' },
        { source: 'CNBC', time: '30m ago', headline: 'BREAKING: New developments in Venezuela election crisis', color: '#005594', emoji: '🔴', readTime: 2, category: 'Breaking' },
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
            title: 'International  concerns  raised',
            description: 'EU and OAS monitoring teams report voting irregularities.',
            type: 'development',
        },
        {
            time: '1  day  ago',
            title: 'Government  disputes  results',
            description: 'Electoral commission announces different results.',
            type: 'contradiction',
        },
        {
            time: '2  hours  ago',
            title: 'AP  confirms  irregularities',
            description: 'Investigation corroborates concerns with documented evidence.',
            type: 'confirmation',
        },
    ];

    // SLOWER TIMING:
    // Phase 1: 0-0.25 = chaos fully visible
    // Phase 2: 0.25-0.45 = transition (chaos fades out)
    // Phase 3: 0.45-1 = timeline visible (longer viewing time)

    const chaosOpacity = progress < 0.25 ? 1 : progress < 0.45 ? 1 - (progress - 0.25) / 0.2 : 0;
    const timelineVisible = progress > 0.35;
    const timelineProgress = progress < 0.4 ? 0 : Math.min(1, (progress - 0.4) / 0.35);

    // Timeline items activate slower
    const activeItems = Math.floor(timelineProgress * 6) - 1;

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Chaos layer */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: chaosOpacity, pointerEvents: chaosOpacity > 0.5 ? 'auto' : 'none' }}
            >
                {/* Background NOISE text - now italic */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                    <div className="text-[100px] md:text-[180px] lg:text-[220px] font-editorial-italic leading-none text-center select-none">
                        noise
                    </div>
                </div>

                {/* Floating articles */}
                {chaosArticles.map((article, i) => (
                    <NewsArticle
                        key={i}
                        article={article}
                        index={i}
                        chaos={chaosOpacity}
                    />
                ))}

                {/* Center question */}
                <div
                    className="relative z-20 bg-[var(--color-paper)] px-10 py-8 shadow-2xl border border-[var(--color-paper-darker)] max-w-md"
                    style={{
                        opacity: chaosOpacity > 0.6 ? 1 : chaosOpacity / 0.6,
                        transform: `scale(${0.9 + chaosOpacity * 0.1})`,
                    }}
                >
                    <div className="text-label mb-4 text-center">12  articles  •  Same  event</div>
                    <p className="font-editorial text-2xl md:text-3xl text-center leading-snug">
                        Articles  are  not  conclusions.<br />
                        They  are  <span className="font-editorial-italic">evidence</span>.
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
                            className="transition-all duration-1000 ease-out"
                            style={{
                                opacity: timelineProgress,
                                transform: `translateX(${(1 - timelineProgress) * -80}px)`,
                                filter: `blur(${(1 - timelineProgress) * 8}px)`,
                            }}
                        >
                            <div className="text-label text-xl mb-6">A  Living  Picture</div>
                            <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
                                How  it  began.<br />
                                How  it  <span className="font-editorial-italic">evolved</span>.<br />
                                What  remains  uncertain.
                            </h2>

                            {/* Understanding box */}
                            <div
                                className={`paper-layer p-6 mt-8 transition-all duration-1000 ${activeItems >= 3 ? 'pulse-glow' : ''}`}
                                style={{ opacity: activeItems >= 3 ? 1 : 0.3 }}
                            >
                                <div className="text-label mb-2">Current  Understanding</div>
                                <p className="font-editorial text-lg leading-snug">
                                    {activeItems >= 3
                                        ? "The  election  remains  disputed.  Some  irregularities  are  now  confirmed."
                                        : "Weighing  evidence..."}
                                </p>
                            </div>
                        </div>

                        {/* Right: Timeline */}
                        <div
                            className="transition-all duration-1000 ease-out"
                            style={{
                                opacity: timelineProgress,
                                transform: `translateX(${(1 - timelineProgress) * 80}px)`,
                                filter: `blur(${(1 - timelineProgress) * 8}px)`,
                            }}
                        >
                            <div className="relative ml-8">
                                {/* Track - use transform to center the line */}
                                <div
                                    className="absolute top-2 bottom-2 w-[2px] bg-[var(--color-paper-darker)] overflow-hidden"
                                    style={{ left: '12px', transform: 'translateX(-50%)' }}
                                >
                                    <div
                                        className="absolute top-0 left-0 w-full bg-[var(--color-ink)]"
                                        style={{
                                            height: `${Math.max(0, (activeItems + 1) / timelineEvents.length) * 100}%`,
                                            transition: 'height 1s cubic-bezier(0.22, 1, 0.36, 1)',
                                        }}
                                    />
                                </div>

                                {/* Events */}
                                {timelineEvents.map((event, i) => {
                                    const isActive = i <= activeItems;

                                    return (
                                        <div
                                            key={i}
                                            className="relative pb-10 last:pb-0 transition-all duration-700"
                                            style={{
                                                transitionDelay: `${i * 200}ms`,
                                                opacity: timelineProgress > 0.3 ? 1 : 0,
                                                transform: timelineProgress > 0.3 ? 'translateX(0)' : 'translateX(40px)',
                                            }}
                                        >
                                            {/* Node - centered on same axis as track using transform */}
                                            <div
                                                className={`absolute top-0 w-6 h-6 rounded-full border-2 transition-all duration-700 ${isActive
                                                    ? 'bg-[var(--color-ink)] border-[var(--color-ink)]'
                                                    : 'bg-[var(--color-paper)] border-[var(--color-paper-darker)]'
                                                    }`}
                                                style={{ left: '12px', transform: 'translateX(-50%)' }}
                                            >
                                                {isActive && (
                                                    <div className="absolute inset-[-6px] rounded-full border border-[var(--color-ink)] opacity-30 animate-ping" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="ml-12 pl-4">
                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                    <span className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-widest">
                                                        {event.time}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[var(--color-paper-dark)] text-[var(--color-ink-light)]">
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

            {/* Scroll indicator */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700"
                style={{ opacity: progress < 0.2 ? 0.6 : 0 }}
            >
                <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-[0.3em]">Scroll  for  clarity</span>
                <div className="w-px h-8 bg-gradient-to-b from-[var(--color-ink-muted)] to-transparent breathe" />
            </div>
        </div>
    );
}

// New Principles Section - Large typographic blocks, not timeline
function PrinciplesSection({ isVisible }) {
    const principles = [
        {
            number: '01',
            title: 'Evidence,  not  stream',
            highlight: 'Evidence',
            desc: 'Instead of treating news as a stream, syftly treats it as evidence within a larger picture. Each new piece of information is weighed against what is already known.',
        },
        {
            number: '02',
            title: 'Continuity,  not  chaos',
            highlight: 'Continuity',
            desc: 'Yesterday still matters today. Understanding is cumulative. We restore something quietly lost - the sense that knowledge is allowed to build.',
        },
        {
            number: '03',
            title: 'Comprehension,  not  reaction',
            highlight: 'Comprehension',
            desc: 'In a world optimized for reaction, syftly is optimized for comprehension. Not faster news. Not louder news. Just clearer.',
        },
    ];

    return (
        <div className="space-y-32 md:space-y-48">
            {principles.map((item, i) => (
                <div
                    key={i}
                    className="transition-all duration-1000"
                    style={{
                        transitionDelay: `${i * 150}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                    }}
                >
                    {/* Large number */}
                    <div className="text-[120px] md:text-[180px] lg:text-[220px] font-editorial leading-none text-[var(--color-paper-darker)] select-none -mb-16 md:-mb-24 lg:-mb-32">
                        {item.number}
                    </div>

                    {/* Title */}
                    <h3 className="font-editorial text-3xl md:text-4xl lg:text-5xl mb-6 relative">
                        <span className="font-editorial-italic text-[var(--color-accent)]">{item.highlight}</span>
                        {item.title.replace(item.highlight, '').replace(',', ',')}
                    </h3>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-[var(--color-ink-light)] leading-relaxed text-spaced max-w-xl">
                        {item.desc}
                    </p>

                    {/* Divider */}
                    {i < principles.length - 1 && (
                        <div className="divider-fade mt-16 md:mt-24" />
                    )}
                </div>
            ))}
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

    return (
        <div className="relative">
            {/* Fixed countdown */}
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
            >
                {/* Giant background text - "clarity" */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                    style={{
                        opacity: heroVisible ? 0.035 : 0,
                        transform: `translateY(${scrollY * 0.1}px) scale(${1 + scrollY * 0.0002})`,
                        transition: 'opacity 2s ease-out',
                    }}
                >
                    <div
                        className="font-editorial-italic text-[28vw] md:text-[32vw] leading-none text-[var(--color-ink)]"
                        style={{
                            transform: heroVisible ? 'translateY(0)' : 'translateY(100px)',
                            transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
                        }}
                    >
                        clarity
                    </div>
                </div>

                {/* Floating geometric elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top right circle - pulsing */}
                    <div
                        className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-[var(--color-paper-darker)] pulse-glow"
                        style={{
                            opacity: heroVisible ? 0.5 : 0,
                            transform: `translate(${scrollY * 0.08}px, ${scrollY * 0.04}px) rotate(${scrollY * 0.02}deg)`,
                            transition: 'opacity 1.5s ease-out 0.5s',
                        }}
                    />
                    {/* Bottom left circle */}
                    <div
                        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full border border-[var(--color-paper-darker)]"
                        style={{
                            opacity: heroVisible ? 0.3 : 0,
                            transform: `translate(${scrollY * -0.05}px, ${scrollY * -0.03}px) rotate(${scrollY * -0.01}deg)`,
                            transition: 'opacity 1.5s ease-out 0.8s',
                        }}
                    />
                    {/* Small floating dot 1 */}
                    <div
                        className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-[var(--color-accent)] float"
                        style={{
                            opacity: heroVisible ? 0.6 : 0,
                            transition: 'opacity 1s ease-out 1.2s',
                        }}
                    />
                    {/* Small floating dot 2 */}
                    <div
                        className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-[var(--color-ink)] float float-delay-2"
                        style={{
                            opacity: heroVisible ? 0.3 : 0,
                            transition: 'opacity 1s ease-out 1.4s',
                        }}
                    />
                    {/* Accent line across - animated draw */}
                    <div
                        className="absolute top-1/3 left-0 h-px bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent)] to-transparent"
                        style={{
                            width: heroVisible ? '35%' : '0%',
                            opacity: 0.4,
                            transition: 'width 2s cubic-bezier(0.22, 1, 0.36, 1) 0.8s',
                        }}
                    />
                    {/* Second accent line - right side */}
                    <div
                        className="absolute bottom-1/3 right-0 h-px bg-gradient-to-l from-[var(--color-paper-darker)] via-[var(--color-paper-darker)] to-transparent"
                        style={{
                            width: heroVisible ? '25%' : '0%',
                            opacity: 0.6,
                            transition: 'width 2s cubic-bezier(0.22, 1, 0.36, 1) 1.2s',
                        }}
                    />
                </div>

                <div className="py-20 relative z-10">
                    {/* Masthead */}
                    <div
                        className="flex items-center gap-6 mb-12 transition-all duration-1000"
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

                    {/* Title - Much larger with underline */}
                    <h1
                        className="font-editorial text-8xl md:text-[10rem] lg:text-[12rem] mb-8 tracking-tighter leading-[0.85] transition-all duration-1000 delay-200"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(60px)',
                            filter: heroVisible ? 'blur(0)' : 'blur(16px)',
                        }}
                    >
                        <span className="font-editorial-italic underline-draw">syftly</span>
                    </h1>

                    {/* Tagline - More dramatic */}
                    <div className="max-w-3xl mb-16">
                        <p className="text-2xl md:text-3xl lg:text-4xl text-[var(--color-ink)] leading-relaxed tracking-wide">
                            <AnimatedWord delay={500} isVisible={heroVisible}>Cut</AnimatedWord>{'  '}
                            <AnimatedWord delay={600} isVisible={heroVisible}>the</AnimatedWord>{'  '}
                            <AnimatedWord delay={700} isVisible={heroVisible}>noise.</AnimatedWord>{'  '}
                            <br />
                            <AnimatedWord delay={900} isVisible={heroVisible}>Maintain</AnimatedWord>{'  '}
                            <AnimatedWord delay={1000} isVisible={heroVisible}>a</AnimatedWord>{'  '}
                            <span className="font-editorial-italic">
                                <AnimatedWord delay={1100} isVisible={heroVisible}>shared</AnimatedWord>{'  '}
                                <AnimatedWord delay={1200} isVisible={heroVisible}>reality</AnimatedWord>
                            </span>
                            <AnimatedWord delay={1300} isVisible={heroVisible}>.</AnimatedWord>{'  '}
                            <br />
                            <AnimatedWord delay={1500} isVisible={heroVisible}>Respect</AnimatedWord>{'  '}
                            <AnimatedWord delay={1600} isVisible={heroVisible}>time.</AnimatedWord>
                        </p>
                    </div>

                    {/* Accent block with countdown */}
                    <div
                        className="flex items-center gap-8 transition-all duration-1000 delay-700"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateX(0)' : 'translateX(-40px)',
                        }}
                    >
                        <div
                            className="h-1 bg-[var(--color-accent)]"
                            style={{
                                width: heroVisible ? '96px' : '0px',
                                transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1) 1.5s',
                            }}
                        />
                        <CountdownSmall countdown={countdown} />
                    </div>
                </div>

                {/* Bottom decorative "01" */}
                <div
                    className="absolute bottom-24 right-8 md:right-16 text-right transition-all duration-1000 delay-1000 pointer-events-none"
                    style={{
                        opacity: heroVisible ? 0.08 : 0,
                        transform: heroVisible ? 'translateY(0) rotate(0deg)' : 'translateY(40px) rotate(5deg)',
                    }}
                >
                    <div className="font-editorial text-7xl md:text-8xl lg:text-9xl leading-none">
                        01
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700"
                    style={{ opacity: scrollY < 100 ? 0.6 : 0, transform: `translateY(${scrollY * 0.3}px)` }}
                >
                    <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-[0.3em]">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-[var(--color-ink-muted)] to-transparent breathe" />
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
                        What  Went  Wrong
                    </div>

                    <h2
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8 transition-all duration-1000"
                        style={{
                            opacity: problemVisible ? 1 : 0,
                            transform: problemVisible ? 'translateY(0)' : 'translateY(40px)',
                        }}
                    >
                        Somewhere  along  the  way,  news  stopped  helping  us  <span className="font-editorial-italic">understand</span>  the  world —
                    </h2>

                    <p
                        className="text-2xl md:text-3xl text-[var(--color-ink-light)] leading-relaxed text-spaced transition-all duration-1000 delay-300"
                        style={{
                            opacity: problemVisible ? 1 : 0,
                            transform: problemVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        and  started  asking  us  to  keep  up  with  it.
                    </p>
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
                                Updates  that  don't  update  anything.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Philosophy text */}
                <div
                    className="max-w-3xl mx-auto mt-20 md:mt-28 transition-all duration-1000 delay-800"
                    style={{
                        opacity: noiseVisible ? 1 : 0,
                        transform: noiseVisible ? 'translateY(0)' : 'translateY(50px)',
                    }}
                >
                    <p className="text-lg md:text-xl text-[var(--color-ink-light)] leading-relaxed text-spaced text-center">
                        Headlines  repeat  themselves.  Narratives  reset  every  morning.  Urgency  is  manufactured,  attention  is  drained,  and  <span className="font-editorial-italic text-[var(--color-ink)]">silence</span>, often  the  most  honest  signal is  treated  as  failure.
                    </p>
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
                        A  Different  Assumption
                    </div>

                    <h2
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 transition-all duration-1000"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateY(0)' : 'translateY(40px)',
                        }}
                    >
                        Syftly  is  built  around<br />
                        a  simple  human  need.
                    </h2>

                    <p
                        className="text-xl md:text-2xl text-[var(--color-ink-light)] max-w-2xl leading-relaxed text-spaced transition-all duration-1000 delay-400"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        To  know  what  we  <span className="font-editorial-italic text-[var(--color-ink)]">currently  understand</span>  about  the  world,  and  how  that  understanding  formed.
                    </p>

                    {/* Core belief */}
                    <div
                        className="paper-layer p-8 mt-12 max-w-xl transition-all duration-1000 delay-800"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        <p className="font-editorial-italic text-lg md:text-xl leading-relaxed mb-3">
                            "News  was  meant  to  help  us  understand  the  world - not  lose  our  grip  on  it."
                        </p>
                        <p className="text-sm text-[var(--color-ink-muted)] text-spaced">
                            We're  rebuilding  it  around  that  idea.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== CHAOS TO CLARITY ===== */}
            <section
                ref={chaosRef}
                className="relative"
                style={{ height: '350vh' }} // More scroll room = slower effect
            >
                <div className="sticky top-0 h-screen">
                    <ChaosToClarity progress={chaosProgress} />
                </div>
            </section>

            {/* ===== PRINCIPLES - New Design ===== */}
            <section ref={principlesRef} className="py-32 md:py-48">
                <div className="max-w-4xl">
                    <div
                        className="text-label mb-16 transition-all duration-700"
                        style={{
                            opacity: principlesVisible ? 1 : 0,
                            transform: principlesVisible ? 'translateX(0)' : 'translateX(-30px)',
                        }}
                    >
                        How  It  Works
                    </div>

                    <PrinciplesSection isVisible={principlesVisible} />
                </div>
            </section>

            {/* ===== BEFORE/AFTER ===== */}
            <section ref={compareRef} className="py-32 md:py-48 relative">
                {/* Ruled lines background */}
                <div className="absolute inset-0 ruled-lines opacity-30 pointer-events-none" />

                <div className="max-w-5xl mx-auto relative">
                    {/* Section header */}
                    <div
                        className="text-label mb-8 transition-all duration-700"
                        style={{
                            opacity: compareVisible ? 1 : 0,
                            transform: compareVisible ? 'translateX(0)' : 'translateX(-30px)',
                        }}
                    >
                        The  Difference
                    </div>

                    <h2
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 transition-all duration-1000"
                        style={{
                            opacity: compareVisible ? 1 : 0,
                            transform: compareVisible ? 'translateY(0)' : 'translateY(40px)',
                        }}
                    >
                        This  is  not  about  reading  <span className="font-editorial-italic">less</span>.
                    </h2>

                    <p
                        className="text-xl text-[var(--color-ink-light)] mb-16 max-w-2xl text-spaced transition-all duration-1000 delay-200"
                        style={{
                            opacity: compareVisible ? 1 : 0,
                            transform: compareVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        It's  about  thinking  better.
                    </p>

                    <div
                        className="grid md:grid-cols-2 gap-0 md:gap-0 transition-all duration-1000 delay-400"
                        style={{
                            opacity: compareVisible ? 1 : 0,
                            transform: compareVisible ? 'translateY(0)' : 'translateY(50px)',
                        }}
                    >
                        {/* Before column */}
                        <div className="p-10 md:p-12 border border-[var(--color-paper-darker)] bg-gradient-to-br from-[var(--color-paper-dark)]/50 to-transparent relative">
                            {/* Strikethrough decoration */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-200/60 via-red-300/40 to-transparent" />

                            <div className="flex items-center gap-4 mb-10">
                                <h4 className="font-editorial text-2xl md:text-3xl text-[var(--color-ink-muted)]">
                                    <span className="line-through decoration-red-300/60">Before</span>
                                </h4>
                                <div className="h-px flex-1 bg-[var(--color-paper-darker)]" />
                            </div>

                            <ul className="space-y-7 text-[var(--color-ink-light)] text-spaced">
                                {[
                                    { text: 'Urgency  manufactured,  attention  extracted', sub: 'The  business  model' },
                                    { text: 'Narratives  reset  every  morning', sub: 'No  continuity' },
                                    { text: 'Knowing  everything,  understanding  nothing', sub: 'Information  without  insight' },
                                    { text: 'Silence  treated  as  failure', sub: 'Always  on' },
                                ].map((item, i) => (
                                    <li key={i} className="group">
                                        <div className="flex items-start gap-4">
                                            <span className="text-red-400/70 mt-0.5 text-lg font-light">×</span>
                                            <div>
                                                <span className="block">{item.text}</span>
                                                <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.sub}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Frustration indicator */}
                            <div className="mt-10 pt-6 border-t border-[var(--color-paper-darker)]">
                                <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-2">Result</div>
                                <div className="font-editorial-italic text-lg text-[var(--color-ink-muted)]">"Constantly  informed.  Rarely  grounded."</div>
                            </div>
                        </div>

                        {/* After column */}
                        <div className="paper-layer p-10 md:p-12 relative overflow-hidden hover-scale margin-line">
                            {/* Accent decoration */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent)] via-emerald-400/40 to-transparent" />

                            <div className="flex items-center gap-4 mb-10">
                                <h4 className="font-editorial text-2xl md:text-3xl">
                                    With  <span className="font-editorial-italic text-[var(--color-accent)]">Syftly</span>
                                </h4>
                                <div className="h-px flex-1 bg-[var(--color-paper-darker)]" />
                            </div>

                            <ul className="space-y-7 text-spaced">
                                {[
                                    { text: 'Speaks  only  when  something  meaningfully  changes', sub: 'Signal  over  noise' },
                                    { text: 'Understanding  is  cumulative', sub: 'Yesterday  still  matters' },
                                    { text: 'A  living  picture  of  the  world', sub: 'Not  a  feed' },
                                    { text: 'Silence  can  mean  stability,  not  ignorance', sub: 'Peace  of  mind' },
                                ].map((item, i) => (
                                    <li key={i} className="group">
                                        <div className="flex items-start gap-4">
                                            <span className="text-emerald-500 mt-0.5 text-lg">✓</span>
                                            <div>
                                                <span className="block">{item.text}</span>
                                                <span className="text-xs text-[var(--color-accent)] uppercase tracking-widest mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.sub}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Relief indicator */}
                            <div className="mt-10 pt-6 border-t border-[var(--color-paper-darker)]">
                                <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-2">Result</div>
                                <div className="font-editorial-italic text-lg text-[var(--color-ink)]">"A  steadier  understanding  of  the  world  we  share."</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CLOSING ===== */}
            <section ref={closingRef} className="py-40 md:py-56 relative">
                {/* Grid texture background */}
                <div className="absolute inset-0 grid-texture opacity-40 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative">
                    {/* Label */}
                    <div
                        className="text-label mb-8 transition-all duration-700"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                            transform: closingVisible ? 'translateY(0)' : 'translateY(-20px)',
                        }}
                    >
                        Coming  Soon
                    </div>

                    {/* Main headline with italic */}
                    <h2
                        className="font-editorial text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-8 transition-all duration-1000"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                            transform: closingVisible ? 'translateY(0)' : 'translateY(40px)',
                        }}
                    >
                        Not  faster  news.<br />
                        Not  louder  news.<br />
                        Just  <span className="font-editorial-italic">clearer</span>.
                    </h2>

                    {/* Subtext */}
                    <p
                        className="text-lg md:text-xl text-[var(--color-ink-light)] mb-20 max-w-xl mx-auto text-spaced transition-all duration-1000 delay-300"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                            transform: closingVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        A  clearer  understanding  of  the  world  we  share.
                    </p>

                    {/* Countdown block */}
                    <div
                        className="paper-layer paper-stack inline-block px-12 md:px-20 py-10 md:py-14 transition-all duration-1000 delay-500"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                            transform: closingVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
                        }}
                    >
                        <div className="text-label mb-6">Launching  in</div>

                        <div className="flex justify-center gap-8 md:gap-16 mb-8">
                            {[
                                { value: countdown.days, label: 'Days' },
                                { value: countdown.hours, label: 'Hours' },
                                { value: countdown.minutes, label: 'Mins' },
                                { value: countdown.seconds, label: 'Secs' },
                            ].map((item, i) => (
                                <div key={i} className="text-center group cursor-default">
                                    <div className="font-editorial text-5xl md:text-7xl lg:text-8xl mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-[var(--color-ink-muted)] uppercase tracking-widest">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="divider-fade mb-6" />

                        {/* Promise */}
                        <p className="font-editorial-italic text-lg text-[var(--color-ink-light)]">
                            Optimized  for  comprehension.
                        </p>
                    </div>

                    {/* Decorative elements */}
                    <div
                        className="mt-16 flex justify-center gap-3 transition-all duration-1000 delay-700"
                        style={{ opacity: closingVisible ? 0.4 : 0 }}
                    >
                        <div className="w-2 h-2 rounded-full bg-[var(--color-ink)] float float-delay-1" />
                        <div className="w-2 h-2 rounded-full bg-[var(--color-ink)] float float-delay-2" />
                        <div className="w-2 h-2 rounded-full bg-[var(--color-ink)] float float-delay-3" />
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="py-20 md:py-28 border-t border-[var(--color-paper-darker)] relative">
                {/* Ruled lines subtle background */}
                <div className="absolute inset-0 ruled-lines opacity-20 pointer-events-none" />

                <div className="relative">
                    {/* Top section */}
                    <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
                        {/* Brand column */}
                        <div>
                            <div className="font-editorial text-3xl mb-4 underline-draw inline-block">syftly</div>
                            <p className="text-[var(--color-ink-light)] text-spaced leading-relaxed mb-6">
                                News intelligence Platform
                            </p>
                        </div>

                        {/* What you see column */}
                        <div>
                            <div className="text-label mb-6">What  You  See</div>
                            <ul className="space-y-3 text-[var(--color-ink-light)] text-spaced">
                                <li className="flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-ink-muted)]" />
                                    How  a  situation  began
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-ink-muted)]" />
                                    How  it  evolved
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-ink-muted)]" />
                                    What  changed
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1 h-1 rounded-full bg-[var(--color-ink-muted)]" />
                                    What  remains  uncertain
                                </li>
                            </ul>
                        </div>

                        {/* Quote column */}
                        <div className="paper-layer p-6 md:p-8">
                            <div className="text-label mb-4">The  Belief</div>
                            <blockquote className="font-editorial-italic text-lg leading-relaxed text-[var(--color-ink-light)] mb-4">
                                "For  most  of  history,  humans  learned  about  the  world  slowly.  Knowledge  accumulated.  Understanding  had  time  to  deepen."
                            </blockquote>
                            <div className="text-sm text-[var(--color-ink-muted)] text-spaced">
                                We're  returning  to  that.
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="divider-fade mb-10" />

                    {/* Bottom section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-8">
                            <span className="text-sm text-[var(--color-ink-muted)] text-spaced">
                                ©  2026  Syftly
                            </span>
                            <span className="hidden md:inline text-[var(--color-paper-darker)]">|</span>
                            <span className="text-sm text-[var(--color-ink-muted)] text-spaced">
                                Made  with  intention
                            </span>
                            <span className="hidden md:inline text-[var(--color-paper-darker)]">|</span>
                            <a
                                href="https://github.com/vedpawar2254/syftly.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[var(--color-ink-muted)] text-spaced hover:text-[var(--color-ink)] transition-colors duration-300 underline-draw"
                            >
                                GitHub
                            </a>
                        </div>

                        <div className="text-sm text-[var(--color-ink-muted)] text-spaced font-editorial-italic">
                            Cut  the  noise.  Maintain  a  shared  reality.  Respect  time.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
