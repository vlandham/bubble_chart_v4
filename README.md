# Animated Bubble Chart

Creating Animated Bubble Charts using [D3 version 4](https://d3js.org/)!

## Description

This repository contains code to create your own animated bubble chart using D3v4.

D3 version 4 has some significant API changes - especially to the force layout, which
is used in this bubble chart, so this is great news for any bubble lovers who also
want to use the latest and greatest D3.

If you are still using D3v3, but also like bubbles,
check out [my previous bubble chart tutorial](http://vallandingham.me/bubble_charts_in_js.html)

An associated blog post for lessons learned in switching to v4 is in the works.

A live version of this code is here:

[http://vallandingham.me/bubble_chart_v4/](http://vallandingham.me/bubble_chart_v4/)

## Running

D3 needs to be run from a web server due to how it imports data files.

See more here: https://github.com/mbostock/d3/wiki#using

So, to run this visualization locally, from the Terminal, navigate to the directory you checked it out to

```
cd ~/code/path/to/bubble_chart_v4
```

Then start a webserver locally. If you are on a Linux or Mac, you should be able to use python's built in webserver:

```
python -m SimpleHTTPServer 3000
```

Alternatively, I have switched to using node's [http-server](https://www.npmjs.com/package/http-server)
for local hosting.

Ensure you have the node package installed:

```
npm install -g http-server
```

And then run it in the root directory of the repository.

```
http-server
```

## Caveats

**Bubbles might not be the answer to your problems**

While the bubbles are flashy and are fun to watch move around, they may not be the best visual form to display your information in. In most cases, when bubbles are used to encode a single variable, the two dimensional bubble inflates and obscures the one dimensional value it is attempting to display.

Kaiser Fung hates bubble charts. You can see lots of reasons why here: http://junkcharts.typepad.com/junk_charts/bubble_chart/

Just keep in mind when you are working with your data: Bubbles aren't always the answer.
