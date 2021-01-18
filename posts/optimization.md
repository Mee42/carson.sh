=====>>>>> header
id: 4
title: Some thoughts on optimization
url: optimization-thoughts
desc: A short introduction to basic optimization
date: 2020-10-21
tags: compilers optimization
=====>>>>> content
# Optimization Thoughts

Optimization is a large topic, and only some basics are going to be covered here.
We'll be talking about *AST optimizations* today, as it's the most universal form of optimization, independent of backend.

An AST is an *Abstract Syntax Tree*. This is just how a compiler represents the source code in memory. While we'll being doing a lot of Source Code to Source Code changes for each optimization step, keep in mind that there are not stringy values being manipulated, but a more efficient tree data structure. For the sake of this page, we'll just be working with readable source code.

Let's take a very simple program
```kt
fun main() {
     val a = 7
     var c = a
     c += 1
     val b = a*2 + foo(a) + c
     if(b < a) error("reached illegal state")
     while(b > c) c+=c; // do some fun doubling
     println(a + b + c);
}

fun foo(i: Int): Int {
    return if(i < 2) 19 else 18;
}
```
Now, let's optimize this down:


### Constant Value Propagation

Constant Value Propagation, or CVP for short on this page, is taking values that are constant (or static) and propagating them across the program. It's effectively inlining variables that have constant, known values. For example,
```kt
val a = 7
val b = a
val c = a + a
```
can just be
```kt
val a = 7
val b = 7
val c = 7 + 7
```
This is powerful because it eliminates the overhead of fetching variables like constants. This doesn't seem *that* helpful at first, but it becomes much more useful when combined with other optimizations.

One shortcoming of CVP is that it requires all values to be known at compile time, and for all values to be stored in **final**, or constant variables, so they do not change.

Let's put our example program through some constant value propagation.

```kt
fun main() {
     val a = 7 // this is able to be propagated easily
     var c = 7 // this is not, as it is mutable (it might change). However, we still inline the 7 from 'a'
     c += 1
     val b = 7*2 + foo(7) + c // here we inline the value for 'a'
     if(b < 7) error("reached illegal state") // everywhere we use 'a' we can replace it with 7
     while(b > c) c+=c; 
     println(7 + b + c);
}
```

### Expression Folding

Expression Folding is pretty simple: pure operations, like arithmetics on pure expressions, can be done at compile time. 
Purity in this context means it doesn't matter if it's actually evaluated at runtime; 
`print(4)` is *impure*, because if you removed it, the program would work differently. 
A *pure* expression can be removed without affecting the program, 
`7 + 8` does not need to be computed at runtime if the program does not use the resulting sum. 
There's also no need to do `2+2` at runtime when the compiler can just insert `4`, because addition is pure.
Given this, we can somewhat reduce the amount of computation we'll do at compile time. In each of theses steps, we'll be continuing on from the function before it, so the input to this optimization step is the outputted function above from Constant Value Propagation.

```kt
fun main() {
     val a = 7 
     var c = 7 
     c += 1
     val b = 14 + foo(7) + c  // '7*2' can be changed to '14'
     if(b < 7) error("reached illegal state")
     while(b > c) c+=c; 
     println(7 + b + c);
}
```
This is again, something that isn't very helpful without some other optimizations, which we'll get to below.

### Inlining of functions

We can inline short functions into the original source code. This can sometimes increase execution speed for a couple reasons: The basic improvement is that we don't need to store the arguments, call, return, and get back the result. This is generally a smaller increase in speed, and is pretty much only important on short functions like `abs` or `max`, where the call overhead is comparable to the actual functionality.

The more important thing is that it brings more context into the caller function for the compiler to work with. Inlining lets the compiler optimize the callee in the context of the caller, instead of optimizing them separately. 

Lets inline `foo` into our original function.
```kt
fun main() {
     val a = 7 
     var c = 7 
     c += 1
     val b = 14 + block@ {
         val i = 7
         return@block if(i < 2) 19 else 18
     }() + c
     if(b < 7) error("reached illegal state")
     while(b > c) c+=c; 
     println(7 + b + c);
}
```
This is getting into some more complex Kotlin syntax, but you can think of it like a block (several statements) being used as an expression. The `block@` allows it to return the value locally. As an example,
```kt
block@ { return@block 1 + 20 } + 300
```
would evaluate to `321`

