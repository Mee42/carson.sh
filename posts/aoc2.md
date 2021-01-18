=====>>>>> header
id: 6
title: Advent of code, Day 2
url: advent-of-code-day-2
desc: Probably done during english class
date: 2020-12-02
tags: algorithm aoc regex
=====>>>>> content

It's day 2, and there's another pair of challenges!

> Your flight departs in a few days from the coastal airport; the easiest way down to the coast from here is via toboggan.

Ah, of course. Who would have thought.

> Their password database seems to be a little corrupted: some of the passwords wouldn't have been allowed by the Official Toboggan Corporate Policy that was in effect when they were chosen.

I guess this is one of the companies that require password changes often. Hate those guys.

> To try to debug the problem, they have created a list (your puzzle input) of passwords (according to the corrupted database) and the corporate policy when that password was set.
> For example, suppose you have the following list:
> ```
> 1-3 a: abcde
> 1-3 b: cdefg
> 2-9 c: ccccccccc
> ```

It seems as if there's only a single "corporate policy" per each password, seperated by a colon.

> Each line gives the password policy and then the password. The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.
> 
> In the above example, 2 passwords are valid. The middle password, cdefg, is not; it contains no instances of b, but needs at least 1. The first and third passwords are valid: they contain one a or nine c, both within the limits of their respective policies.

> How many passwords are valid according to their policies?

Alright, this should be pretty easy.
Right off the bat I can see that it's a very simple algorithm, which returns a boolean value, and we need to count how many times it's `true`. So let's dive into it!

```kt
fun main(){
    val input = """
        1-3 a: abcde
        1-3 b: cdefg
        2-9 c: ccccccccc
    """

    val lines = input.split("\n")       // split by lines
            .filter(String::isNotBlank) // remove lines that are blank
```
We'll try and use the sample input for testing, as we can verify the outcome.

Now, we need to count the number of lines that have valid passwords. Kotlin (the language I'm using) has a builtin function for counting
```kt
fun List<T>.count(predicate: (T) -> Boolean): Int { ... }
```
The function runs the `predicate` over each element, returning the count of ones that return `true`.

```kt
val answer = lines.count { line -> 
    // checking code ...
}
```

If we go back to the sample input, we can see it follows a simple grammar: `1-2 a: password`.
We need to extract certain parts of this input to put into variables
```
1-2 a: abcdefgh
^ ^ ^  \--------> password
| | |
| | letter
| upper
lower
```
The fastest way to do this is to split the string at a couple key points - between each important element. We can use a regex to define where we want to split. 
```kt
val (lower, upper, letter, password) = line.trim().split(Regex("(-)|(: )|( )"))
```
For those who don't know, regex is just a way of selecting text. If we split a string (the input) by a regex, we'll get all the text around it in a list, but not the text actually matched.

The regex we use here is pretty simple. The `|` OR bars let us match on *any* of the options, as long as one of them matches.
```regex
(-)|(: )|( )
 ^   ^^   ^
 |   |   Match a single space
 |  Match a colon, and then a space. This is the text between the letter and the password
Match a single hyphen character (split between the numbers)
```
Here I use a Kotlin feature called "destructuring" to put all the matched elements into separate variables, so the first match goes into the variable `lower`, and the next `upper`, and so one.

Now we need to get how many of the letter `letter` is in the `password`.
I used another `count` call to count how many letters in the password equalled the `letter` input.

```kt
val count = password.count { char -> char.toString() == letter }
```
I needed to convert the char to a string to compare it to `letter`, as `letter` is a `String`. 

*Note, if you're writing this in Java, you need to use `.equals()` to compare strings, instead of `==`*

Then, we can just return if the `count` is within valid range. Here's what it ends up looking like:
```kt
val count = lines.count { line ->
    val (lower, upper, letter, password) = line.trim().split(Regex("(-)|(: )|( )"))

    val count = password.count { char -> char.toString() == letter }
    
    return@count count >= lower.toInt() && count <= upper.toInt()
}
```
Now, in Kotlin lambdas, we can remove the last return statement (it's automatically inserted). The finally solution for part 1 ends up being.
```kt
fun main1(): Int {
    val lines = inputLines(day = 2)
            .filter(String::isNotBlank)
    val count = lines.count { line ->
        val (lower, upper, letter, password) = line.trim().split(Regex("(-)|(: )|( )"))

        val count = password.count { char -> char.toString() == letter }

        count >= lower.toInt() && count <= upper.toInt() // implicit return of this boolean
    }
    return count
}
```

It works for the sample input, and it works for my sample input.

## Part 2

> While it appears you validated the passwords correctly, they don't seem to be what the Official Toboggan Corporate Authentication System is expecting.
> 
> The shopkeeper suddenly realizes that he just accidentally explained the password policy rules from his old job at the sled rental place down the street! The Official Toboggan Corporate Policy actually works a little differently.

Oh no! We'll have to copy our code and make some adjustments.

> Each policy actually describes two positions in the password, where 1 means the first character, 2 means the second character, and so on. (Be careful; Toboggan Corporate Policies have no concept of "index zero"!) Exactly one of these positions must contain the given letter. Other occurrences of the letter are irrelevant for the purposes of policy enforcement.

So we need to get the two characters at the points `lower` and `upper` (plus one), see if they equal `letter`, and return true if and only if only one of them are equal. Our truth table would look like this,
```js
lower | upper | result
  1       1       0     // both are equal, there's more then one, so it's a false result
  1       0       1     // only one is equal, result is true
  0       1       1     // same as 1, 0
  0       0       0     // neither match, so it's false
```
you might notice this truth table looks exactly like the `xor` function!

Let's just write this out:
```kt
val result = (password[lower - 1] == letter) xor (password[upper - 1] == letter)
```
*Remembering that we need to subtract `1`, as the given inputs are based on a 1-index.*

There's some type issues we need to fix, though. `lower` is a `String` not an `Int`, `letter` is also a `String` not a `Char`. We'll have to convert them, which makes the code look a bit worse.
```kt
val result = (password[lower.toInt() - 1] == letter[0]) xor (password[upper.toInt() - 1] == letter[0])
```

Now we can integrate it into our original counting function.
```kt
fun main2(): Int {
    val lines = inputLines(day = 2)
            .filter(String::isNotBlank)
    val count = lines.count { line ->
        val (lower, upper, letter, password) = line.trim().split(Regex("(-)|(: )|( )"))

        val result = (password[lower.toInt() - 1] == letter[0]) xor (password[upper.toInt() - 1] == letter[0])
        result // implict return
    }
    return count
}
```
And that's it, part 2 was pretty easy. There is a couple changes I'll make to change this into more idiomatic Kotlin code, but is mostly irrelevant to the discussion.
```kt
fun main2(): Int = inputLines(day = 2)
        .filter(String::isNotBlank)
        .count { line -> 
            val (lower, upper, letter, password) = line.trim().split(Regex("(-)|(: )|( )")) 
            (password[lower.toInt() - 1] == letter[0]) xor (password[upper.toInt() - 1] == letter[0]) 
        }
```

Thanks for reading :) I plan on doing these writeups for as long as I have the time.