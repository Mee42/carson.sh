=====>>>>> header
id: 3
title: How to (not) mess up Git
url: how-not-to-mess-up-git
desc: Git is more then memorizing a few commands and rm -rf * when things go south. Using git properly is important.
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

When you are working in git, you have this reference called HEAD, which refers to the current working commit.
You are always "on" a specific commit, which is reflected in the current state of the source code.
With git the was you change between commits is the `git checkout` command.

There's also "detached head" state, where you do not live on a branch but instead a specific commit, named by its hash. This is unusual, but worth noting.

**A key point here is that branches don't technically have multiple commits.**

Branches are a single commit, and each commit is some changes plus it's parent(s).
Here's a quick example:
```
 a -> b -> c -> d     <--- master
      \
       \--> e -> f    <--- dev
```
`a` is the initial commit. For the purpose of this page, there is only ever one inital commit - while there can be others, merging them isn't really done.

You might look at this and say "okay, well, `e` is on the `dev` branch. And, you'd be almost correct.
While dev does encompase `e`, and `e` is "on dev", the `e` commit contains exactly zero information about the `dev` branch. 
You can see that in the next step:
```
 a -> b -> c -> d -----> g    <--- master
      \                 /\
       \--> e -> f -----/
```
In this step, we merged dev into `g` with a merge commit.

Now what branch is `e` on? It's actually on master - but when you commited, you commited to dev!
Doing a very basic `git log` will just show you `g, f, d, e, c, b, a`, which has no way to tell the difference between commits done on dev and commits done on master.

This could be an issue if you wanted to have broken code on dev (say commit `e` doesn't work), and now all the sudden it's on master! Some git loggers will properly split the commits so they visually appear on a different history path then the master branch, but they're still 100% on the master branch without the context of dev.

## Some common Git problems

#### I made a commit to the wrong branch!
```
a -> b -> c   <--- master
```
Whoops, you wanted to make the `c` commit on `dev`! This happens to me at least once a week.
The fix is easy, but you have to be careful because it involves rewriting history.
```
$ git reset --soft HEAD~1
```
This will reset your git repo to `HEAD~1` (meaning the commit before `HEAD`), but because it's a `--soft` reset, it'll keep all the changes in that commit and put them back into staging. Then you can
```
$ git checkeout -b dev
$ git commit
```

#### I made a commit to the wrong branch and pushed it!

First, check with everyone who works on the project to make sure they haven't touched anything yet.
If they haven't, you can delete the `c` commit on master with a force push
```
$ git push --force origin master
```
However, this is *not good* and should be avoided if possible. Branch protection rules are offered by GitHub and GitLab, use them if you need to.

#### I made a commit and now there's a merge conflict