You can see how we set `i` to the value we passed in for `i` in the original function, `7`.

Now, we can optimize this further with expression folding and constant value propagation. We'll look at just the block for a second.
```kt
block@ {
    val i = 7
    return@block if(7 < 2) 19 else 18
}()
```

 `if(7 < 2)` will clearly fold down to `true`, so we can simplify just down to `19`.
 ```kt
 block@ {
     val i = 7
     return@block 19
 }()
 ```
 Because this is kotlin, we can optimize `block@ { return@block 19 }` down to `19`. This gives us, back to our original function.
 ```kt
fun main() {
     val a = 7 
     var c = 7 
     c += 1
     val b = 14 + 19 + c // note the 19 here
     if(b < 7) error("reached illegal state")
     while(b > c) c+=c; 
     println(7 + b + c);
}
```

And we can fold some more! 
```kt
fun main() {
    val a = 7 
    var c = 7
    c += 1
    val b = 23 + c // added 14 and 19 together
    if(b < 7) error("reached illegal state")
    while(b > c) c+=c; 
    println(7 + b + c);
}
```

Now, this is great and all, but it isn't perfect. You or me could optimize this better, so we're going to need a couple more tools. 

### Dead Code Elimination

Dead Code Elimination, or DCE, is removing code that does nothing. This is a pretty simple reducement of the code
- If a variable is not used, it can be reduced to the expression it's set to
```kt
val a = 7 + b// can turn to
7 + b // just sitting there
```
- If an expression is not used, and it is pure, it can be deleted
```kt
7 // would be allowed to deleted
```
- If an expression is not used, and the outer layer is pure, the outer layer can be deleted
```kt
foo() + bar() // if this exists, and is not used, it can be optimized to
foo(); bar() // with no add
```
- If some code is unreachable, it can be deleted. This one we won't touch on today as it's more language-specific
```kt
return 7
print("hi!") // this line can be deleted as it will never be reached
```

With these rules, we can delete the `a` variable from our program, and it's value `7` as it's pure.
```kt
fun main() {
    // no more a lol
    var c = 7 
    c += 1
    val b = 23 + c
    if(b < 7) error("reached illegal state")
    while(b > c) c+=c; 
    println(7 + b + c);
}
```

Now, this is pretty nice. However, it's not *that* good. It could be much better. And to do that, we're going to need some better tools

### Static Single Assignment Form

Also known as SSA, this one is rather hard to implement in compilers. However, we'll give it a go.

SSA is the idea "what if, every variable was final, and we just made a new variable every single time we assigned it?"

For example, a trivial program like
```kt
var foo = 7
foo += foo*foo
```
might look hard to optimize logically. If we use SSA, though, we get
```kt
val foo_0 = 7
val foo_1 = foo_0 + foo_0 * foo_0
```
which can be optimized down to a perfect constant, `val foo_1 = 56`, trivially with the above methods. 

Let's run our program through SSA.
```kt
fun main() {
    val c_0 = 7
    c_1 = c_0 + 1
    val b = 23 + c_1
    if(b < 7) error("reached illegal state")
    while(b > c) c+=c; // wait a minute, what do we do here?
    println(7 + b + c);
}
```
The answer is that we make a very fancy control flow graph, which recurs on itself, and has a finite amount of c_n variables.

However, that is hard! We're going to skip that for now, and introduce a `c_mut` variable for when we need to do that
```kt
fun main() {
    val c_0 = 7
    val c_1 = c_0 + 1
    val b = 23 + c_1
    if(b < 7) error("reached illegal state")
    var c_mut = c_1
    while(b > c_mut) c_mut+=c_mut
    println(7 + b + c_mut);
}
```

