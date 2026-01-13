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
            { threshold, rootMargin: '0px 0px -100px 0px' }
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
        <div className="flex items-center gap-3 text-sm">
            <span className="text-label">Launching in</span>
            <div className="flex items-center gap-2 font-editorial text-lg">
                <span>{countdown.days}d</span>
                <span className="opacity-30">:</span>
                <span>{String(countdown.hours).padStart(2, '0')}h</span>
                <span className="opacity-30">:</span>
                <span>{String(countdown.minutes).padStart(2, '0')}m</span>
            </div>
        </div>
    );
}

function TimelineEvent({ time, title, description, type, index, isVisible, isActive }) {
    const typeColors = {
        claim: 'bg-amber-100 text-amber-800',
        development: 'bg-blue-100 text-blue-800',
        contradiction: 'bg-red-100 text-red-800',
        confirmation: 'bg-emerald-100 text-emerald-800',
    };

    return (
        <div
            className="relative pl-10 pb-12 last:pb-0 transition-all duration-700"
            style={{
                transitionDelay: `${index * 150}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                filter: isVisible ? 'blur(0)' : 'blur(6px)',
            }}
        >
            {/* Dot */}
            <div className={`timeline-dot ${isActive ? 'active' : ''}`} />

            {/* Content */}
            <div className="space-y-2">
                <div className="text-xs text-[var(--color-ink-muted)] uppercase tracking-wider">
                    {time}
                </div>
                <h4 className="font-editorial text-xl md:text-2xl">{title}</h4>
                <p className="text-[var(--color-ink-light)] text-sm md:text-base leading-relaxed">
                    {description}
                </p>
                <span className={`inline-block px-2 py-0.5 text-xs rounded ${typeColors[type]}`}>
                    {type}
                </span>
            </div>
        </div>
    );
}

// ===== MAIN COMPONENT =====
function Landing() {
    const countdown = useCountdown(TARGET_DATE);
    const scrollY = useParallax();

    // Section refs
    const [heroRef, heroVisible] = useScrollReveal(0.1);
    const [problemRef, problemVisible] = useScrollReveal();
    const [noiseRef, noiseVisible] = useScrollReveal();
    const [shiftRef, shiftVisible] = useScrollReveal();
    const [principlesRef, principlesVisible] = useScrollReveal();
    const [timelineRef, timelineVisible] = useScrollReveal(0.05);
    const [howRef, howVisible] = useScrollReveal();
    const [closingRef, closingVisible] = useScrollReveal();

    const [activeTimelineIndex, setActiveTimelineIndex] = useState(-1);

    // Animate timeline items sequentially
    useEffect(() => {
        if (timelineVisible && activeTimelineIndex < 4) {
            const timer = setTimeout(() => {
                setActiveTimelineIndex(prev => prev + 1);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [timelineVisible, activeTimelineIndex]);

    const timelineEvents = [
        {
            time: '3 days ago',
            title: 'Opposition claims victory',
            description: 'Multiple opposition leaders announce they have won based on independent exit polls.',
            type: 'claim',
        },
        {
            time: '2 days ago',
            title: 'International observers raise concerns',
            description: 'EU and OAS monitoring teams report irregularities in vote counting process.',
            type: 'development',
        },
        {
            time: '1 day ago',
            title: 'Government disputes results',
            description: 'Electoral commission announces different results, rejecting opposition claims.',
            type: 'contradiction',
        },
        {
            time: '2 hours ago',
            title: 'AP confirms irregularities',
            description: 'Associated Press investigation corroborates observer concerns with documented evidence.',
            type: 'confirmation',
        },
    ];

    return (
        <div className="relative">
            {/* Fixed countdown in corner */}
            <div
                className="fixed top-6 right-6 z-50 transition-opacity duration-500"
                style={{ opacity: scrollY > 400 ? 1 : 0 }}
            >
                <div className="bg-[var(--color-paper)]/90 backdrop-blur-sm border border-[var(--color-paper-darker)] px-4 py-2 rounded-sm shadow-sm">
                    <CountdownSmall countdown={countdown} />
                </div>
            </div>

            {/* ===== HERO ===== */}
            <section
                ref={heroRef}
                className="min-h-screen flex flex-col justify-center relative"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            >
                <div className="py-20">
                    {/* Masthead line */}
                    <div
                        className="flex items-center gap-4 mb-12 transition-all duration-1000"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                        }}
                    >
                        <div className="h-px flex-1 max-w-16 bg-[var(--color-ink)] opacity-20" />
                        <span className="text-label">Issue No. 001</span>
                        <div className="h-px flex-1 bg-[var(--color-ink)] opacity-20" />
                    </div>

                    {/* Main title */}
                    <h1
                        className="font-editorial text-7xl md:text-8xl lg:text-9xl mb-6 transition-all duration-1000 delay-200"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
                            filter: heroVisible ? 'blur(0)' : 'blur(8px)',
                        }}
                    >
                        syftly
                    </h1>

                    {/* Tagline with staggered words */}
                    <div className="max-w-2xl mb-16">
                        <p className="text-2xl md:text-3xl text-[var(--color-ink-light)] leading-relaxed">
                            <AnimatedWord delay={400} isVisible={heroVisible}>Cut</AnimatedWord>{' '}
                            <AnimatedWord delay={480} isVisible={heroVisible}>the</AnimatedWord>{' '}
                            <AnimatedWord delay={560} isVisible={heroVisible}>noise.</AnimatedWord>{' '}
                            <br className="hidden md:block" />
                            <AnimatedWord delay={700} isVisible={heroVisible}>Preserve</AnimatedWord>{' '}
                            <AnimatedWord delay={780} isVisible={heroVisible}>understanding.</AnimatedWord>{' '}
                            <br className="hidden md:block" />
                            <AnimatedWord delay={920} isVisible={heroVisible}>Respect</AnimatedWord>{' '}
                            <AnimatedWord delay={1000} isVisible={heroVisible}>attention.</AnimatedWord>
                        </p>
                    </div>

                    {/* Countdown - subtle, not prominent */}
                    <div
                        className="transition-all duration-1000 delay-700"
                        style={{
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                        }}
                    >
                        <CountdownSmall countdown={countdown} />
                    </div>

                    {/* Scroll indicator */}
                    <div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500"
                        style={{ opacity: scrollY < 100 ? 0.5 : 0 }}
                    >
                        <span className="text-xs text-[var(--color-ink-muted)] uppercase tracking-widest">Scroll</span>
                        <div className="w-px h-8 bg-gradient-to-b from-[var(--color-ink-muted)] to-transparent" />
                    </div>
                </div>
            </section>

            {/* ===== THE PROBLEM ===== */}
            <section ref={problemRef} className="py-32 md:py-48">
                <div className="max-w-4xl">
                    <div
                        className="text-label mb-8 transition-all duration-700"
                        style={{
                            opacity: problemVisible ? 1 : 0,
                            transform: problemVisible ? 'translateX(0)' : 'translateX(-20px)',
                        }}
                    >
                        The Problem
                    </div>

                    <AnimatedHeadline
                        text="You're drowning in updates about things that haven't actually changed."
                        isVisible={problemVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-tight mb-12"
                    />
                </div>
            </section>

            {/* ===== NOISE VISUALIZATION ===== */}
            <section ref={noiseRef} className="py-24 md:py-32 overflow-hidden">
                <div className="relative">
                    {/* Marquee of repetitive headlines */}
                    <div
                        className="transition-all duration-1000"
                        style={{
                            opacity: noiseVisible ? 0.15 : 0,
                            filter: noiseVisible ? 'blur(0)' : 'blur(10px)',
                        }}
                    >
                        <div className="flex whitespace-nowrap marquee">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-8 mr-8">
                                    <span className="text-2xl md:text-3xl font-editorial">Breaking: Markets react to news</span>
                                    <span className="text-2xl md:text-3xl opacity-50">•</span>
                                    <span className="text-2xl md:text-3xl font-editorial">Update: Situation develops</span>
                                    <span className="text-2xl md:text-3xl opacity-50">•</span>
                                    <span className="text-2xl md:text-3xl font-editorial">Alert: New information emerges</span>
                                    <span className="text-2xl md:text-3xl opacity-50">•</span>
                                    <span className="text-2xl md:text-3xl font-editorial">Breaking: Story continues</span>
                                    <span className="text-2xl md:text-3xl opacity-50">•</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Center text that breaks through */}
                    <div
                        className="absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-500"
                        style={{
                            opacity: noiseVisible ? 1 : 0,
                            transform: noiseVisible ? 'scale(1)' : 'scale(0.9)',
                        }}
                    >
                        <div className="bg-[var(--color-paper)] px-12 py-8 text-center">
                            <p className="font-editorial-italic text-2xl md:text-3xl text-[var(--color-ink)]">
                                "Did anything actually change?"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div
                    className="grid grid-cols-3 gap-8 mt-24 max-w-3xl mx-auto text-center transition-all duration-1000 delay-700"
                    style={{
                        opacity: noiseVisible ? 1 : 0,
                        transform: noiseVisible ? 'translateY(0)' : 'translateY(40px)',
                    }}
                >
                    <div>
                        <div className="font-editorial text-4xl md:text-5xl mb-2">90%</div>
                        <div className="text-sm text-[var(--color-ink-muted)]">of updates repeat what you already know</div>
                    </div>
                    <div>
                        <div className="font-editorial text-4xl md:text-5xl mb-2">12x</div>
                        <div className="text-sm text-[var(--color-ink-muted)]">the same story, different headline</div>
                    </div>
                    <div>
                        <div className="font-editorial text-4xl md:text-5xl mb-2">0</div>
                        <div className="text-sm text-[var(--color-ink-muted)]">meaningful changes</div>
                    </div>
                </div>
            </section>

            {/* ===== THE SHIFT ===== */}
            <section ref={shiftRef} className="py-32 md:py-48">
                <div className="max-w-4xl">
                    <div
                        className="text-label mb-8 transition-all duration-700"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateX(0)' : 'translateX(-20px)',
                        }}
                    >
                        The Shift
                    </div>

                    <AnimatedHeadline
                        text="What if news only spoke when something actually changed?"
                        isVisible={shiftVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-tight mb-8"
                    />

                    <p
                        className="text-xl text-[var(--color-ink-light)] max-w-2xl transition-all duration-1000 delay-500"
                        style={{
                            opacity: shiftVisible ? 1 : 0,
                            transform: shiftVisible ? 'translateY(0)' : 'translateY(20px)',
                        }}
                    >
                        Syftly treats news as evolving situations, not isolated posts.
                        We track how stories change over time and only surface what matters.
                    </p>
                </div>
            </section>

            {/* ===== PRINCIPLES ===== */}
            <section ref={principlesRef} className="py-24 md:py-32">
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        {
                            number: '01',
                            title: 'Situations, not articles',
                            desc: 'The world unfolds in evolving stories. We track the story, not the posts about it.',
                        },
                        {
                            number: '02',
                            title: 'Changes, not updates',
                            desc: 'If nothing meaningful shifted, you hear nothing. Silence is a feature.',
                        },
                        {
                            number: '03',
                            title: 'Understanding, not volume',
                            desc: 'Reading less is the goal. Being correctly informed is what matters.',
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="paper-layer p-8 md:p-10 hover-lift transition-all duration-700"
                            style={{
                                transitionDelay: `${i * 150}ms`,
                                opacity: principlesVisible ? 1 : 0,
                                transform: principlesVisible
                                    ? 'translateY(0) rotateX(0deg)'
                                    : 'translateY(60px) rotateX(10deg)',
                                filter: principlesVisible ? 'blur(0)' : 'blur(8px)',
                            }}
                        >
                            <div className="text-label mb-4">{item.number}</div>
                            <h3 className="font-editorial text-2xl md:text-3xl mb-4">{item.title}</h3>
                            <p className="text-[var(--color-ink-light)] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== TIMELINE DEMO ===== */}
            <section ref={timelineRef} className="py-32 md:py-48">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                    {/* Left: Explanation */}
                    <div>
                        <div
                            className="text-label mb-8 transition-all duration-700"
                            style={{
                                opacity: timelineVisible ? 1 : 0,
                                transform: timelineVisible ? 'translateX(0)' : 'translateX(-20px)',
                            }}
                        >
                            How It Works
                        </div>

                        <AnimatedHeadline
                            text="Watch a story clarify as it evolves."
                            isVisible={timelineVisible}
                            className="font-editorial text-3xl md:text-4xl lg:text-5xl leading-tight mb-8"
                        />

                        <p
                            className="text-lg text-[var(--color-ink-light)] mb-8 transition-all duration-1000 delay-500"
                            style={{
                                opacity: timelineVisible ? 1 : 0,
                                transform: timelineVisible ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            Instead of 47 articles saying slightly different things,
                            you see the story's actual trajectory. Claims, confirmations,
                            contradictions — all in context.
                        </p>

                        {/* Current understanding box */}
                        <div
                            className="paper-layer p-6 transition-all duration-1000 delay-1000"
                            style={{
                                opacity: activeTimelineIndex >= 3 ? 1 : 0.3,
                                transform: activeTimelineIndex >= 3 ? 'translateY(0)' : 'translateY(10px)',
                            }}
                        >
                            <div className="text-label mb-2">Current Understanding</div>
                            <p className="font-editorial text-lg">
                                {activeTimelineIndex >= 3
                                    ? "Election results disputed with confirmed irregularities from multiple independent sources."
                                    : "Building understanding..."}
                            </p>
                        </div>
                    </div>

                    {/* Right: Timeline */}
                    <div
                        className="paper-layer paper-stack p-8 md:p-10 transition-all duration-1000"
                        style={{
                            opacity: timelineVisible ? 1 : 0,
                            transform: timelineVisible ? 'translateY(0) rotateY(0deg)' : 'translateY(40px) rotateY(-5deg)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <div className="text-label mb-1">Situation</div>
                                <h3 className="font-editorial text-xl md:text-2xl">Venezuela Election Crisis</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-[var(--color-ink-muted)]">4 changes</div>
                                <div className="text-xs text-[var(--color-ink-muted)]">3 sources</div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="timeline-line" />
                            {timelineEvents.map((event, i) => (
                                <TimelineEvent
                                    key={i}
                                    {...event}
                                    index={i}
                                    isVisible={timelineVisible}
                                    isActive={i <= activeTimelineIndex}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT FEELS ===== */}
            <section ref={howRef} className="py-32 md:py-48">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatedHeadline
                        text="News that respects your time."
                        isVisible={howVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-tight mb-12"
                    />

                    <div
                        className="grid md:grid-cols-2 gap-8 text-left transition-all duration-1000 delay-300"
                        style={{
                            opacity: howVisible ? 1 : 0,
                            transform: howVisible ? 'translateY(0)' : 'translateY(40px)',
                        }}
                    >
                        <div className="space-y-6">
                            <h4 className="font-editorial text-xl text-[var(--color-ink-muted)] line-through">Before</h4>
                            <ul className="space-y-3 text-[var(--color-ink-light)]">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">×</span>
                                    <span>47 notifications about the same story</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">×</span>
                                    <span>No idea what actually changed</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 mt-1">×</span>
                                    <span>Constantly catching up, never caught up</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-editorial text-xl">After</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    <span>One update when something actually matters</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    <span>Clear understanding of what shifted</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    <span>Silence when nothing changed</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CLOSING ===== */}
            <section ref={closingRef} className="py-32 md:py-48">
                <div className="max-w-3xl mx-auto text-center">
                    <AnimatedHeadline
                        text="The quieter way to stay informed."
                        isVisible={closingVisible}
                        className="font-editorial text-4xl md:text-5xl lg:text-6xl leading-tight mb-8"
                    />

                    <p
                        className="text-xl text-[var(--color-ink-light)] mb-12 transition-all duration-1000 delay-400"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                        }}
                    >
                        Launching in {countdown.days} days.
                    </p>

                    {/* Large countdown */}
                    <div
                        className="flex justify-center gap-8 md:gap-16 transition-all duration-1000 delay-600"
                        style={{
                            opacity: closingVisible ? 1 : 0,
                            transform: closingVisible ? 'translateY(0)' : 'translateY(30px)',
                        }}
                    >
                        {[
                            { value: countdown.days, label: 'Days' },
                            { value: countdown.hours, label: 'Hours' },
                            { value: countdown.minutes, label: 'Minutes' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="font-editorial text-5xl md:text-7xl mb-2">
                                    {String(item.value).padStart(2, '0')}
                                </div>
                                <div className="text-label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="py-16 border-t border-[var(--color-paper-darker)]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="font-editorial text-2xl">syftly</div>
                    <div className="text-sm text-[var(--color-ink-muted)]">
                        Understanding changes, not chasing updates.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
