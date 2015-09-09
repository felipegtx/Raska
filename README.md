# Raska
HTML5 canvas visual directed graph creation tool.

![](http://felipegtx.github.io/Raska/img/raska_prt.png)

## What's this - *exactly*?

You can either go take a look at the **[live sample of a simple graph](http://felipegtx.github.io/Raska/RaskSample.html)** 
or **[read about it](http://felipegte.com/2015/08/20/raska-criacaoexportacao-de-grafos-direcionados-usando-html5/)** (*Pt-br*).

You can also take a look into the commented source code 
**[here](http://felipegtx.github.io/Raska/docs/index.html)**

##Usage

Here are the basic setup for the library. If you need/want to learn more, please refer to the [docs](http://felipegtx.github.io/Raska/docs/index.html)

### Basic setup
- Create a canvas element in your page

```html
<canvas id="raskaContent" width="800" height="600"></canvas>
```

- Add raska.js library

```html
<script type="text/javascript" src="src/raska.js"></script>
```

- Initialize it to a valid *Canvas*

```javascript
raska.installUsing({ targetCanvasId: "raskaContent" });
```

### Element tracking / repositioning

To create a circle, you can easily just do

```javascript
var circle = raska.newCircle();
```

Don't forget to register it in the library in order to get it rendered. To do so, just call the ```plot``` method like so:

```javascript
raska.plot(circle);
```

By keeping the reference to the element you can easily (re)define its properties (eg: its position) at any time without any further hassle. For example if you want it to move to the right you can just do:

```javascript
circle.x += 10;
```
- **Sample [here](http://felipegtx.github.io/Raska/RaskSample.html) and [here](http://felipegtx.github.io/Raska/ContainerSample.html)**

### Animation

By using ```raska.animation``` you can easily set a new behaviour to your element. 

```javascript
 //// The raska animation
raska.animation
     /// Configures raska to save the initial state for all animations so we can loop without sidefects
     .saveInitialStates()
     
    /// Fade in the circle
     .fadeIn(circle)
     
    /// Execute the animations in loop 
    ///     PS: here you can also provide an parameter to set the interval beteween animations
      .loop();
```

- **Sample [here](http://felipegtx.github.io/Raska/AnimationSample.html)**
 
## Known limitations

For now, only Google Chrome is supported.