Now, you can see here it's trivial to evaluate large amounts of this code
```kt
fun main() {
    val c_0 = 7
    val c_1 = 7 + 1 // c_0 can be rolled into here, so we should really do
    val c_1 = 8
    val b = 23 + c_1 // we can also evaluate this simply, and we should actually just do
    val b = 31 // 2^5-1, nice
    if(31 < 7) error("reached illegal state") // DCE can delete this statement as it'll never run, as well as the 'if' statement
    var c_mut = c_1; // we'll wait on optimizing this for a bit
    while(31 > c_mut) c_mut+=c_mut
    println(7 + 31 + c_mut); // inlining of b, should really be
    println(38 + c_mut) // evaluating the addition
}
```
That was a big mess of duplicate lines, so let's rewrite that
```kt
fun main() {
    val c_0 = 7
    val c_1 = 8
    val b = 31
    var c_mut = c_1; // we'll wait on optimizing this for a bit
    while(31 > c_mut) c_mut+=c_mut
    println(38 + c_mut) // evaluating the addition
}
```
Let's run DCE real quick, as we can delete `c_0`, `c_1`, and `b`.
```kt
fun main() {
    var c_mut = 8; // we'll wait on optimizing this for a bit
    while(31 > c_mut) c_mut+=c_mut
    println(38 + c_mut)
}
```

Now, this is pretty damn good, what we've done already. 
However, because I added this at the beginning, I feel obligated to finish it off :p

### How (not really) to do loops in SSA

Let's make an assumption that normal compilers are unable to make: that the loop will terminate within 5 iterations.
This is the only way to solve this without a nice, recursive graph, which is hard to represent in a textual format.
This is *not* how this is done in actual compilers.

So, let's think about how we can remove this loop. We need to remember how while loops actually flow.
```
               /----------false-------\       
start -> conditional ---true--> body-> \---> rest of the program
            /\                  /
             \-----------------/
```
If we want to remove the recursive structure here, we could do it manually just by repeating the conditional. Here's a loop that runs max 2 iterations
```
               /-------false------------------------------------------------\/
start -> conditional --true--> body -> conditional --true--> body -------> rest of the program
                                            \--------false------------------/\
```
We could model this with an `if` statement,
```kt
if(cond) {
    body
    if(cond) {
        body
    }
}
```
Knowing this, we can change our original program (*again, you need to remember that this only works when we have a small upper iteration limit*)
```kt
fun main() {
    val c_10 = 8;
    if(c_10 < 31) {
        val c_11 = c_10 + c_10
        if(c_11 < 31) {
            val c_12 = c_11 + c_12
            if(c_12 < 31) {
                val c_13 = c_12 + c_12
                if(c_13 < 31) {
                    val c_14 = c_13 + c_13
                    // at this point, c_14 is <31 (as per our assumption)
                }
            }
        }
    }
    // we still have an issue here, what variable do we print here?
    println(38 + c_???)
}
```
The answer to the `c_???` question is: there's not a great way to figure this out. Again, normal ~~people~~ compilers would use proper SSA and not have this problem. We'll just.. ignore it for now. The answer will be obvious after some - you guessed it! - expression folding and variable inlining.
```kt
fun main() {
    val c_10 = 8;
    if(/*c_10 < 31*/ true) {
        //val c_11 = 8 + 8
        val c_11 = 16
        if(/*c_11 < 31*/ true) {
            // val c_12 = 16 + 16
            val c_12 = 32
            if(/*c_12 < 31*/ false) {
                /*val c_13 = c_12 + c_12 
                if(c_13 < 31) {          // all of this can be deleted as the 'if' statement will evaluate to false, via DCE
                    val c_14 = c_13 + c_13
                }*/
            }
        }
    }
    println(38 + c_???)
}
```
With SSA, the lines between scopes are blurred
```kt
fun main() {
    val c_10 = 8
    val c_11 = 16
    val c_12 = 32
    println(38 + c_???)
}
```
I guess we can assume our `c_???` to be `c_12`, as it's the last version of `c` ever set (remember that these are still just `c` in the original function), which gives us
```kt
fun main() {
    val c_10 = 8
    val c_11 = 16
    val c_12 = 32
    println(38 + 32)
}
```
...DCE
```kt
fun main() {
    println(38 + 32)
}
```
...folding
```kt
fun main() {
    println(70)
}
```
Woo! We've perfectly optimized this program, in a logical process. For reference, here's the original function.
```kt
fun main() {
     val a = 7
     var c = a
     c += 1
     val b = a*2 + foo(a) + c
     if(b < a) error("reached illegal state")
     while(b > c) c+=c; // do some fun doubling
     println(a + b + c);
}

fun foo(i: Int): Int {
    return if(i < 2) 19 else 18;
}
```

