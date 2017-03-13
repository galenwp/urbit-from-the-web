---
navhome: /docs/
title: An Urbit social app tutorial
---

# An Urbit social app tutorial

Probably the most fun thing about Urbit right now for developers, which
we're going to try and highlight in this new multi-part tutorial series, is
how easy Urbit makes it to build and deploy web apps.

In Part 1, we'll just cover the basics of how to communicate with a ship's
backend from a trivial vanilla frontend using `:Talk` as a simple message bus.
We'll be able to send direct messages to our ship and other ships,
create new personal "stations" where we can send ourselves messages, and
load the history of messages on the page from at most one of any live Talk
stations.

In Part 2, we'll upgrade to a React/Redux app that will allow us to subscribe
to multiple stations and view them all and their message histories in
a continuous single-page feed.

Finally, by the end of Part 3, we'll have built out a full,
production-quality app where we'll be able to customize a profile, filter our current single-page feed by the which stations we want in the current context,
allowing us to have different single feeds for "news" and "music" and "dev";
isolate direct messages to other ships in their own section, and search for
messages in your feeds based on hashtag strings.

Let's get started!

<list/>
