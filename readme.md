# LUT Parser & Editor Tool by Mikhail Leon

This standalone tool creates, views, modifies and saves **generic** LUT files, with added visual support through a graph & table environment. It supports comments and positive float numbers.

## Video demonstration
https://github.com/user-attachments/assets/45ecfc5c-e811-48aa-b6c1-13aa7fc4178e


*Note: Reference image obtained from [Edmunds](https://www.edmunds.com/car-reviews/track-tests/2012-lexus-lfa-dyno-tested.html). Music is 'Girl from Petaluma' by Cocktail Shakers.*

## What is a LUT?

A LUT is a generic [lookup table](https://en.wikipedia.org/wiki/Lookup_table) file. It is a simple method of storing a relationship between one value and another (in this case, **x** and **y**), not dissimilar to an array or hashmap.

**x --> y** or F(**x**) = **y**

There is no standardized spec for how a LUT file looks. The custom-built parser within the tool will read files structured similarly to this:
```
;This is a global comment
0  |  50  ;This is a comment on the specific Point (0,50). For x = 0, y = 50. F(0)=50.
5  |  80.5
10  |  60
20  |  50
```
The tool will then populate the sorted data as defined in the file, while also maintaining persistence of comment lines.
Due to the use case, the tool will assume the constraint of moving linearly from the *lowest* **x** to the *highest* **x** and also assume only positive values for both **x** and **y**.

## What is a LUT used for?

It is used for any process that wants to easily store & quickly access a 2D mathematical relationship **x --> y**. Think of a graph - you have the **x** points, but you want to find the **y** points for any given **x**. The relationship is defined by placement of known data points; as such, its nature can be arbitrary and is not bound to a single expression, such as a [polynomial](https://en.wikipedia.org/wiki/Polynomial) or [trigonometric](https://en.wikipedia.org/wiki/Trigonometric_functions) expression. It is defined instead by the placement of known data.

This can be useful for storing any 2D graph, such as a car engine's torque curve, usually obtained in real-life by getting [dyno](https://en.wikipedia.org/wiki/Dynamometer) data. This data can then be used to help create accurate simulations of an engine in a driving simulator, or to represent *any* other known physical relationship in vehicle dynamics. The relationships can even be chained to get multidimensional (3D or higher) information.

![If You Understand Volumetric Efficiency You Understand Engines 6-31 screenshot](https://github.com/user-attachments/assets/5926cd52-32cc-495a-bd9b-812e7d6adbf3)

Another popular example is color LUTs that [color-grade](https://en.wikipedia.org/wiki/Color_grading) photo or video footage as part of the creative process of editing by defining specific relationships between initial pixel color values and desired output.

![lut-example](https://github.com/user-attachments/assets/9f06ba11-9a68-4301-8a2a-313659b2fe80)

The tool can load in reference images, either from a local path on the user's device, or from a URL, but the host of the image must allow 'anonymous' fetching (for example, images hosted on Twitter currently allow this, but not all hosts will). There are a few controls to help align references correctly, but it's preferable this be done externally ahead of time.

## What happens to the values inbetween that were not defined?

That depends on the software that is interpreting the data. Generally, some interpolation will be performed by using known adjacent values. The tool offers 3 of the most common modes for visualizing such interpolation:

**None**, **Cubic** and **Linear**.

![interpolation-visualized](https://github.com/user-attachments/assets/039ef647-9107-4a08-8d14-0ae29ee881d8)
*Note: the '**Cubic**' interpolation here is more specifically a [Catmull-Rom Spline (Centripetal)](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline), which guarantees a curve to smoothly move through all points, unlike a standard [Bézier Curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).*
