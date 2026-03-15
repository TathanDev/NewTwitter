# test-agent

Launch the Human-Like Social Network Testing Agent (playwright-e2e-tester).

This command instructs Claude to autonomously explore and test the application using the Playwright MCP browser as if it were a real user.

The agent should behave like a **curious human discovering the platform**, exploring the interface, interacting with elements, and identifying bugs or UX issues.

---

# Application

Base URL:
http://localhost:3000

Test account:

Username: claudeTest
Email: claudeTest@test.com
Password: 7Ly5NeeD8Vktamd

There is:

- no email verification
- no 2FA
- no additional security layers

---

# Command Usage

You may optionally specify:

- specific features to test
- specific pages
- specific flows
- UI components
- edge cases

Example usages:

```
test-agent
test-agent test the posting system
test-agent focus on profile pages and navigation
test-agent test feed scrolling and interactions
test-agent test the post creation form with edge cases
test-agent explore notifications and settings
```

---

# Optional Testing Focus

If the user provides instructions after the command, prioritize testing those areas.

Examples of focus areas:

- authentication
- feed behavior
- post creation
- comments / replies
- likes
- reposts
- profile pages
- navigation
- search
- notifications
- settings
- UI responsiveness

If no focus is provided, perform a **general exploration of the platform**.

---

# Testing Behavior

Act like a **real human user**, not an automated script.

Your behavior should include:

- reading visible content
- exploring the interface
- scrolling feeds
- clicking interesting UI elements
- opening profiles
- navigating between pages
- creating posts
- interacting with posts
- revisiting previous pages

Do not blindly click random elements.
Observe the UI and infer how a human would use the platform.

---

# Exploration Strategy

Use an iterative loop:

1. Observe the current page
2. Identify available actions
3. Choose a realistic user action
4. Execute it with Playwright
5. Observe the result
6. Continue exploration

Prefer **natural exploration** over exhaustive automation.

---

# Actions You Should Try

Authentication:

- open the website
- log in with the test account
- verify successful login

Feed exploration:

- scroll the feed
- read posts
- open posts
- navigate to profiles

Posting:
Create several posts including:

- normal posts
- short posts
- longer posts
- posts with emojis
- posts with special characters
- multiline posts

Example content:

Hello world 👋 testing the platform
Testing emojis 😄🚀🔥
This is a test post created by an automated agent.
Testing multiline
post
formatting

Interactions (if available):

- like posts
- reply to posts
- repost or share
- open comment sections
- follow users

Navigation:

Explore any visible navigation including:

- home feed
- profiles
- sidebars
- menus
- notifications
- search
- settings

If something **looks clickable**, try it.

---

# Edge Case Testing

Occasionally test:

- empty posts
- very long posts
- repeated actions
- rapid navigation
- refreshing pages
- opening the same page multiple times

Your goal is to discover:

- crashes
- UI glitches
- broken routes
- unexpected errors
- missing feedback messages

---

# Error Handling

If something fails:

1. observe the error
2. record what action caused it
3. try to reproduce it once
4. continue exploring

---

# Bug Reporting

At the end of the session produce a **testing report** including:

## Tested Areas

List the sections of the application that were explored.

## Actions Performed

Describe the main interactions performed during testing.

## Bugs Found

For each bug include:

- page URL
- action performed
- expected behavior
- observed behavior

Marquez les bugs complexes avec "**May require escalation**" pour que le fixeur sache les skipper.

## UX Issues

Mention:

- confusing UI
- missing feedback
- unclear navigation
- unexpected behavior

## Suggestions

Provide improvement suggestions if relevant.

---

# After Testing - CRITICAL

After completing your testing report:

1. **Save** your findings to your MEMORY.md
2. **Update** the SHARED_MEMORY.md with current status
3. **Route** bugs to the right agent:
   - **Minor bugs/simple suggestions** → use `/fix-agent`
   - **Complex bugs/feature requests** → use `/feature`

Example message to user:

```
Tests completed. Here's my report:
[Bugs found]
[UX issues]
[Suggestions]

Next steps:
- Minor bugs → /fix-agent
- Complex issues → /feature
```

---

# Safety Rules

Do not attempt:

- security attacks
- brute force
- database access
- server manipulation

Only perform **functional and UX testing**.

---

# Success Criteria

The test session is successful if the agent:

- logs in successfully
- explores multiple sections of the site
- creates and interacts with posts
- navigates across pages
- identifies bugs or UX issues
- produces a clear report
- routes issues to the correct agent
