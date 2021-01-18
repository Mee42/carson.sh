=====>>>>> header
id: 5
title: Advent of code, Day 1!
url: advent-of-code-day-1
desc: A short writeup for the first day of Advent of Code!
date: 2020-12-01
tags: algorithm aoc
=====>>>>> content

Advent of code is a month-long (25 days, really) coding challenge that tens of thousands of developers partake in every year. It's not a competition, unless you want to compete at midnight with everyone else to solve it as fast as possible, which is not most people.


I'm Carson, and in this post I'm going to be going over the basics of the competition, and then getting into the day 1 challenge, which was released today (December 1st) at midnight EST.

## What is Advent of Code

Advent of Code (AOC), like I said before, is a 25 day programming challenge.
Each day there is a 2-part problem released. 
The unofficial "goal" of many programmers is to finish the challenge within that day, but there is no time limit! The 2016 challenges are still open, if you can't get enough of the 2020 season.

Who does Advent of Code? Anyone who wants to! 
You can read some general information [on the about page](https://adventofcode.com/2020/about).
You don't need to have 10 years of experience in development work.

*I'll be quoting the AOC website using quote blocks throughout these blog posts*

> You don't need a computer science background to participate - just a little programming knowledge and some problem solving skills will get you pretty far.

I run my school's Computer Science club, and we have many members who don't have much formal education in CS - but still can tackle some of these problems, and learn lots about Computer Science.

### So... Are the problems hard?

Yes and no. The first couple are easier, the last couple will take work. 
Doing 5 is much better than doing 0 - so don't worry about not being up to the later days.

## Day 1

So, let's dive into a question! I'm going to read through the day 1 page, and talk more about AOC. There won't be any spoilers until you reach the warning.

--------

> The tropical island has its own currency and is entirely cash-only. The gold coins used there have a little picture of a starfish; the locals just call them stars. None of the currency exchanges seem to have heard of them, but somehow, you'll need to find fifty of these coins by the time you arrive so you can pay the deposit on your room.
>
> 
> To save your vacation, you need to get all fifty stars by December 25th.

Advent of Code has some story, which makes reading each of the challenges easier and more enjoyable.

> Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

The goal is to get 50 stars, which means finishing both part 1 and part 2 of all 25 days
This may seem like a lot, but it's only 2 a day - definitely doable, if you have the time.

> Before you leave, the Elves in accounting just need you to fix your **expense report** (your puzzle input); apparently, something isn't quite adding up.

Now, we're getting to the *challenge*.
There's a couple key elements that are the same for all challenges.

All challenges have a *puzzle input*. This is a plaintext file that you can find with a link on the page, and is personalized to you in specific (so you can't easily cheat). 
It's important to download this file and read it into your program to start off the challenge.

> Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together.

Once we get to this line, we need to start thinking about solving the challenge.
We can see that the input is a list (or set, as order is irrelevant) of numbers. Generally the numbers will fit within a 32-bit integer, unless otherwise specified, so you can use the normal int type in your programming language of choice. The output is the product of two numbers, so the output is also a number. This is something shared between all challenges - the solution is a number.

> For example, suppose your expense report contained the following:
> ```
> 1721
> 979
> 366
> 299
> 675
> 1456
> ```

This is a *sample input* to your program. They give you the answer, as well as an explanation

> In this list, the two entries that sum to `2020` are `1721` and `299`. Multiplying them together produces `1721 * 299 = 514579`, so the correct answer is `514579`. 

You'll need to test your program on this sample input to verify that it works before trying it on the puzzle input given to you, as it says on the next line

> Of course, your expense report is much larger. Find the two entries that sum to 2020; what do you get if you multiply them together?

So, that's the challenge. Go at it. Come back once you're done.

You don't get access to part 2 until you finish part 1, so you need to finish part 1 first.

---

## Advent of Code Day 1 Writeup

*note - if you have not completed both parts of the day 1 challenge, you should not read on, that's cheating*

> Specifically, they need you to **find the two entries that sum to 2020** and then multiply those two numbers together.

My first thought is that we need to find two entries. A pair of entries. 
If you look at the example input, these entries don't need to be next to each other in the input - 
it just needs to be any two numbers.

So, we'll try and iterate through all possible pairs of entries. We can do this with a couple loops.

*As a side note, I'll be doing these writeups in a variety of languages. 
I will try and make it readable without knowledge of those language*

```kt
val input = inputLines(1) // this function gets the puzzle input
for(val firstEntry : input) { // iterate over each element in input
    for(val secondEntry : input) { //  iterate over again, for each value in input
        // ... code
    }
}
```
Inside the two loops, we'll need to check to see if it is a valid pair of entries. To refer back to the page

> Of course, your expense report is much larger. Find the two entries that sum to 2020; what do you get if you multiply them together?

We need to see if the sum is 2020, and if it is, return the product.
```kt
val sum = firstEntry + secondEntry;
if(sum == 2020) {
    println("The answer is :" + (firstEntry * secondEntry))
    return // avoid doing unnecessary computation after we find the answer
}
```

And... this works! This problem was pretty simple.

*However...* Before we move on to part 2, I want to touch briefly on computation time.

With the two nested loops, this solution will run in `O(n^2)`. 
For those not familiar with big-O, all that means is that if the input (`n`) is `20`, then the program will run in `400c`, where `c` is an unknown constant. The important part is how this scales - if `n` increases by `5`, becoming `n = 25`, then the running time becomes `625`, which is quite a bit more than the initial `400`. If we have a `O(n^2)` solution, there is a maximum value of `n` for which it will take longer than acceptable to run. A `O(n)` solution can have a much much higher value for `n` (in theory) before it takes too long, and a `O(n^2)` solution will have a very low limit on `n` because of how fast it grows.

So, we want to try and have an `O(n)` solution. That means we can only have one loop:
```kt
for(val firstEntry : inputs) {
    // ... code
}
```
Now, one fun thing we can use is that, for a valid solution, `firstEntry + secondEntry = 2020`.
This means we can calculate a "possibly valid `secondEntry`", that may or may not be in the input list, with subtraction
```kt
for(val firstEntry : inputs) {
    val possibleSecondEntry = 2020 - firstEntry
    // now we need to see if possibleSecondEntry exist in the input
    for(val checkingSecondEntry : inputs) { // line 4
        if(possibleSecondEntry == possibleSecondEntry) {
            println("Got result! " + (firstEntry * possibleSecondEntry))
            return
        }
    } // line 9
}
```
Now, this is actually still on the order of `O(n^2)`. We still have two loops. We haven't gained anything.

If you look between line 4 and 9, you can see there's an exact implementation of a `List<T>#contains(T)` function.
Seeing if an element is contained within a list is an inherently `O(n)` operation, as you need to iterate over each element.


There is, however, another data structure that has a `O(1)` contains function.

#### Introducing, HashSets

Sets are like lists, but do *not* have order, nor do they have duplicate elements. 
Without the responsibility of maintaining order, sets can have `O(1)` insertion, deletion, query functions - and, important to us, they can do `contains` in just `O(1)`.


Let's rewrite our code to use a HashSet.

```kt
val inputSet = inputs.toHashSet() // convert to a hash set
for(val firstEntry : inputSet) {
    val possibleSecondEntry = 2020 - firstEntry
    if(inputSet.contains(possibleSecondEntry)) { // O(1)
        // the input does contain that possible second entry!
        println("Got the result: " + (firstEntry * possibleSecondEntry))
        return 
    }
}
```

This also works, and it'll work with much larger inputs than the above `O(n^2)` solution (though it's irrelevant for our `n = 200` puzzle input).


## Part 2

> In your expense report, what is the product of the three entries that sum to 2020?

We want to do this the same way as the other one - generate all possible combinations of 3 entries, and then verify that they are all part of the input (if we don't know already), and see which work. 

Now, given just `firstEntry`, we can't calculate `possibleSecondEntry` and `possibleThirdEntry`. We need to check a valid second entry in order to calculate the third entry. This means two loops
```kt
for(val firstEntry : inputSet) {
    for(val secondEntry : inputSet) {
        // By here, we can calculate possibleThirdEntry, and test it
        val possibleThirdEntry = 2020 - firstEntry - secondEntry
        if(inputSet.contains(possibleThirdEntry)) {
            println("finally, got it" + (firstEntry * secondEntry * possibleThirdEntry)) // multiply them all
            return
        }
    }
}
```

Now, this is `O(n^2)`. It is actually an *unsolved challenge* in computer science to preform this as fast as possible. You can read about it more [on the 3SUM Wikipedia page](https://en.wikipedia.org/wiki/3SUM), if you want to waste any more of your afternoon on Advent of Code.

That's about it, though. If you have any comments on this page, you can reach me at `arson#5069`. 




Here's my final code, as well as [a link to the GitHub repository](https://github.com/Mee42/aoc-2020/blob/master/src/main/kotlin/day1/Day1.kt)
```kt
fun main1(): Int {
    val numberSet = inputLines(1).filter { it.isNotBlank() }.map { it.toInt() }.toSet()

    for (i in numberSet) {
        val need = 2020 - i
        if (need in numberSet) return i * need
    }
    error("no solutions found")
}

fun main2(): Int {
    val numberSet = inputLines(1).filter { it.isNotBlank() }.map { it.toInt() }.toSet()

    for (i in numberSet) {
        for (j in numberSet) {
            val need = 2020 - i - j
            if (need in numberSet) return i * j * need
        }
    }
    error("no solutions found")
}
```