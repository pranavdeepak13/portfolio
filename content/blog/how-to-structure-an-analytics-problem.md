---
title: How to structure an analytics problem
description: A sample framework for turning an open-ended question into a decision someone can act on.
date: 2026-09-06
category: Analytics
published: true
---

> Sample article — replace this text with Pranav's final draft before publishing the portfolio.

An analytics request often arrives as a broad question: *Why did this number move?* The useful work begins by translating that question into a decision, a comparison, and a bounded set of evidence.

## Name the decision

Write the decision in one sentence. If the analysis succeeds, what will someone do differently?

An effective problem statement usually contains:

- the person making the decision;
- the behaviour or outcome under review;
- the time window;
- the comparison that gives the number meaning.

Without these boundaries, a dashboard can accumulate detail while the original question becomes harder to answer.

## Build the smallest trustworthy view

Start with the grain of the data and the definition of the outcome. Then check the joins, exclusions, and missing values before interpreting movement.

> A precise metric with an unclear denominator is still an unclear metric.

The first useful output might be a small table rather than a polished chart. It should let a reviewer reproduce the conclusion and challenge the assumptions.

## Separate observation from explanation

Use a short sequence:

1. State what changed.
2. Show where the change is concentrated.
3. List plausible explanations.
4. Test the explanations with available evidence.
5. Mark what remains uncertain.

This structure keeps a correlation from quietly turning into a causal claim. It also makes the next measurement easier to plan.

## End with a next step

The final paragraph should not merely repeat the chart. It should name the choice, the expected signal, and when the result will be reviewed again.

Clear analysis is not the largest collection of facts. It is the shortest defensible path from a question to an action.
