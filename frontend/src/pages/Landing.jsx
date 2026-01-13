import { Headline, Body, Caption } from '../components/ui';
import Divider from '../components/ui/Divider';
import './Landing.css';

/**
 * Landing / Countdown Page
 *
 * Per style_guide.md:
 * - Should feel like "a printing press waiting to start"
 * - Calm, matter-of-fact, slightly mysterious
 * - Large serif headline, minimal supporting sentence
 */
function Landing() {
    return (
        <div className="landing">
            <div className="landing__hero">
                <Caption className="landing__label">Awaiting first signal</Caption>

                <Headline level={1} className="landing__headline">
                    Understanding changes,
                    <br />
                    not chasing updates.
                </Headline>

                <Body className="landing__subtitle">
                    A structured understanding of the world, updated only when something meaningful changes.
                </Body>

                <Divider thin className="landing__divider" />

                <Caption className="landing__status">
                    No updates until something changes. That's the point.
                </Caption>
            </div>
        </div>
    );
}

export default Landing;
