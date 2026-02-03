# Domain Pitfalls

**Domain:** Feature Integration Pitfalls (Authentication, AI, Comment Systems)
**Researched:** February 3, 2026
**Confidence:** HIGH (based on OWASP authoritative sources)

## Critical Pitfalls

Mistakes that cause rewrites, security breaches, or major operational issues.

### 1. Authentication: User Enumeration via Error Messages
**What goes wrong:** Application returns different error messages for invalid username vs invalid password, enabling attackers to enumerate valid accounts through automated testing.

**Why it happens:** Developers implement "quick exit" authentication logic that fails fast when user doesn't exist, causing different response times and error messages.

**Consequences:**
- Attackers can identify valid usernames for credential stuffing attacks
- Facilitates targeted attacks on real accounts
- Violates OWASP Authentication Guidelines

**Prevention:**
- Use generic error messages: "Invalid username or password" regardless of which is wrong
- Normalize response timing across all failure paths (avoid quick-exit pattern)
- Use constant-time password comparison functions

**Detection:**
- Early sign: Login flow branches based on user existence
- Different error messages returned for "user not found" vs "wrong password"
- Timing differences measurable between failure paths (timing attacks)

**Phase to address:** Design/Architecture Phase - authentication security patterns

---

### 2. Authentication: Weak Session Management on Risk Events
**What goes wrong:** Session tokens remain valid after sensitive account changes (password reset, email change, suspicious login patterns).

**Why it happens:** Session invalidation is not tied to account risk events; sessions only invalidated on logout.

**Consequences:**
- Attackers who compromised a session maintain access after legitimate user resets credentials
- Account recovery can be bypassed
- Violates OWASP Session Management best practices

**Prevention:**
- Require re-authentication for sensitive features (password change, email change)
- Invalidate all existing sessions after password resets, account recovery, or detected suspicious activity
- Implement risk-based authentication requiring MFA on anomalous patterns

**Detection:**
- Early sign: Changing password doesn't log user out of other sessions
- Password reset allows attacker with stolen session to remain authenticated
- No session invalidation after account recovery email sent

**Phase to address:** Architecture/Design Phase - session lifecycle design

---

### 3. AI Features: Direct Prompt Injection via User Input
**What goes wrong:** LLM concatenates user input directly with system instructions, allowing attackers to override system prompts and execute arbitrary commands.

**Why it happens:** Lack of clear separation between instructions and data; treating all text equally without context awareness.

**Consequences:**
- Attackers can extract system prompts revealing internal configurations
- Unauthorized actions through connected tools and APIs
- Sensitive data exfiltration via manipulated outputs

**Prevention:**
- Use structured prompts with clear delimiters (SYSTEM_INSTRUCTIONS vs USER_DATA_TO_PROCESS)
- Implement input validation and sanitization for injection patterns
- Add explicit security rules in system prompts
- Validate LLM outputs for prompt leakage

**Detection:**
- Early sign: Simple string concatenation of user input with system prompt
- No delimiter or boundary markers between instructions and data
- Testing reveals system prompt can be extracted with "reveal your instructions" queries

**Phase to address:** AI Feature Architecture Phase - prompt engineering design

---

### 4. AI Features: RAG Poisoning from External Content
**What goes wrong:** Attackers inject malicious instructions into documents/webpages that the LLM retrieves, causing persistent manipulation across all users accessing that content.

**Why it happens:** RAG systems trust external sources without sanitization; documents indexed without content validation.

**Consequences:**
- Persistent prompt injection affecting all users querying poisoned documents
- Data exfiltration via hidden malicious payloads in seemingly legitimate content
- Remote prompt injection through documents, emails, web pages

**Prevention:**
- Sanitize external content before including in agent context
- Remove common injection patterns from retrieved documents
- Implement content filtering for known malicious payloads
- Consider separate LLM calls to validate/summarize untrusted content

**Detection:**
- Early sign: Documents from external sources added to vector database without validation
- User-submitted or crawled content directly injected into context
- Testing reveals "hidden" instructions in documents are executed

**Phase to address:** AI Architecture Phase - RAG security pipeline design

---

