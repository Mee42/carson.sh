=====>>>>> header
id: 7
title: blk_update_request, a debugging story
url: blk_update_request
desc: An issue I had, and want the solution to be on the Internet
date: 2020-02-05
tags: hardware troubleshooting
=====>>>>> content

```
lf5 kernel: [   34.516541] blk_update_request: I/O error, dev sda, sector 1669071536
```
This is an error I got, on my server, a week or so ago. 
Every time I got the error, IO on the computer completely stopped.
I search around the Internet, and there wasn't much that was helpful,
so I'm writing this to maybe help someone with the same issue.


After I started having this issue, I started having filesystem corruption on my disk.
I'd recommend backing up everything as soon as possible, before attempting to debug,
It never hurts.

For a quick background on the error, a `blk_update_request: I/O error` is an issue with interfacing
with a data drive. You can see what drive my error is affecting (`/dev/sda`), and that it failed while trying to access sector `1669071536`.

Turns out, in my case, I had a bad SATA cable. In addition to that, it seems like my motherboard *doesn't support* specific combinations of SATA port uses. When using ports #1 and #2, for example, only the first would be accessible. When using ports #1 and #3, it would freeze on boot. When using some other combinations, 


### Update

Turns out it was only a temporary fix. I had to replace the motherboard anda drive. If you get `blk_update_request: I/O error`, backup your stuff.
