=====>>>>> header
id: 8
title: Repairing a Macintosh Classic
url: mac_repair
desc: Repairing a nonfunctional 1992 Mac Classic (Hopefully!) 
date: 2022-01-14
tags: hardware troubleshooting
=====>>>>> content

The Macintosh Classic

<figure>
  <img
  src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Macintosh_classic.jpg"
  alt="A picture of a Mac Classic"
  title="Things looked classier in the past">
  <figcaption>
    <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=10101">Link</a>
  </figcaption>
</figure>



Released in 1990, sporting a slightly unimpressive 1MB of ram, a 8 MHz clock, and a 9-inch B&W CRT, the Macintosh Classic
released at the cheap pricepoint of $1000. They sold like, half a million of these fancy beige boxes.

And I've got one of them!

(image)

It's not mine to keep, but a friend aquired one from a relative, and that's good enough for me.
The issue starts when we turn it on...

<figure>
    <img src="/line.jpg" title="Carson hoodie reveal????">
    <figcaption>After turning it on.</figcaption>
</figure>

It's a line! Unless you're a [Flatland](https://en.wikipedia.org/wiki/Flatland) fan,
this clearly isn't a functional computer. However, this isn't an issue you'll see on any modern computer - it's an issue with the [Cathode-Ray Tube (CRT)](https://en.wikipedia.org/wiki/Cathode-ray_tube) display used on the Mac.

<figure>
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Cathode_ray_Tube.PNG"
         title="What would we do without stock wikipedia diagrams"/>
    <figcaption>
    By <a href="https://en.wikipedia.org/wiki/User:Theresa_knott" class="extiw" title="en:User:Theresa knott">Theresa Knott</a> - <a href="https://en.wikipedia.org/wiki/Image:Cathode_ray_Tube.PNG" class="extiw" title="en:Image:Cathode ray Tube.PNG">en:Image:Cathode ray Tube.PNG</a>, <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=100143">Link</a>
    </figcaption>
</figure>

The deflection coils (Magnets!) "bend" the electrons shot from the electron gun (The Cathode)
to hit the right spot screen, which (coated in phosphor) emits light when hit by electrons.

There's two sets of deflection coils, one to control the horizontal bending and one to control the vertical bending of the electrons. Looking at the signals, they should look both *something* like a sawtooth, going from top to bottom (or left to right) slowly while sending the electrons and then "jumping" back to the start to repeat the process. 


<figure>
    <img src="https://www.eevblog.com/forum/repair/help-fixing-a-crt-terminal/?action=dlattach;attach=1217909;image"
         title="I need to figure out how to take multimeter screenshots that look this pretty"/>
    <figcaption>
<a href="https://www.eevblog.com/forum/repair/help-fixing-a-crt-terminal/50/">Stolen from a webpage about repairing CRTS</a>    </figcaption>
</figure>

That's what the **horizontal** sweep *should* look like (or, some noisy derivative of it, doesn't particularly matter).
However, when probing the wire going directly from the Analog Control Board to the magnet coils, we see something a bit different.


<figure>
  <img
  src="/oscope.jpg"
  alt="A picture of a Mac Classic"
  title="It kinda looks like McDonalds.">
  <figcaption>
    Probing the wire going to the horizontal yoke on the CRT. I don't know why they're called yokes, don't ask me.
  </figcaption>
</figure>



(You might see the voltage is up in the hundreds. The electron gun itself runs at about 860.
Propery safety is a vital part of every hobbiest electrician's toolkit something something something - 
I highly recommend high voltage gloves. 10mA through your heart is instant death)

This is a weird graph. I literally have no clue why it's like this,
but I think it explains why the line across the screen doesn't fully reach the edges.
We'll come back to this.


The **vertical** sweep, on the other hand, has no signal on it whatsoever.
I would include the picture, but it's literally a horizontal line.
This explains why the CRT is drawing a line across the screen -
it just paints every single row of the screen, on the single row in the middle.



-----------



According to the Internet, these capacitors on these fucking machines just kill themselves after like a decade, and it's a miracle that this machine is still turning on at all.
Fucking Apple, man. I think I'm going to have to buy new caps, desolder the old ones and install new ones
on both the Logic Board and the Analog Power Board.


-----------

To be continued, hopefully the new capacitors + new cmos battery fixes the CRT issues.