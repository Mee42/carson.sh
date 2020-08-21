=====>>>>> header
id: 2
title: How to (not) mess up Git
desc: Git is more then memorizing a few commands and reseeting when things go south. Using git properly is important.
date: 2020-08-21
tags: unreleased
=====>>>>> content
Git is hard! A lot of people I know only know a couple git commands
```
$ git add -A .
$ git commit -m $message
$ git checkout $branch
$ git push origin $branch
```
and while this works for 90% of all work done on git, it's woefully incompetent at the other 10%: fixing shit when it breaks.

*Now, just to note, git rarely "breaks". It's almost always the developer doing something they shoudn't have.*

This document is going te be a brief summary on some major misconceptions of Git, and then some specific helpful examples that I've needed to use in my time working with Git, or helping other people with them.

## What branches are

Branches are reference to commits. To rephrase that, a branch is just a pointers to a specific commit.

When you are working in git, you have this reference called HEAD, which refers to the current working commit. You are always "on" a specific commit, which is reflected in the current state of the source code. With git the was you change between commits is the `git checkout` command. 