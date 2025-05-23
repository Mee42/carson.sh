=====>>>>> header
id: 8
title: Repairing a Macintosh Classic
url: mac_repair
desc: Repairing a 1992 Mac Classic
date: 2022-01-14
tags: hardware troubleshooting
=====>>>>> content

The Macintosh Classic in question :sparkle:

<figure>
  <img
  src="https://upload.wikimedia.org/wikipedia/commons/d/d8/Macintosh_classic.jpg"
  alt="A picture of a Mac Classic"
  title="All the memory you need">
  <figcaption>
    <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=10101">Link</a>
  </figcaption>
</figure>



Released in 1990, sporting a slightly unimpressive 1MB of ram, a 8 MHz clock, and a 9-inch B&W CRT, the Macintosh Classic
released at the cheap price point of $999. They sold about a million of these fancy beige boxes.

And I've got one of them!

(image of mine)

Unfortunately, after turning it on, it doesn't *really* work

<figure>
    <img src="/line.jpg" title="flatland"/>
    <figcaption>After turning it on.</figcaption>
</figure>

It's a line! Unless you're a [Flatland](https://en.wikipedia.org/wiki/Flatland) fan,
this clearly isn't a functional computer. However, this isn't an issue you'll see on any modern computer - it's an issue with the [Cathode-Ray Tube (CRT)](https://en.wikipedia.org/wiki/Cathode-ray_tube) display used on the Mac.

<figure>
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Cathode_ray_Tube.PNG"
         title="What would we do without stock wikipedia diagrams"/>
    <figcaption>
    <a href="https://en.wikipedia.org/wiki/Image:Cathode_ray_Tube.PNG" class="extiw" title="en:Image:Cathode ray Tube.PNG">wiki Cathode ray Tube.PNG</a>
    </figcaption>
</figure>

The deflection coils (electromagnets) "bend" the electrons shot from the electron gun (the cathode)
to contact different parts of the screen, which is coated in chemicals that emit light when hit by electrons.

There's two sets of deflection coils, one to control the horizontal bending and one to control the vertical bending of the electrons.
Looking at the voltage across each of these coils, they should look both *something* like a sawtooth, going from top to bottom (or left to right) and then "jumping" back to the start to repeat the process. 

<figure>
    <img src="https://www.eevblog.com/forum/repair/help-fixing-a-crt-terminal/?action=dlattach;attach=1217909;image"
         title="This screenshot is not from a mac, but the same principle applies"/>
    <figcaption>
<a href="https://www.eevblog.com/forum/repair/help-fixing-a-crt-terminal/50/">Stolen from a webpage about repairing CRTS</a>    </figcaption>
</figure>

That's what the horizontal sweep *should* look like
However, when probing the wire going directly from the Analog Control Board on the to the magnet coils, we see something a bit different.

<figure>
  <img
  src="/oscope.jpg"
  alt="A picture of a Mac Classic"
  title="It kinda looks like McDonalds.">
  <figcaption>
    Probing the wire going to the horizontal yoke on the CRT. I don't know why they're called yokes
  </figcaption>
</figure>


This is a weird signal. I haven't yet figure out why it doesn't look like a sawtooth, 
but I think it explains why the line across the screen doesn't fully reach the edges.

The **vertical** sweep, on the other hand, has no signal on it whatsoever.
This explains why the CRT is drawing a line across the screen -
it just paints every single row of the screen in the same place, one on top of the other.


-----------


According to the Internet, these capacitors (especially electrolytic ones) on machines from ths era tend to fail in storage,
and it's a miracle that this machine is still turning on at all.
Additionally, the CMOS battery has a good chance of exploding and coating the inside of the machine with electrolite. Bad stuff.

Luckily, people have already figured out what capacitors are needed.

<figure>
    <img src="/recap_guide.png" title=""/>
    <figcaption>
    <a href="https://caps.wiki/wiki/Macintosh_Classic" class="extiw" title="en:Image:Cathode ray Tube.PNG">https://caps.wiki/wiki/Macintosh_Classic</a>
    </figcaption>
</figure>

They'll be on my next Mouser order. Hopefully this fixes the problem!