### 5. AI Features: Tool Abuse Without Least Privilege
**What goes wrong:** AI agents given unrestricted access to tools/APIs, allowing them to perform unintended or malicious actions when manipulated.

**Why it happens:** Over-permissioned tool configuration; wildcard permissions; lack of tool-specific parameter validation.

**Consequences:**
- Agents can delete files, send emails, execute code without user intent
- Privilege escalation through tool chaining
- Data exfiltration via unrestricted API access

**Prevention:**
- Apply least privilege principle to all tools (read-only where possible)
- Implement per-tool permission scoping with allowlists
- Require explicit tool authorization for sensitive operations
- Validate tool call parameters against user permissions and session context

**Detection:**
- Early sign: Tool definitions include "*" or wildcard permissions
- Agent can execute database_write, file_delete, or similar dangerous operations
- No validation of tool parameters before execution

**Phase to address:** AI Agent Architecture Phase - tool security design

---

### 6. Comment Systems: Stored XSS via Unsensitized Input
**What goes wrong:** User-provided comments containing malicious scripts are stored and executed in other users' browsers when viewed.

**Why it happens:** Comments stored in database without sanitization; output not encoded when rendering.

**Consequences:**
- Attackers can hijack user sessions, steal cookies
- Malicious scripts execute in admin/moderator browsers
- Data theft and account impersonation
- Violates OWASP XSS Prevention guidelines

**Prevention:**
- HTML entity encode all user-controlled data when displaying (prevent execution)
- For rich text, use HTML sanitization libraries (e.g., DOMPurify)
- Implement Content Security Policy as defense-in-depth (not sole protection)
- Validate all input server-side before storage

**Detection:**
- Early sign: User input directly inserted into HTML without encoding
- Comments rendered using innerHTML instead of textContent
- No HTML sanitization library in dependency list for comment handling

**Phase to address:** Backend/Comment Feature Design - XSS prevention architecture

---

### 7. Comment Systems: Spam via Lack of Rate Limiting
**What goes wrong:** Attackers flood comments with spam content, overwhelming moderation systems and degrading user experience.

**Why it happens:** No rate limiting on comment submission; CAPTCHA only after many failures or not at all.

**Consequences:**
- Database overwhelmed with spam entries
- Legitimate comments buried
- Moderation queue unmanageable
- Increased infrastructure costs

**Prevention:**
- Implement rate limiting per user/IP for comment submissions
- Require CAPTCHA after small number of failed submissions
- Use bot detection and reputation scoring
- Consider time-based delays between submissions

**Detection:**
- Early sign: Comment API has no rate limiting middleware
- Users can submit unlimited comments rapidly without restriction
- CAPTCHA not present or only after excessive attempts

**Phase to address:** Comment Feature Architecture - rate limiting design

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or operational friction.

### 8. Authentication: Weak Password Policies
**What goes wrong:** Enforcing arbitrary composition rules (special chars, mixed case) without checking against breached password databases.

**Why it happens:** Legacy policies focused on complexity rather than actual security strength; lack of integration with breach data.

**Consequences:**
- Users create weak but "compliant" passwords vulnerable to credential stuffing
- Poor user experience causing password reuse
- False sense of security

**Prevention:**
- Block common and previously breached passwords using Have I Been Pwned API
- Allow passphrases (minimum 15 characters with MFA)
- Avoid arbitrary composition rules
- Include password strength meter for user guidance

**Detection:**
- Early sign: Password validation only checks length and character types
- No integration with breached password databases
- Users forced into complex but guessable passwords

**Phase to address:** Authentication Design Phase - password policy definition

---

### 9. AI Features: Memory Poisoning
**What goes wrong:** Malicious data stored in agent memory influences future sessions or other users through cross-session persistence.

**Why it happens:** Unvalidated memory storage; no memory isolation between users; lack of integrity checks.

**Consequences:**
- Prompt injection payloads persist across sessions
- Attackers can influence other users' interactions
- Long-term manipulation of agent behavior

**Prevention:**
- Validate and sanitize data before storing in memory
- Implement memory isolation between users/sessions
- Set memory expiration and size limits
- Use cryptographic integrity checks for long-term memory

