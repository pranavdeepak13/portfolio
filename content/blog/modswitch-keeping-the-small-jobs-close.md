---
title: "ModSwitch: keeping the small jobs close"
description: Why I built a routing layer that gives simple coding tasks to a local model and checks the work before it returns.
date: 2026-09-23
category: Projects
published: true
---

I built [ModSwitch](https://github.com/pranavdeepak13/modswitch) around a practical annoyance (because I was hitting token limits everyday) : not every coding task needs a cloud-model round trip, but I do not want to accept local-model output on faith either.

The project is a routing layer for coding agents. It takes a request, breaks it into smaller tasks, and sends the simple ones to a local model. Fixing lint, generating tests, or making a contained change are the kind of jobs it can try locally. Bigger work stays with the cloud agent.

That division matters to me. Small jobs should be quick, cheap, and close to the repository. Complex jobs still need a stronger model and more context. Treating both as the same kind of request wastes time in one direction and trust in the other.

## A diff is not proof

The local model does not hand back a paragraph saying it solved the problem. It produces a diff. ModSwitch then runs that diff through a gate ladder: syntax parsing, scope checks, linting, type checks, and tests. A failed check sends the task back to the cloud agent with the reason it failed.

I like that constraint because it keeps the system honest. A local model can be useful without becoming the final authority on a codebase.

## The shape of the tool

ModSwitch has a Python core for routing, decomposition, local execution, verification, and repository context. It also has a CLI, an MCP server, and a Rust edge proxy for streaming work. The CLI exposes the parts I reach for most: `doctor` for setup, `decompose` for splitting a request, `verify` for checking a diff, and `context show` for a compact map of a repository.

The project is still an attempt, not a finished answer to agentic coding. I am building it to find out where local models save real time, where they create extra review work, and what a verifier has to catch before delegation is useful.

The source is [on GitHub](https://github.com/pranavdeepak13/modswitch). I will write more about the decisions that survive contact with actual projects.
