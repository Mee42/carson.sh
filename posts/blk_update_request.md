=====>>>>> header
id: 7
title: blk_update_request: I/O Error
url: blk_update_request
desc: The issue with using decade-old hardware
date: 2020-02-05
tags: hardware troubleshooting
=====>>>>> content

```c
lf5 kernel: [   34.516541] blk_update_request: I/O error, dev sda, sector 1669071536
```
I got this error in `dmesg` on my server about a week ago -
and every time I got the error, IO on the computer completely stopped until I restarted the entire box.
I search around the Internet, and there wasn't much that was helpful. This blog post is about the same.

After I started having this issue, I started having filesystem corruption on my disk.

I was able to temporarily solve my issue by swapping SATA ports around on my motherboard, though some new combinations wouldn't even allow me to boot into BIOS.

That was only a temporary fix, though - I eventually the drive entirely failed and I was happy I had an effective backup solution.