**Detection:**
- Early sign: Arbitrary user input stored in persistent memory without validation
- Memory shared across user sessions
- No checksum or integrity verification on stored memories

**Phase to address:** AI Agent Architecture - memory security design

---

### 10. Comment Systems: Moderate Content without Auto-Moderation
**What goes wrong:** All comments require manual review, creating moderation bottleneck and delayed visibility.

**Why it happens:** Over-reliance on manual moderation; no automated filtering or AI-assisted review.

**Consequences:**
- Slow content publication hurting engagement
- Moderation team overwhelmed at scale
- Inconsistent enforcement of content policies

**Prevention:**
- Implement automated content classification (toxicity detection, spam detection)
- Use confidence thresholds: auto-approve high-confidence safe content, auto-reject obvious violations
- Queue borderline content for human review
- Provide community reporting with review prioritization

**Detection:**
- Early sign: All comments go through manual approval queue
- No automated toxicity or spam detection
- Moderation backlog grows with volume

**Phase to address:** Comment System Architecture - moderation workflow design

---

### 11. Comment Systems: Email Enumeration via Notifications
**What goes wrong:** Different notifications sent when commenter's email exists vs doesn't exist, enabling attackers to enumerate user accounts.

**Why it happens:** Notification flow branches on email existence; no generic messaging pattern.

**Consequences:**
- Attackers can identify registered users for targeted attacks
- Privacy violation revealing who is active on platform

**Prevention:**
- Use generic notification messages regardless of email status
- Apply same timing for all notification paths
- Consider notification suppression for suspicious activity

**Detection:**
- Early sign: Email existence affects notification text or timing
- Comment reply notifications reveal target account status
- Different HTTP status codes based on email existence

**Phase to address:** Comment System Design - notification security patterns

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

### 12. Authentication: Poor Password Manager Support
**What goes wrong:** Forms block pasting into password fields, use non-standard input types, or restrict password length below 64 characters.

**Why it happens:** Over-zealous security measures blocking legitimate UX features; lack of understanding of password manager needs.

**Consequences:**
- Users cannot use password managers effectively
- Forced weak passwords due to length restrictions
- Poor user experience leading to password reuse

**Prevention:**
- Allow users to paste into username, password, and MFA fields
- Use standard HTML form elements with appropriate type attributes
- Support passwords up to at least 64 characters for passphrases
- Allow single-tab navigation between fields

**Detection:**
- Early sign: JavaScript blocks paste events on password fields
- Maximum password length below 64 characters
- Custom input controls instead of standard form elements

**Phase to address:** UI/UX Design Phase - authentication accessibility

---

### 13. AI Features: Excessive Token Usage (DoW)
**What goes wrong:** Agents make unbounded tool calls or loops, causing excessive API costs and infrastructure load.

**Why it happens:** No cost controls or token limits; lack of monitoring for runaway loops.

**Consequences:**
- Unexpected infrastructure costs (Denial of Wallet)
- API quota exhaustion
- Service degradation from excessive calls

**Prevention:**
- Set hard limits on token usage per session/user
- Monitor agent reasoning patterns and tool usage
- Implement circuit breakers for excessive tool calls
- Alert on unusual cost patterns

**Detection:**
- Early sign: No monitoring of token usage or API costs
- Agent can loop indefinitely on tool calls
- No maximum iteration or step limits in agent workflows

**Phase to address:** AI Agent Deployment - observability and cost controls

---

### 14. Comment Systems: Overly Aggressive Moderation
**What goes wrong:** Legitimate content incorrectly flagged as spam/abuse, causing user frustration and reduced engagement.

**Why it happens:** Moderation thresholds set too sensitively; lack of false positive tracking; no appeal mechanism.

**Consequences:**
- Users abandon platform due to unfair content removal
- Reduced community engagement
- Increased support burden from moderation appeals

**Prevention:**
- Track false positive rates and tune thresholds accordingly
- Provide clear explanation when content is removed
- Implement appeal mechanism for flagged content
- Allow users to edit and resubmit borderline content

**Detection:**
- Early sign: High rate of user complaints about content removal
- Moderation queue shows大量 legitimate-seeming content flagged
- No analytics on false positive rates

