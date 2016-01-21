![Raska](logo.png "Raska.js")

HTML5 canvas visual directed graph creation tool.

## What's this - *exactly*?

You can read about it **[here](http://felipegte.com/2015/08/20/raska-criacaoexportacao-de-grafos-direcionados-usando-html5/)** (*Pt-br*), take a look into the commented source code 
**[here](http://felipegtx.github.io/Raska/docs/index.html)** and go through the examples bellow.

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

### Animation

By using ```raska.animation``` you can easily set a new behaviour to your element. 

```javascript
 //// The raska animation
raska.animation.on(circle)

    /// Fade in the circle
     .fadeIn()
     
    /// Execute the animations in loop 
    ///     PS: here you can also provide an parameter to set the interval beteween animations
      .loop();
```

### Public delegates / cutpoints

Raska' public interface provides a handlfull of helper delegates to allow you to proper control/handle the elements behaviour/interaction. 

The delegates are the following:
* Any Raska element exposes
  * The ```on``` property
     * [```click```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-click) method
     * [```release```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-release) method
  * [```canLink```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-canLink) delegate (customizable *via override*) allows you to control whether or not a new link can be stabilished between two elements.
  * [```isSerializable```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-isSerializable) delegate (customizable *via override*) allows you to control whether or not a given element should be serialized as part of the JSON graph.
  * [```notifyDisableStateOn```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-notifyDisableStateOn) method allows you to subscribe to receive a notification whenever an element **is about to** get removed from the canvas
  * [```beforeRemoveLinkFrom```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-beforeRemoveLinkFrom) method allows you to subscribe to receive a notification whenever an element **is about to** get a link removed from it
  * [```beforeRemoveLinkTo```](http://felipegtx.github.io/Raska/docs/classes/_basicElement.html#method-beforeRemoveLinkFrom) method allows you to subscribe to receive a notification whenever an element **is about to** get a link pointing to it

### Examples

- [Directed graph](http://felipegtx.github.io/RaskSample.html) 
   - **Get a JSON from a canvas**
      ```javascript
      raska.getElementsString()
      ```
      
   - **Load a JSON into the canvas**
      ```javascript
      /// Here we grap the JSON from a previous graph we've saved and...
      var elementGraph = document.getElementById("elementGraph").value;
      
      /// load it back into the canvas
      raska.loadElementsFrom(elementGraph);
      ```
   - **Adding a subscriber for click iteractions on a given element (touchscreen friendly)**
   
      ```javascript
      triangle.on.click(function (x, y, e, ev) {
        console.log("You've clicked in this triangle", e);
      });
      ```
- [Container](http://felipegtx.github.io/Raska/samples/ContainerSample.html)
   - **Tracking the mouse position**
   
      ```javascript
      raska.onCanvasInteraction("mousemove", /// this could also be 'click'
         function (evtData) {
           console.log("The mouse is moving", evtData);
         });
      ```
- [Logo builder](http://felipegtx.github.io/Raska/samples/LogoBuilder.html)
- [Animation](http://felipegtx.github.io/Raska/samples/AnimationSample.html)
- [A simple game](http://felipegtx.github.io/Raska/samples/AnimationSample2.html)
- [Heatmap for *calienteJS*](https://github.com/felipegtx/calienteJs)

### Sample JSON graph data
```json
[{
    "linksTo": ["circle__ff5e8210892115f6d96e874eb35571bf"],
    "childElements": ["label__6db884d155fd45405928523d1cbd1dd6"],
    "parent": null,
    "type": "circle",
    "name": "circle__28123e80e6068bc52bee1ab8d726ddad",
    "border": {
        "color": "gray",
        "active": true,
        "width": 2
    },
    "fillColor": "silver",
    "radius": 20,
    "attr": {},
    "graphNode": true,
    "position": 0,
    "x": 85.22943037974683,
    "y": 102.58964143426294
}, {
    "linksTo": [],
    "childElements": [],
    "parent": "circle__28123e80e6068bc52bee1ab8d726ddad",
    "type": "label",
    "name": "label__6db884d155fd45405928523d1cbd1dd6",
    "graphNode": false,
    "text": "Start",
    "color": "gray",
    "x": 0,
    "y": 0,
    "border": {
        "color": "white",
        "active": true,
        "width": 2
    },
    "font": {
        "family": "Arial",
        "size": "12px",
        "decoration": ""
    },
    "attr": {},
    "position": 0
}, {
    "linksTo": [],
    "childElements": ["label__f22ea400baa01ddebcbc88ffcb7e09d4"],
    "parent": null,
    "type": "circle",
    "name": "circle__ff5e8210892115f6d96e874eb35571bf",
    "border": {
        "color": "gray",
        "active": true,
        "width": 2
    },
    "fillColor": "silver",
    "radius": 20,
    "attr": {},
    "graphNode": true,
    "position": 0,
    "x": 309.0189873417722,
    "y": 107.56972111553785
}, {
    "linksTo": [],
    "childElements": [],
    "parent": "circle__ff5e8210892115f6d96e874eb35571bf",
    "type": "label",
    "name": "label__f22ea400baa01ddebcbc88ffcb7e09d4",
    "graphNode": false,
    "text": "Done!",
    "color": "gray",
    "x": 0,
    "y": 0,
    "border": {
        "color": "white",
        "active": true,
        "width": 2
    },
    "font": {
        "family": "Arial",
        "size": "12px",
        "decoration": ""
    },
    "attr": {},
    "position": 0
}]
```

### Roadmap
- [ ] Visual tool to create Directed graphs
  - [x] Square
  - [x] Triangle
  - [x] Circle
  - [x] Arrow
  - [ ] Custom shape drawing tool
- [x] Add/Remove elements programatically
- [x] Add/Remove elements' links programatically
- [x] Generic collision/click check algorithm
- [x] Animation library
    - [x] FadeIn effect
    - [x] FadeOut effect
    - [x] Move effect
- [x] Save to image
- [x] Export to JSON
- [x] Import from JSON
- [x] Fullscreen mode
 - [x] Go/back from fullscreen
 - [ ] Automatically adapt to screen size changes (when in fullscreen)
- [ ] Element properties panel
- [ ] Unity tests

## License
See [LICENSE](https://github.com/felipegtx/Raska/blob/master/LICENSE) file