**Phase to address:** Comment System Operations - moderation tuning and feedback

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|--------------|-----------------|-------------|
| **Authentication Architecture** | User enumeration via error messages | Implement generic error responses and normalized timing (Design Phase) |
| **Authentication Architecture** | Weak session management on risk events | Design session invalidation tied to account security events (Design Phase) |
| **AI Feature Design** | Direct prompt injection via user input | Use structured prompts with clear delimiters and input validation (Design Phase) |
| **AI Feature Design** | Tool abuse without least privilege | Apply scoped permissions and tool-specific validation (Architecture Phase) |
| **AI Feature Design** | RAG poisoning from external content | Sanitize external content before inclusion in context (Architecture Phase) |
| **AI Feature Deployment** | Excessive token usage (DoW) | Implement cost controls, monitoring, circuit breakers (Deployment Phase) |
| **Comment System Design** | Stored XSS via unsensitized input | Design with HTML entity encoding and sanitization libraries (Design Phase) |
| **Comment System Design** | Spam via lack of rate limiting | Design rate limiting and bot detection into comment flow (Architecture Phase) |
| **Comment System Architecture** | Email enumeration via notifications | Use generic notification messaging patterns (Design Phase) |
| **Comment System Operations** | Overly aggressive moderation | Implement false positive tracking and appeal mechanisms (Operations Phase) |
| **Authentication UI/UX** | Poor password manager support | Support pasting, standard inputs, 64+ char passwords (Design Phase) |

## Summary by Feature Type

### Authentication Pitfalls - Critical Path
1. **User Enumeration** (Critical) - Design phase mitigation
2. **Weak Session Management** (Critical) - Design phase mitigation  
3. **Weak Password Policies** (Moderate) - Design phase mitigation
4. **Poor Password Manager Support** (Minor) - UX phase mitigation

### AI Feature Pitfalls - Critical Path
1. **Direct Prompt Injection** (Critical) - Architecture phase mitigation
2. **RAG Poisoning** (Critical) - Architecture phase mitigation
3. **Tool Abuse** (Critical) - Architecture phase mitigation
4. **Memory Poisoning** (Moderate) - Architecture phase mitigation
5. **Excessive Token Usage** (Minor) - Deployment phase mitigation

### Comment System Pitfalls - Critical Path
1. **Stored XSS** (Critical) - Design phase mitigation
2. **Spam via No Rate Limiting** (Critical) - Architecture phase mitigation
3. **Moderation Bottleneck** (Moderate) - Architecture phase mitigation
4. **Email Enumeration** (Moderate) - Design phase mitigation
5. **Overly Aggressive Moderation** (Minor) - Operations phase mitigation

## Sources

- **Authentication:** OWASP Authentication Cheat Sheet (HIGH confidence)
  - https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
  - Covers error message security, session management, password policies, timing attacks

- **AI Security:** OWASP LLM Prompt Injection Prevention Cheat Sheet (HIGH confidence)
  - https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
  - Covers prompt injection, structured prompts, input validation, output monitoring

- **AI Agents:** OWASP AI Agent Security Cheat Sheet (HIGH confidence)
  - https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
  - Covers tool security, least privilege, memory poisoning, monitoring

- **Input Validation:** OWASP Input Validation Cheat Sheet (HIGH confidence)
  - https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
  - Covers allowlist validation, free-form text, Unicode handling

- **XSS Prevention:** OWASP Cross Site Scripting Prevention Cheat Sheet (HIGH confidence)
  - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
  - Covers output encoding, HTML sanitization, safe sinks, dangerous contexts

- **Abuse Case Methodology:** OWASP Abuse Case Cheat Sheet (MEDIUM confidence - historical reference)
  - https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html
  - Provides framework for identifying abuse cases in feature design

## Notes

All findings based on OWASP authoritative sources (HIGH confidence). Recommendations prioritize:
1. Defense-in-depth over single-point protections
2. Least privilege principle for all permissions
3. Server-side validation as primary security control
4. Generic messaging to prevent enumeration attacks
5. Structured input handling for AI systems
6. Context-aware output encoding for user-generated content
